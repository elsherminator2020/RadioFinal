import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link as MuiLink, 
  CircularProgress, 
  Alert,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  InputAdornment,
  Slider,
  Typography as MuiTypography
} from '@mui/material';
import { 
  Save, 
  Cancel, 
  Upload, 
  Delete, 
  Preview,
  Campaign,
  Business,
  Phone,
  Email,
  Link as LinkIcon
} from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAdvertisementById, 
  createAdvertisement, 
  updateAdvertisement,
  uploadAdvertisementImage,
  deleteAdvertisementImage
} from '../../services/advertisementService';
import type { Advertisement } from '../../services/advertisementService';

const AdvertisementEditorPage: React.FC<{ isEdit?: boolean }> = ({ isEdit = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [advertisement, setAdvertisement] = useState<Advertisement>({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    position: 'sidebar',
    size: 'medium',
    priority: 5,
    active: true,
    start_date: '',
    end_date: '',
    click_count: 0,
    impression_count: 0,
    advertiser_name: '',
    advertiser_email: '',
    advertiser_phone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  // Efecto para redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Cargar publicidad existente si es edición
  useEffect(() => {
    if (isEdit && id) {
      const fetchAdvertisement = async () => {
        setLoading(true);
        try {
          const data = await getAdvertisementById(parseInt(id));
          setAdvertisement(data);
          setImagePreview(data.image_url);
        } catch (err) {
          setError('Error al cargar la publicidad');
          console.error('Error fetching advertisement:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchAdvertisement();
    }
  }, [isEdit, id]);

  // Manejar cambios en los campos
  const handleChange = (field: keyof Advertisement) => (event: any) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setAdvertisement(prev => ({ ...prev, [field]: value }));
  };

  // Manejar cambio de archivo de imagen
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

  // Subir imagen
  const handleUploadImage = async () => {
    if (!imageFile) return;

    setUploadingImage(true);
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${imageFile.name}`;
      const imageUrl = await uploadAdvertisementImage(imageFile, fileName);
      
      setAdvertisement(prev => ({ ...prev, image_url: imageUrl }));
      setImageFile(null);
      setSuccess('Imagen subida correctamente');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
      console.error('Error uploading image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Eliminar imagen
  const handleDeleteImage = async () => {
    if (!advertisement.image_url) return;

    try {
      // Extraer el path de la URL
      const urlParts = advertisement.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await deleteAdvertisementImage(`advertisements/${fileName}`);
      
      setAdvertisement(prev => ({ ...prev, image_url: '' }));
      setImagePreview('');
      setSuccess('Imagen eliminada correctamente');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la imagen');
      console.error('Error deleting image:', err);
    }
  };

  // Guardar publicidad
  const handleSave = async () => {
    if (!advertisement.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!advertisement.image_url) {
      setError('La imagen es obligatoria');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEdit && id) {
        await updateAdvertisement(parseInt(id), advertisement);
        setSuccess('Publicidad actualizada correctamente');
      } else {
        await createAdvertisement(advertisement);
        setSuccess('Publicidad creada correctamente');
      }

      setTimeout(() => {
        setSuccess(null);
        navigate('/admin/advertisements');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la publicidad');
      console.error('Error saving advertisement:', err);
    } finally {
      setSaving(false);
    }
  };

  // Verificar carga y autenticación
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Inicio
        </MuiLink>
        <MuiLink component={Link} to="/admin" color="inherit">
          Administración
        </MuiLink>
        <MuiLink component={Link} to="/admin/advertisements" color="inherit">
          Publicidades
        </MuiLink>
        <Typography color="text.primary">
          {isEdit ? 'Editar Publicidad' : 'Nueva Publicidad'}
        </Typography>
      </Breadcrumbs>

      {/* Título */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        {isEdit ? 'Editar Publicidad' : 'Nueva Publicidad'}
      </Typography>

      {/* Alertas */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Formulario principal */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Campaign />
              Información Básica
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título de la publicidad"
                  value={advertisement.title}
                  onChange={handleChange('title')}
                  required
                  helperText="Título que aparecerá en la publicidad"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={advertisement.description}
                  onChange={handleChange('description')}
                  multiline
                  rows={3}
                  helperText="Descripción opcional de la publicidad"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="URL de enlace"
                  value={advertisement.link_url}
                  onChange={handleChange('link_url')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="URL a la que dirigirá el clic"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Posición</InputLabel>
                  <Select
                    value={advertisement.position}
                    label="Posición"
                    onChange={handleChange('position')}
                  >
                    <MenuItem value="header">Encabezado</MenuItem>
                    <MenuItem value="sidebar">Lateral</MenuItem>
                    <MenuItem value="footer">Pie de página</MenuItem>
                    <MenuItem value="content">Contenido</MenuItem>
                    <MenuItem value="popup">Popup</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tamaño</InputLabel>
                  <Select
                    value={advertisement.size}
                    label="Tamaño"
                    onChange={handleChange('size')}
                  >
                    <MenuItem value="small">Pequeño</MenuItem>
                    <MenuItem value="medium">Mediano</MenuItem>
                    <MenuItem value="large">Grande</MenuItem>
                    <MenuItem value="banner">Banner</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <MuiTypography gutterBottom>
                    Prioridad: {advertisement.priority}
                  </MuiTypography>
                  <Slider
                    value={advertisement.priority}
                    onChange={(_, value) => handleChange('priority')({ target: { value } })}
                    min={1}
                    max={10}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                  <MuiTypography variant="caption" color="text.secondary">
                    Mayor número = mayor prioridad de visualización
                  </MuiTypography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de inicio"
                  type="datetime-local"
                  value={advertisement.start_date}
                  onChange={handleChange('start_date')}
                  InputLabelProps={{ shrink: true }}
                  helperText="Opcional: cuándo debe comenzar a mostrarse"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de fin"
                  type="datetime-local"
                  value={advertisement.end_date}
                  onChange={handleChange('end_date')}
                  InputLabelProps={{ shrink: true }}
                  helperText="Opcional: cuándo debe dejar de mostrarse"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={advertisement.active}
                      onChange={handleChange('active')}
                    />
                  }
                  label="Publicidad activa"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Información del anunciante */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business />
              Información del Anunciante
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Nombre del anunciante"
                  value={advertisement.advertiser_name}
                  onChange={handleChange('advertiser_name')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Email del anunciante"
                  type="email"
                  value={advertisement.advertiser_email}
                  onChange={handleChange('advertiser_email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Teléfono del anunciante"
                  value={advertisement.advertiser_phone}
                  onChange={handleChange('advertiser_phone')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Panel lateral */}
        <Grid item xs={12} md={4}>
          {/* Imagen */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Imagen de la Publicidad
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {imagePreview ? (
              <Box sx={{ mb: 2 }}>
                <CardMedia
                  component="img"
                  height={200}
                  image={imagePreview}
                  alt="Preview"
                  sx={{ borderRadius: 1 }}
                />
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Preview />}
                    onClick={() => setPreviewDialogOpen(true)}
                    size="small"
                  >
                    Vista Previa
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleDeleteImage}
                    size="small"
                  >
                    Eliminar
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload />}
                    fullWidth
                    sx={{ py: 3 }}
                  >
                    Seleccionar Imagen
                  </Button>
                </label>
              </Box>
            )}

            {imageFile && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Archivo seleccionado: {imageFile.name}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={uploadingImage ? <CircularProgress size={16} /> : <Upload />}
                  onClick={handleUploadImage}
                  disabled={uploadingImage}
                  fullWidth
                >
                  {uploadingImage ? 'Subiendo...' : 'Subir Imagen'}
                </Button>
              </Box>
            )}

            {/* Información de dimensiones recomendadas */}
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'info.main', 
              color: 'info.contrastText',
              borderRadius: 2,
              border: '2px solid',
              borderColor: 'info.dark'
            }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                📊 Dimensiones Recomendadas:
              </Typography>
              {advertisement.position === 'header' && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Ancho:</strong> 1400px (recomendado)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Alto:</strong> Flexible (se adapta automáticamente)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Alto máximo:</strong> 600px
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Ratio sugerido:</strong> 2.8:1 a 3.5:1 (horizontal)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Peso máximo:</strong> 1MB
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic', color: 'success.main' }}>
                    ✨ El contenedor se adapta automáticamente al tamaño de tu imagen
                  </Typography>
                </Box>
              )}
              {advertisement.position === 'sidebar' && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Ancho:</strong> 280px (recomendado)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Alto:</strong> Flexible (se adapta automáticamente)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Alto máximo:</strong> 300px
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Ratio sugerido:</strong> 2:1 a 3:1 (vertical/cuadrado)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Peso máximo:</strong> 300KB
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic', color: 'success.main' }}>
                    ✨ El contenedor se adapta automáticamente al tamaño de tu imagen
                  </Typography>
                </Box>
              )}
              {advertisement.position === 'footer' && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Ancho:</strong> 1200px (recomendado)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Alto:</strong> Flexible (se adapta automáticamente)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Alto máximo:</strong> 250px
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Ratio sugerido:</strong> 4:1 a 6:1 (horizontal)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Peso máximo:</strong> 500KB
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic', color: 'success.main' }}>
                    ✨ El contenedor se adapta automáticamente al tamaño de tu imagen
                  </Typography>
                </Box>
              )}
              {advertisement.position === 'content' && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Ancho:</strong> 800px (recomendado)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Alto:</strong> Flexible (se adapta automáticamente)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Alto máximo:</strong> 400px
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Ratio sugerido:</strong> 2:1 a 3:1 (horizontal)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Peso máximo:</strong> 600KB
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic', color: 'success.main' }}>
                    ✨ El contenedor se adapta automáticamente al tamaño de tu imagen
                  </Typography>
                </Box>
              )}
              {advertisement.position === 'popup' && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Ancho:</strong> 600px (recomendado)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Alto:</strong> Flexible (se adapta automáticamente)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Alto máximo:</strong> 500px
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Ratio sugerido:</strong> 1:1 a 2:1 (cuadrado/vertical)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>Peso máximo:</strong> 700KB
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic', color: 'success.main' }}>
                    ✨ El contenedor se adapta automáticamente al tamaño de tu imagen
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 1.5, borderColor: 'info.contrastText', opacity: 0.3 }} />
              <Typography variant="caption" display="block">
                📝 <strong>Formato:</strong> JPG o PNG | <strong>Resolución:</strong> 72 DPI
              </Typography>
            </Box>
          </Paper>

          {/* Herramientas de optimización */}
          <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              🛠️ Herramientas Recomendadas:
            </Typography>
            <Stack spacing={1}>
              <Box>
                <Typography variant="caption" display="block" fontWeight="bold">
                  Crear imágenes:
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Canva (canva.com) - Fácil y rápido<br/>
                  • Figma (figma.com) - Profesional
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" display="block" fontWeight="bold">
                  Optimizar imágenes:
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • TinyPNG (tinypng.com) - Reduce hasta 70%<br/>
                  • Squoosh (squoosh.app) - Herramienta de Google
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Acciones */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Acciones
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={16} /> : <Save />}
                onClick={handleSave}
                disabled={saving || !advertisement.title.trim() || !advertisement.image_url}
                fullWidth
              >
                {saving ? 'Guardando...' : 'Guardar Publicidad'}
              </Button>

              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => navigate('/admin/advertisements')}
                fullWidth
              >
                Cancelar
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo de vista previa */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Vista Previa de la Publicidad</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CardMedia
              component="img"
              image={imagePreview}
              alt="Preview"
              sx={{ maxHeight: 400, objectFit: 'contain' }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {advertisement.title}
            </Typography>
            {advertisement.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {advertisement.description}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvertisementEditorPage;

