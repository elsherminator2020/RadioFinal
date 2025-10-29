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
  Slider,
  FormGroup,
  Checkbox,
  Autocomplete,
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
  Preview
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createProgram, updateProgram, uploadProgramImage } from '../../services/programmingService';
import type { Program } from '../../services/programmingService';

interface ProgramFormProps {
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
  // Nuevos campos expandidos
  tags?: string[];
  audience_target?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'special';
  contact_info?: string;
  social_media?: string;
  streaming_priority?: number;
}

const ProgramForm: React.FC<ProgramFormProps> = ({ initialData, isEdit = false }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
      tags: [],
      audience_target: '',
      frequency: 'weekly',
      contact_info: '',
      social_media: '',
      streaming_priority: 5,
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
        imageUrl = await uploadProgramImage(imageFile, fileName);
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
      setError(err.message || 'Error al guardar el programa');
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/programming');
  };

  return (
    <Box>
      {/* Mensajes de estado */}
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

          {/* Configuración Avanzada */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Category sx={{ mr: 1 }} />
                Configuración Avanzada
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="audience_target"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Audiencia Objetivo"
                        fullWidth
                        placeholder="Ej: Jóvenes 18-35, Familias, etc."
                        helperText="Describe el público objetivo del programa"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="frequency"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Frecuencia</InputLabel>
                        <Select
                          {...field}
                          label="Frecuencia"
                        >
                          <MenuItem value="daily">Diario</MenuItem>
                          <MenuItem value="weekly">Semanal</MenuItem>
                          <MenuItem value="monthly">Mensual</MenuItem>
                          <MenuItem value="special">Especial</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="contact_info"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Información de Contacto"
                        fullWidth
                        placeholder="WhatsApp, Email, etc."
                        helperText="Para que los oyentes puedan contactar el programa"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="social_media"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Redes Sociales"
                        fullWidth
                        placeholder="@usuario_programa"
                        helperText="Handle de redes sociales del programa"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" gutterBottom>
                    Prioridad de Streaming (1 = Baja, 10 = Alta)
                  </Typography>
                  <Controller
                    name="streaming_priority"
                    control={control}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        value={field.value || 5}
                        onChange={(_, value) => field.onChange(value)}
                        step={1}
                        marks
                        min={1}
                        max={10}
                        valueLabelDisplay="auto"
                        sx={{ mt: 2 }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        options={['Rock', 'Pop', 'Folclore', 'Clásica', 'Noticias Locales', 'Deportes', 'Entrevistas', 'En Vivo']}
                        value={field.value || []}
                        onChange={(_, value) => field.onChange(value)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Etiquetas del Programa"
                            placeholder="Agrega etiquetas..."
                            helperText="Presiona Enter para agregar etiquetas personalizadas"
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
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

export default ProgramForm; 