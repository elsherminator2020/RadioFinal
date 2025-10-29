import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Chip,
  Divider,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  useMediaQuery,
  CircularProgress,
  Alert,
  LinearProgress,
  Fade
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Schedule,
  MusicNote,
  Newspaper,
  Mic,
  Sports,
  Weekend,
  Radio,
  AccessTime,
  Person,
  Headset,
  RadioButtonChecked,
  ViewWeek,
  Event,
  CalendarToday
} from '@mui/icons-material';
import { 
  getProgramming, 
  getCurrentProgram, 
  getNextProgram
} from '../services/programmingService';
import type { Program } from '../services/programmingService';
import WeeklyCalendar from '../components/home/WeeklyCalendar';

// Interfaces para el estado
interface CurrentShow {
  current: Program | null;
  next: Program | null;
  timeUntilNext: number;
  progressPercentage: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Componente TabPanel
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProgrammingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentShow, setCurrentShow] = useState<CurrentShow>({
    current: null,
    next: null,
    timeUntilNext: 0,
    progressPercentage: 0
  });
  const [tabValue, setTabValue] = useState(0);

  // Días de la semana para las pestañas
  const dayTabs = [
    { value: 'lunes-viernes', label: 'Lun-Vie', icon: <ViewWeek /> },
    { value: 'sabados', label: 'Sábados', icon: <Weekend /> },
    { value: 'domingos', label: 'Domingos', icon: <CalendarToday /> },
    { value: 'calendar', label: 'Calendario', icon: <Event /> },
  ];

  // Cargar programación inicial
  useEffect(() => {
    const fetchProgramming = async () => {
      try {
        const [allPrograms, current, next] = await Promise.all([
          getProgramming(),
          getCurrentProgram(),
          getNextProgram()
        ]);
        
        setPrograms(allPrograms);
        setCurrentShow({
          current,
          next,
          timeUntilNext: calculateTimeUntilNext(next),
          progressPercentage: calculateProgress(current)
        });
      } catch (err) {
        setError('Error al cargar la programación');
        console.error('Error fetching programming:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramming();
  }, []);

  // Actualizar programa actual cada minuto
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [current, next] = await Promise.all([
          getCurrentProgram(),
          getNextProgram()
        ]);
        
        setCurrentShow({
          current,
          next,
          timeUntilNext: calculateTimeUntilNext(next),
          progressPercentage: calculateProgress(current)
        });
      } catch (err) {
        console.error('Error updating current show:', err);
      }
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  // Calcular tiempo hasta el próximo programa
  const calculateTimeUntilNext = (next: Program | null): number => {
    if (!next) return 0;
    
    const now = new Date();
    const [hours, minutes] = next.start_time.split(':').map(Number);
    const nextTime = new Date();
    nextTime.setHours(hours, minutes, 0, 0);
    
    if (nextTime < now) {
      nextTime.setDate(nextTime.getDate() + 1);
    }
    
    return Math.max(0, Math.floor((nextTime.getTime() - now.getTime()) / 60000)); // en minutos
  };

  // Calcular progreso del programa actual
  const calculateProgress = (current: Program | null): number => {
    if (!current) return 0;
    
    const now = new Date();
    const [startHours, startMinutes] = current.start_time.split(':').map(Number);
    const [endHours, endMinutes] = current.end_time.split(':').map(Number);
    
    const startTime = new Date();
    startTime.setHours(startHours, startMinutes, 0, 0);
    
    const endTime = new Date();
    endTime.setHours(endHours, endMinutes, 0, 0);
    
    const total = endTime.getTime() - startTime.getTime();
    const elapsed = now.getTime() - startTime.getTime();
    
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  // Obtener icono por tipo de programa
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'music': return <MusicNote />;
      case 'news': return <Newspaper />;
      case 'talk': return <Mic />;
      case 'sports': return <Sports />;
      case 'variety': return <Weekend />;
      default: return <Radio />;
    }
  };

  // Obtener color por tipo de programa
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'music': return '#2196F3';
      case 'news': return '#F44336';
      case 'talk': return '#9C27B0';
      case 'sports': return '#4CAF50';
      case 'variety': return '#FF9800';
      default: return '#757575';
    }
  };

  // Obtener etiqueta de tipo
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'music': return 'Música';
      case 'news': return 'Noticias';
      case 'talk': return 'Conversación';
      case 'sports': return 'Deportes';
      case 'variety': return 'Variedad';
      default: return 'Radio';
    }
  };

  // Filtrar programas por día
  const getProgramsByDay = (day: string) => {
    return programs.filter(program => program.day_of_week === day && program.active)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  // Formatear tiempo restante
  const formatTimeRemaining = (minutes: number): string => {
    if (minutes === 0) return 'Próximamente';
    if (minutes < 60) return `En ${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `En ${hours}h ${mins}m` : `En ${hours}h`;
  };

  // Renderizar tarjeta de programa actual
  const renderCurrentShow = () => {
    if (!currentShow.current) {
      return (
        <Card sx={{ mb: 4, bgcolor: 'grey.100' }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Radio sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Sin programación en vivo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Música automática
              </Typography>
            </Box>
          </CardContent>
        </Card>
      );
    }

    return (
      <Fade in={true}>
        <Card 
          sx={{ 
            mb: 4, 
            background: `linear-gradient(135deg, ${getTypeColor(currentShow.current.program_type)}20, ${getTypeColor(currentShow.current.program_type)}05)`,
            border: `2px solid ${getTypeColor(currentShow.current.program_type)}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Barra de progreso */}
          <LinearProgress 
            variant="determinate" 
            value={currentShow.progressPercentage}
            sx={{ 
              height: 4,
              backgroundColor: `${getTypeColor(currentShow.current.program_type)}20`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: getTypeColor(currentShow.current.program_type)
              }
            }}
          />
          
          <CardContent>
                         <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
               <Chip 
                 icon={<RadioButtonChecked />} 
                 label="EN VIVO" 
                 color="error" 
                 variant="filled"
                 sx={{ fontWeight: 'bold', animation: 'pulse 2s infinite' }}
               />
              <Chip 
                icon={getTypeIcon(currentShow.current.program_type)}
                label={getTypeLabel(currentShow.current.program_type)}
                sx={{ 
                  bgcolor: getTypeColor(currentShow.current.program_type),
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            </Stack>

            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                {currentShow.current.image_url ? (
                  <CardMedia
                    component="img"
                    height={120}
                    image={currentShow.current.image_url}
                    alt={currentShow.current.program_name}
                    sx={{ borderRadius: 2 }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 120,
                      bgcolor: getTypeColor(currentShow.current.program_type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                      color: 'white'
                    }}
                  >
                    {getTypeIcon(currentShow.current.program_type)}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h2" gutterBottom>
                  {currentShow.current.program_name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {currentShow.current.description}
                </Typography>
                
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body2">
                      {currentShow.current.start_time} - {currentShow.current.end_time}
                    </Typography>
                  </Stack>
                  
                  {currentShow.current.host_name && (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Person fontSize="small" />
                      <Typography variant="body2">
                        {currentShow.current.host_name}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    Progreso
                  </Typography>
                  <Typography variant="h3" sx={{ color: getTypeColor(currentShow.current.program_type) }}>
                    {Math.round(currentShow.progressPercentage)}%
                  </Typography>
                  
                  {currentShow.next && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Próximo programa:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {currentShow.next.program_name}
                      </Typography>
                      <Typography variant="caption" color="primary">
                        {formatTimeRemaining(currentShow.timeUntilNext)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  // Renderizar lista de programas por día
  const renderProgramList = (dayPrograms: Program[]) => {
    if (dayPrograms.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Schedule sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Sin programación
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No hay programas programados para este día
          </Typography>
        </Paper>
      );
    }

    return (
      <List disablePadding>
        {dayPrograms.map((program, index) => (
          <React.Fragment key={program.id}>
            <ListItem 
              sx={{ 
                py: 2,
                '&:hover': { bgcolor: 'action.hover' },
                borderLeft: `4px solid ${getTypeColor(program.program_type)}`,
                position: 'relative'
              }}
            >
              <ListItemIcon>
                {program.image_url ? (
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: 1,
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={program.image_url}
                      alt={program.program_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: getTypeColor(program.program_type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    {getTypeIcon(program.program_type)}
                  </Box>
                )}
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h6">
                      {program.program_name}
                    </Typography>
                    {currentShow.current?.id === program.id && (
                      <Chip size="small" label="EN VIVO" color="error" />
                    )}
                  </Stack>
                }
                secondary={
                  <React.Fragment>
                    <Typography variant="body2" color="text.secondary" component="div">
                      {program.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1 }}>
                      <AccessTime fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {program.start_time} - {program.end_time}
                      {program.host_name && (
                        <>
                          {' • '}
                          <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          {program.host_name}
                        </>
                      )}
                    </Typography>
                  </React.Fragment>
                }
                secondaryTypographyProps={{
                  component: 'div'
                }}
              />
              
              <ListItemSecondaryAction>
                <Chip
                  size="small"
                  label={getTypeLabel(program.program_type)}
                  sx={{ 
                    bgcolor: getTypeColor(program.program_type),
                    color: 'white'
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            {index < dayPrograms.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    );
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Título */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Programación
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Radio Cuenca Cañera 94.5 FM
        </Typography>
      </Box>

      {/* Programa Actual */}
      {renderCurrentShow()}

      {/* Pestañas de días */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
        >
          {dayTabs.map((day) => (
            <Tab 
              key={day.value}
              label={day.label}
              icon={day.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
        
        {dayTabs.map((day, index) => (
          <TabPanel key={day.value} value={tabValue} index={index}>
            {day.value === 'calendar' ? (
              <WeeklyCalendar onProgramSelect={(program) => console.log('Selected program:', program)} />
            ) : (
              renderProgramList(getProgramsByDay(day.value))
            )}
          </TabPanel>
        ))}
      </Paper>

      {/* Información adicional */}
      <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Headset sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h6">
              Escúchanos en Vivo
            </Typography>
            <Typography variant="body2">
              Sintoniza FM 94.5 o escucha nuestro stream online las 24 horas
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Estilos para animación */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Container>
  );
};

export default ProgrammingPage; 