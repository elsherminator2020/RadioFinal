import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Switch, 
  FormControlLabel, 
  Alert, 
  CircularProgress,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Stack,
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Save, 
  Cancel, 
  Schedule, 
  Radio, 
  Person, 
  Category,
  Upload,
  Delete,
  Preview,
  Close,
  Warning,
  Info,
  CheckCircle,
  Error as ErrorIcon,
  ExpandMore,
  ExpandLess,
  Help
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createProgram, updateProgram, uploadProgramImage, uploadProgramImageFallback } from '../../services/programmingService';
import type { Program } from '../../services/programmingService';

interface ProgrammingFormProps {
  initialData?: Program;
  isEdit?: boolean;
}

interface FormData {
  program_name: string;
  description: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  program_type: 'music' | 'news' | 'talk' | 'sports' | 'variety';
  host_name?: string;
  image_url?: string;
  active: boolean;
}

const ProgrammingForm: React.FC<ProgrammingFormProps> = ({ initialData, isEdit = false }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isStorageError, setIsStorageError] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      program_name: initialData?.program_name || '',
      description: initialData?.description || '',
      day_of_week: initialData?.day_of_week || '',
      start_time: initialData?.start_time || '',
      end_time: initialData?.end_time || '',
      program_type: initialData?.program_type || 'music',
      host_name: initialData?.host_name || '',
      image_url: initialData?.image_url || '',
      active: initialData?.active ?? true,
    }
  });

  const watchStartTime = watch('start_time');
  const watchEndTime = watch('end_time');
  const watchProgramType = watch('program_type');

  // Opciones de días de la semana
  const dayOptions = [
    { value: 'lunes-viernes', label: 'Lunes a Viernes' },
    { value: 'sabados', label: 'Sábados' },
    { value: 'domingos', label: 'Domingos' },
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' },
  ];

  // Opciones de tipo de programa
  const typeOptions = [
    { value: 'music', label: 'Música', color: '#2196F3' },
    { value: 'news', label: 'Noticias', color: '#F44336' },
    { value: 'talk', label: 'Conversación', color: '#9C27B0' },
    { value: 'sports', label: 'Deportes', color: '#4CAF50' },
    { value: 'variety', label: 'Variedad', color: '#FF9800' },
  ];

  const getCurrentTypeColor = () => {
    const type = typeOptions.find(t => t.value === watchProgramType);
    return type?.color || '#757575';
  };

  // Manejar carga de imagen
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar imagen
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue('image_url', '');
  };

  // Validar horarios
  const validateTimes = () => {
    if (watchStartTime && watchEndTime) {
      return watchStartTime < watchEndTime;
    }
    return true;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setIsStorageError(false);

    try {
      // Validar horarios
      if (!validateTimes()) {
        throw new Error('La hora de inicio debe ser anterior a la hora de finalización');
      }

      let imageUrl = data.image_url;

      // Subir imagen si hay una nueva
      if (imageFile) {
        setUploadingImage(true);
        const timestamp = Date.now();
        const fileName = `${timestamp}-${imageFile.name}`;
        
        try {
          // Intentar subir la imagen con la función principal
          imageUrl = await uploadProgramImage(imageFile, fileName);
          setSuccess('Imagen subida exitosamente');
        } catch (uploadError: any) {
          console.warn('Error with main upload, trying fallback:', uploadError);
          
          // Marcar como error de almacenamiento para mostrar ayuda
          if (uploadError.message?.includes('almacenamiento') || uploadError.message?.includes('bucket')) {
            setIsStorageError(true);
          }
          
          // Si falla, intentar con el método de fallback
          try {
            imageUrl = await uploadProgramImageFallback(imageFile, fileName);
            setSuccess('Imagen procesada exitosamente (modo alternativo)');
          } catch (fallbackError: any) {
            console.error('Both upload methods failed:', fallbackError);
            setIsStorageError(true);
            throw new Error(`Error al subir la imagen: ${uploadError.message || uploadError}`);
          }
        }
      }

      const programData: Program = {
        ...data,
        image_url: imageUrl || undefined,
      };

      let result: Program;
      if (isEdit && initialData?.id) {
        result = await updateProgram(initialData.id, programData);
        setSuccess('Programa actualizado exitosamente');
      } else {
        result = await createProgram(programData);
        setSuccess('Programa creado exitosamente');
      }

      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate('/admin/programming');
      }, 2000);

    } catch (err: any) {
      console.error('Error saving program:', err);
      
      // Proporcionar mensajes de error más específicos
      let errorMessage = 'Error al guardar el programa';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.code) {
        switch (err.code) {
          case 'PGRST116':
            errorMessage = 'Error de conexión con la base de datos';
            break;
          case '23505':
            errorMessage = 'Ya existe un programa con estos datos';
            break;
          default:
            errorMessage = `Error del sistema: ${err.code}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/programming');
  };

  const renderStorageHelpAlert = () => (
    <Alert 
      severity="error" 
      sx={{ mb: 3 }}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => setIsStorageError(false)}
        >
          <Close fontSize="inherit" />
        </IconButton>
      }
    >
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            🔒 Error de configuración de Supabase Storage
          </Typography>
          <Typography variant="body2" color="text.secondary">
            El almacenamiento requiere configuración manual debido a políticas de seguridad (RLS).
          </Typography>
        </Box>
        
        <Box>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setShowHelp(!showHelp)}
            startIcon={showHelp ? <ExpandLess /> : <ExpandMore />}
          >
            {showHelp ? 'Ocultar' : 'Ver'} solución
          </Button>
        </Box>
        
        <Collapse in={showHelp}>
          <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'error.main' }}>
              ⚠️ Configuración Manual Requerida
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Los usuarios no pueden crear buckets automáticamente. Siga estos pasos:
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Typography variant="body2" fontWeight="bold" color="primary">1.</Typography>
                </ListItemIcon>
                <ListItemText 
                  primary="Ir a Supabase Dashboard" 
                  secondary="https://supabase.com/dashboard → Su proyecto → Storage"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Typography variant="body2" fontWeight="bold" color="primary">2.</Typography>
                </ListItemIcon>
                <ListItemText 
                  primary="Crear bucket 'programming-images'" 
                  secondary="Create bucket → Nombre: programming-images → Público: ✅"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Typography variant="body2" fontWeight="bold" color="primary">3.</Typography>
                </ListItemIcon>
                <ListItemText 
                  primary="Configurar políticas RLS" 
                  secondary="Storage → Policies → New policy → Permitir INSERT/SELECT para usuarios autenticados"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Typography variant="body2" fontWeight="bold" color="primary">4.</Typography>
                </ListItemIcon>
                <ListItemText 
                  primary="Verificar configuración" 
                  secondary="Recargar esta página e intentar subir una imagen"
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="caption" fontWeight="bold">
                💡 Código SQL para políticas RLS:
              </Typography>
              <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                <Typography variant="caption" component="pre">
{`-- Política para subir imágenes
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'programming-images');

-- Política para leer imágenes
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'programming-images');`}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Collapse>
      </Stack>
    </Alert>
  );

  return (
    <Box>
      {/* Mensajes de estado */}
      {isStorageError && renderStorageHelpAlert()}
      
      {error && !isStorageError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          
          {/* Información básica */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Radio sx={{ mr: 1 }} />
                Información del Programa
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="program_name"
                    control={control}
                    rules={{ 
                      required: 'El nombre del programa es obligatorio',
                      minLength: {
                        value: 3,
                        message: 'El nombre debe tener al menos 3 caracteres'
                      },
                      maxLength: {
                        value: 100,
                        message: 'El nombre no puede tener más de 100 caracteres'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Nombre del Programa"
                        fullWidth
                        required
                        error={!!errors.program_name}
                        helperText={errors.program_name?.message || `${field.value?.length || 0}/100 caracteres`}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ 
                      required: 'La descripción es obligatoria',
                      minLength: {
                        value: 10,
                        message: 'La descripción debe tener al menos 10 caracteres'
                      },
                      maxLength: {
                        value: 500,
                        message: 'La descripción no puede tener más de 500 caracteres'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Descripción del Programa"
                        fullWidth
                        required
                        multiline
                        rows={4}
                        error={!!errors.description}
                        helperText={errors.description?.message || `${field.value?.length || 0}/500 caracteres`}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="host_name"
                    control={control}
                    rules={{
                      maxLength: {
                        value: 100,
                        message: 'El nombre no puede tener más de 100 caracteres'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Conductor/es"
                        fullWidth
                        placeholder="Nombre del conductor o equipo"
                        error={!!errors.host_name}
                        helperText={errors.host_name?.message || 'Opcional'}
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="program_type"
                    control={control}
                    rules={{ required: 'El tipo de programa es obligatorio' }}
                    render={({ field }) => (
                      <FormControl fullWidth required error={!!errors.program_type}>
                        <InputLabel>Tipo de Programa</InputLabel>
                        <Select
                          {...field}
                          label="Tipo de Programa"
                          startAdornment={<Category sx={{ mr: 1, color: getCurrentTypeColor() }} />}
                        >
                          {typeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Box 
                                  sx={{ 
                                    width: 12, 
                                    height: 12, 
                                    borderRadius: '50%', 
                                    bgcolor: option.color 
                                  }} 
                                />
                                <Typography>{option.label}</Typography>
                              </Stack>
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.program_type && (
                          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                            {errors.program_type.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Horarios y días */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 1 }} />
                Programación y Horarios
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="day_of_week"
                    control={control}
                    rules={{ required: 'El día de la semana es obligatorio' }}
                    render={({ field }) => (
                      <FormControl fullWidth required error={!!errors.day_of_week}>
                        <InputLabel>Día de la Semana</InputLabel>
                        <Select
                          {...field}
                          label="Día de la Semana"
                        >
                          {dayOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.day_of_week && (
                          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                            {errors.day_of_week.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Controller
                    name="start_time"
                    control={control}
                    rules={{ required: 'La hora de inicio es obligatoria' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Hora de Inicio"
                        type="time"
                        fullWidth
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!!errors.start_time || !validateTimes()}
                        helperText={
                          errors.start_time?.message || 
                          (!validateTimes() ? 'La hora de inicio debe ser anterior a la de fin' : '')
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Controller
                    name="end_time"
                    control={control}
                    rules={{ required: 'La hora de finalización es obligatoria' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Hora de Finalización"
                        type="time"
                        fullWidth
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!!errors.end_time || !validateTimes()}
                        helperText={
                          errors.end_time?.message || 
                          (!validateTimes() ? 'La hora de fin debe ser posterior a la de inicio' : '')
                        }
                      />
                    )}
                  />
                </Grid>

                {/* Preview del horario */}
                {watchStartTime && watchEndTime && validateTimes() && (
                  <Grid item xs={12}>
                    <Card sx={{ bgcolor: 'background.default' }}>
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Preview />
                          <Typography variant="body2">
                            <strong>Vista previa:</strong> {watchStartTime} - {watchEndTime}
                          </Typography>
                          <Chip 
                            label={typeOptions.find(t => t.value === watchProgramType)?.label || watchProgramType}
                            sx={{ bgcolor: getCurrentTypeColor(), color: 'white' }}
                            size="small"
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Imagen del programa */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Upload sx={{ mr: 1 }} />
                Imagen del Programa
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={uploadingImage ? <CircularProgress size={20} /> : <Upload />}
                    disabled={uploadingImage}
                    sx={{ height: 56 }}
                  >
                    {uploadingImage ? 'Subiendo...' : 'Seleccionar Imagen'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Formatos soportados: JPG, PNG, WEBP (opcional)
                  </Typography>
                </Grid>

                {imagePreview && (
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={imagePreview}
                        alt="Preview del programa"
                      />
                      <CardActions>
                        <Tooltip title="Eliminar imagen">
                          <IconButton onClick={handleRemoveImage} color="error">
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Estado del programa */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Estado del Programa
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Stack>
                        <Typography variant="body1">
                          {field.value ? 'Programa Activo' : 'Programa Inactivo'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {field.value 
                            ? 'El programa aparecerá en la programación pública' 
                            : 'El programa estará oculto para los usuarios'
                          }
                        </Typography>
                      </Stack>
                    }
                  />
                )}
              />
            </Paper>
          </Grid>

          {/* Botones de acción */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                  disabled={isSubmitting || !validateTimes()}
                >
                  {isSubmitting 
                    ? (isEdit ? 'Actualizando...' : 'Creando...') 
                    : (isEdit ? 'Actualizar Programa' : 'Crear Programa')
                  }
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProgrammingForm; 