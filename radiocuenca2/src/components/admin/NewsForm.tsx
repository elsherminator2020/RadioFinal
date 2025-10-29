import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Tooltip
} from '@mui/material';
import { 
  PhotoCamera, 
  DeleteOutline, 
  YouTube, 
  Preview, 
  Link as LinkIcon,
  Image as ImageIcon,
  VideoLibrary
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { createNews, updateNews, uploadNewsImage } from '../../services/newsService';
import type { News } from '../../services/newsService';

interface NewsFormProps {
  initialData?: News;
  isEdit?: boolean;
}

type FormData = {
  title: string;
  content: string;
  publish_date: string;
  video_url?: string;
};

// Función para extraer ID de video de YouTube
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Función para validar URL de YouTube
const validateYouTubeUrl = (url: string): boolean => {
  if (!url) return true; // URL vacía es válida
  return getYouTubeVideoId(url) !== null;
};

// Componente para vista previa de YouTube
const YouTubePreview: React.FC<{ url: string }> = ({ url }) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  return (
    <Card sx={{ mt: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt="Vista previa del video"
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1}>
          <YouTube color="error" />
          <Typography variant="body2" color="text.secondary">
            Video de YouTube - ID: {videoId}
          </Typography>
          <Chip label="VIDEO" size="small" color="error" />
        </Stack>
      </CardContent>
    </Card>
  );
};

const NewsForm: React.FC<NewsFormProps> = ({ initialData, isEdit = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [uploading, setUploading] = useState(false);

  // Configurar react-hook-form
  const { control, handleSubmit, formState: { errors, isValid, isSubmitting }, reset, watch } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      publish_date: initialData?.publish_date 
        ? format(new Date(initialData.publish_date), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      video_url: initialData?.video_url || '',
    }
  });

  // Debug logging para el estado del formulario
  console.log('📝 Form state:', {
    isValid,
    isSubmitting,
    errors,
    loading
  });

  // Observar cambios en video_url para mostrar vista previa
  const videoUrl = watch('video_url');

  // Resetear formulario si cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        content: initialData.content,
        publish_date: initialData.publish_date 
          ? format(new Date(initialData.publish_date), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        video_url: initialData.video_url || '',
      });
      setImagePreview(initialData.image_url || null);
    }
  }, [initialData, reset]);

  // Manejar cambio de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no puede ser mayor a 5MB');
        return;
      }
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten archivos de imagen');
        return;
      }
      
      setImageFile(file);
      setError(null);
      
      // Crear URL para vista previa
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar imagen
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Enviar formulario
  const onSubmit = async (data: FormData) => {
    console.log('📋 Iniciando envío de formulario...');
    console.log('📊 Form data recibida:', data);
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validar URL de YouTube si se proporciona
      if (data.video_url && !validateYouTubeUrl(data.video_url)) {
        throw new Error('La URL de YouTube no es válida');
      }
      
      let imageUrl = initialData?.image_url || null;
      
      // Subir imagen si hay una nueva
      if (imageFile) {
        setUploading(true);
        try {
          // Crear nombre único para la imagen
          const timestamp = new Date().getTime();
          const fileName = `${timestamp}_${imageFile.name.replace(/\s+/g, '_')}`;
          
          // Subir la imagen
          imageUrl = await uploadNewsImage(imageFile, fileName);
          setUploading(false);
        } catch (err) {
          setUploading(false);
          throw new Error('Error al subir la imagen');
        }
      }
      
      // Crear objeto de noticia
      const newsData: News = {
        title: data.title,
        content: data.content,
        publish_date: data.publish_date,
        video_url: data.video_url || undefined,
        image_url: imagePreview ? (imageUrl || undefined) : undefined,
      };
      
      // Actualizar o crear noticia
      if (isEdit && initialData?.id) {
        console.log('🔄 Actualizando noticia con ID:', initialData.id);
        console.log('📝 Datos a actualizar:', newsData);
        const result = await updateNews(initialData.id, newsData);
        console.log('✅ Noticia actualizada exitosamente:', result);
        setSuccess('Noticia actualizada correctamente');
      } else {
        console.log('🆕 Creando nueva noticia...');
        console.log('📝 Datos a insertar:', newsData);
        const result = await createNews(newsData);
        console.log('✅ Noticia creada exitosamente:', result);
        setSuccess('Noticia creada correctamente');
        
        // Limpiar formulario después de crear
        if (!isEdit) {
          reset({
            title: '',
            content: '',
            publish_date: format(new Date(), 'yyyy-MM-dd'),
            video_url: '',
          });
          setImageFile(null);
          setImagePreview(null);
        }
      }
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        if (isEdit) {
          navigate('/admin');
        } else {
          // Para nuevas noticias, redirigir a la página principal para ver el resultado
          navigate('/');
        }
      }, 2000);
      
    } catch (err: any) {
      console.error('❌ Error saving news:', err);
      console.error('❌ Error details:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint,
        fullError: err
      });
      setError(err.message || 'Error al guardar la noticia. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEdit ? 'Editar Noticia' : 'Crear Nueva Noticia'}
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {Object.keys(errors).length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Por favor corrige los siguientes errores:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {errors.title && <li>{errors.title.message}</li>}
            {errors.content && <li>{errors.content.message}</li>}
            {errors.publish_date && <li>{errors.publish_date.message}</li>}
            {errors.video_url && <li>{errors.video_url.message}</li>}
          </ul>
        </Alert>
      )}
      
      <Box component="form" onSubmit={(e) => {
        console.log('🎯 Form submit event triggered');
        console.log('🔍 Form validation errors:', errors);
        console.log('🔍 Detailed errors:', JSON.stringify(errors, null, 2));
        handleSubmit(
          (data) => {
            console.log('✅ Validation passed, executing onSubmit');
            onSubmit(data);
          },
          (errors) => {
            console.log('❌ Validation failed:', errors);
          }
        )(e);
      }} noValidate>
        <Grid container spacing={3}>
          {/* Información básica */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LinkIcon sx={{ mr: 1 }} />
              Información Básica
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="title"
              control={control}
              rules={{ 
                required: 'El título es obligatorio',
                maxLength: {
                  value: 100,
                  message: 'El título no puede tener más de 100 caracteres'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Título de la Noticia"
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title?.message || `${field.value?.length || 0}/100 caracteres`}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="content"
              control={control}
              rules={{ 
                required: 'El contenido es obligatorio',
                minLength: {
                  value: 50,
                  message: 'El contenido debe tener al menos 50 caracteres'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contenido de la Noticia"
                  fullWidth
                  required
                  multiline
                  rows={10}
                  error={!!errors.content}
                  helperText={errors.content?.message || `${field.value?.length || 0} caracteres`}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="publish_date"
              control={control}
              rules={{ 
                required: 'La fecha de publicación es obligatoria'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha de Publicación"
                  type="date"
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.publish_date}
                  helperText={errors.publish_date?.message}
                />
              )}
            />
          </Grid>
          
          {/* Contenido multimedia */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <VideoLibrary sx={{ mr: 1 }} />
              Contenido Multimedia
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="video_url"
              control={control}
              rules={{
                validate: (value) => {
                  if (value && !validateYouTubeUrl(value)) {
                    return 'La URL de YouTube no es válida';
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="URL de Video de YouTube (Opcional)"
                  fullWidth
                  placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                  error={!!errors.video_url}
                  helperText={errors.video_url?.message || 'Pega la URL completa del video de YouTube'}
                  InputProps={{
                    startAdornment: <YouTube sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              )}
            />
            
            {/* Vista previa del video */}
            {videoUrl && validateYouTubeUrl(videoUrl) && (
              <YouTubePreview url={videoUrl} />
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ImageIcon sx={{ mr: 1 }} />
              Imagen Destacada (Opcional)
            </Typography>
            
            <Box sx={{ mt: 1, mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
                disabled={uploading}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<PhotoCamera />}
                  disabled={uploading}
                  sx={{ mr: 1 }}
                >
                  {imagePreview ? 'Cambiar Imagen' : 'Subir Imagen'}
                </Button>
              </label>
              
              {imagePreview && (
                <Tooltip title="Eliminar imagen">
                  <IconButton 
                    color="error" 
                    onClick={handleRemoveImage}
                    disabled={uploading}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
              Formatos admitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
            </Typography>
            
            {uploading && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Subiendo imagen...
                </Typography>
              </Box>
            )}
            
            {imagePreview && (
              <Card sx={{ mt: 2, maxWidth: 400 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={imagePreview}
                  alt="Vista previa de la imagen"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ImageIcon color="success" />
                    <Typography variant="body2" color="text.secondary">
                      Imagen destacada
                    </Typography>
                    <Chip label="IMAGEN" size="small" color="success" />
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>
          
          {/* Resumen del contenido */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Preview sx={{ mr: 1 }} />
              Resumen del Contenido
            </Typography>
            
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              {imagePreview && (
                <Chip 
                  icon={<ImageIcon />} 
                  label="Con Imagen" 
                  color="success" 
                  variant="outlined"
                />
              )}
              {videoUrl && validateYouTubeUrl(videoUrl) && (
                <Chip 
                  icon={<YouTube />} 
                  label="Con Video" 
                  color="error" 
                  variant="outlined"
                />
              )}
              {!imagePreview && (!videoUrl || !validateYouTubeUrl(videoUrl)) && (
                <Chip 
                  label="Solo Texto" 
                  color="default" 
                  variant="outlined"
                />
              )}
            </Stack>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin')}
                disabled={loading}
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || isSubmitting}
                startIcon={(loading || isSubmitting) && <CircularProgress size={20} color="inherit" />}
                onClick={() => {
                  console.log('🖱️ Botón Publicar clickeado');
                  console.log('🔄 Loading state:', loading);
                  console.log('📝 isSubmitting:', isSubmitting);
                  console.log('✏️ IsEdit mode:', isEdit);
                  console.log('🎯 Disabled state:', loading || isSubmitting);
                }}
              >
                {isEdit ? 'Actualizar Noticia' : 'Publicar Noticia'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default NewsForm; 