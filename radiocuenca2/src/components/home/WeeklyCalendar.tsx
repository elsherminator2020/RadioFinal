import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Tooltip,
  IconButton,
  ButtonGroup,
  Button,
  Divider,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ChevronLeft,
  ChevronRight,
  MusicNote,
  Newspaper,
  Mic,
  Sports,
  Weekend,
  Radio,
  AccessTime,
  Person,
  CalendarViewWeek,
  ViewDay,
  Schedule
} from '@mui/icons-material';
import { getProgramming } from '../../services/programmingService';
import type { Program } from '../../services/programmingService';

interface WeeklyCalendarProps {
  onProgramSelect?: (program: Program) => void;
  compact?: boolean;
}

interface TimeSlot {
  hour: number;
  programs: Record<string, Program | null>;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  onProgramSelect,
  compact = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState(0); // 0 = Lunes
  
  // Días de la semana
  const daysOfWeek = [
    { key: 'lunes', label: 'Lunes', shortLabel: 'Lun' },
    { key: 'martes', label: 'Martes', shortLabel: 'Mar' },
    { key: 'miercoles', label: 'Miércoles', shortLabel: 'Mié' },
    { key: 'jueves', label: 'Jueves', shortLabel: 'Jue' },
    { key: 'viernes', label: 'Viernes', shortLabel: 'Vie' },
    { key: 'sabado', label: 'Sábado', shortLabel: 'Sáb' },
    { key: 'domingo', label: 'Domingo', shortLabel: 'Dom' }
  ];

  // Horas del día (6 AM a 10 PM)
  const hoursOfDay = Array.from({ length: 16 }, (_, i) => i + 6);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getProgramming();
        setPrograms(data.filter(p => p.active));
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

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

  // Obtener icono por tipo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'music': return <MusicNote fontSize="small" />;
      case 'news': return <Newspaper fontSize="small" />;
      case 'talk': return <Mic fontSize="small" />;
      case 'sports': return <Sports fontSize="small" />;
      case 'variety': return <Weekend fontSize="small" />;
      default: return <Radio fontSize="small" />;
    }
  };

  // Expandir programación L-V a días individuales
  const expandPrograms = (programs: Program[]): Program[] => {
    const expanded: Program[] = [];
    
    programs.forEach(program => {
      if (program.day_of_week === 'lunes-viernes') {
        // Crear programa para cada día de L-V
        ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].forEach(day => {
          expanded.push({ ...program, day_of_week: day });
        });
      } else if (program.day_of_week === 'sabados') {
        expanded.push({ ...program, day_of_week: 'sabado' });
      } else if (program.day_of_week === 'domingos') {
        expanded.push({ ...program, day_of_week: 'domingo' });
      } else {
        expanded.push(program);
      }
    });
    
    return expanded;
  };

  // Obtener programa para un día y hora específicos
  const getProgramForTimeSlot = (day: string, hour: number): Program | null => {
    const expandedPrograms = expandPrograms(programs);
    
    return expandedPrograms.find(program => {
      if (program.day_of_week !== day) return false;
      
      const [startHour] = program.start_time.split(':').map(Number);
      const [endHour] = program.end_time.split(':').map(Number);
      
      return hour >= startHour && hour < endHour;
    }) || null;
  };

  // Generar estructura de la semana
  const generateWeekStructure = (): TimeSlot[] => {
    return hoursOfDay.map(hour => ({
      hour,
      programs: daysOfWeek.reduce((acc, day) => {
        acc[day.key] = getProgramForTimeSlot(day.key, hour);
        return acc;
      }, {} as Record<string, Program | null>)
    }));
  };

  // Renderizar celda de programa
  const renderProgramCell = (program: Program | null, hour: number) => {
    if (!program) {
      return (
        <Box
          sx={{
            height: compact ? 40 : 60,
            bgcolor: 'grey.100',
            border: '1px solid',
            borderColor: 'grey.300',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1
          }}
        >
          <Typography variant="caption" color="text.secondary">
            -
          </Typography>
        </Box>
      );
    }

    const isFirstHour = program.start_time.startsWith(hour.toString().padStart(2, '0'));
    const duration = calculateDuration(program.start_time, program.end_time);
    
    // Solo mostrar la celda completa en la primera hora del programa
    if (!isFirstHour) {
      return (
        <Box
          sx={{
            height: compact ? 40 : 60,
            bgcolor: `${getTypeColor(program.program_type)}20`,
            border: '1px solid',
            borderColor: getTypeColor(program.program_type),
            borderTop: 'none',
            borderRadius: 0
          }}
        />
      );
    }

    return (
      <Tooltip
        title={
          <Box>
            <Typography variant="subtitle2">{program.program_name}</Typography>
            <Typography variant="caption">
              {program.start_time} - {program.end_time}
            </Typography>
            {program.host_name && (
              <Typography variant="caption" display="block">
                Conductor: {program.host_name}
              </Typography>
            )}
          </Box>
        }
      >
        <Card
          sx={{
            height: compact ? duration * 40 : duration * 60,
            bgcolor: getTypeColor(program.program_type),
            color: 'white',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.02)',
              zIndex: 2
            },
            transition: 'transform 0.2s',
            borderRadius: 1,
            position: 'relative'
          }}
          onClick={() => onProgramSelect?.(program)}
        >
          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
            <Stack spacing={0.5}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {getTypeIcon(program.program_type)}
                <Typography 
                  variant={compact ? "caption" : "body2"} 
                  fontWeight="bold"
                  noWrap
                >
                  {program.program_name}
                </Typography>
              </Stack>
              
              {!compact && (
                <>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AccessTime sx={{ fontSize: 12 }} />
                    <Typography variant="caption">
                      {program.start_time} - {program.end_time}
                    </Typography>
                  </Stack>
                  
                  {program.host_name && (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Person sx={{ fontSize: 12 }} />
                      <Typography variant="caption" noWrap>
                        {program.host_name}
                      </Typography>
                    </Stack>
                  )}
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Tooltip>
    );
  };

  // Calcular duración en horas
  const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHour] = startTime.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);
    return endHour - startHour;
  };

  // Renderizar vista de semana
  const renderWeekView = () => {
    const weekStructure = generateWeekStructure();
    
    return (
      <Box sx={{ overflowX: 'auto' }}>
        <Grid container spacing={1} sx={{ minWidth: 800 }}>
          {/* Header con días */}
          <Grid item xs={1}>
            <Box sx={{ height: 40, display: 'flex', alignItems: 'center' }}>
              <Typography variant="caption" fontWeight="bold">
                Hora
              </Typography>
            </Box>
          </Grid>
          
          {daysOfWeek.map(day => (
            <Grid item xs key={day.key} sx={{ minWidth: 120 }}>
              <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="caption" fontWeight="bold">
                  {isMobile ? day.shortLabel : day.label}
                </Typography>
              </Paper>
            </Grid>
          ))}

          {/* Filas de horas */}
          {weekStructure.map(timeSlot => (
            <React.Fragment key={timeSlot.hour}>
              <Grid item xs={1}>
                <Box 
                  sx={{ 
                    height: compact ? 40 : 60, 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    {`${timeSlot.hour}:00`}
                  </Typography>
                </Box>
              </Grid>
              
              {daysOfWeek.map(day => (
                <Grid item xs key={`${timeSlot.hour}-${day.key}`} sx={{ minWidth: 120 }}>
                  {renderProgramCell(timeSlot.programs[day.key], timeSlot.hour)}
                </Grid>
              ))}
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    );
  };

  // Renderizar vista de día
  const renderDayView = () => {
    const selectedDayKey = daysOfWeek[selectedDay].key;
    const dayPrograms = programs
      .filter(p => {
        if (p.day_of_week === 'lunes-viernes' && 
            ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].includes(selectedDayKey)) {
          return true;
        }
        if (p.day_of_week === 'sabados' && selectedDayKey === 'sabado') return true;
        if (p.day_of_week === 'domingos' && selectedDayKey === 'domingo') return true;
        return p.day_of_week === selectedDayKey;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    return (
      <Box>
        <Typography variant="h6" gutterBottom textAlign="center">
          {daysOfWeek[selectedDay].label}
        </Typography>
        
        <Stack spacing={2}>
          {dayPrograms.map(program => (
            <Card 
              key={program.id}
              sx={{ 
                borderLeft: `4px solid ${getTypeColor(program.program_type)}`,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => onProgramSelect?.(program)}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
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
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {program.program_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {program.description}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <AccessTime fontSize="small" />
                        <Typography variant="caption">
                          {program.start_time} - {program.end_time}
                        </Typography>
                      </Stack>
                      {program.host_name && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Person fontSize="small" />
                          <Typography variant="caption">
                            {program.host_name}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Schedule sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
        <Typography>Cargando programación...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      {/* Header con controles */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 3 }}
      >
        <Typography variant="h6">
          Calendario de Programación
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center">
          {viewMode === 'day' && (
            <Stack direction="row" alignItems="center">
              <IconButton 
                onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                disabled={selectedDay === 0}
              >
                <ChevronLeft />
              </IconButton>
              
              <Typography variant="body2" sx={{ minWidth: 100, textAlign: 'center' }}>
                {daysOfWeek[selectedDay].label}
              </Typography>
              
              <IconButton 
                onClick={() => setSelectedDay(Math.min(6, selectedDay + 1))}
                disabled={selectedDay === 6}
              >
                <ChevronRight />
              </IconButton>
            </Stack>
          )}
          
          <ButtonGroup size="small">
            <Button
              variant={viewMode === 'week' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('week')}
              startIcon={<CalendarViewWeek />}
            >
              Semana
            </Button>
            <Button
              variant={viewMode === 'day' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('day')}
              startIcon={<ViewDay />}
            >
              Día
            </Button>
          </ButtonGroup>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Contenido del calendario */}
      {viewMode === 'week' ? renderWeekView() : renderDayView()}

      {/* Leyenda */}
      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" gutterBottom display="block">
          Tipos de Programa:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {[
            { type: 'music', label: 'Música' },
            { type: 'news', label: 'Noticias' },
            { type: 'talk', label: 'Conversación' },
            { type: 'sports', label: 'Deportes' },
            { type: 'variety', label: 'Variedad' }
          ].map(({ type, label }) => (
            <Chip
              key={type}
              icon={getTypeIcon(type)}
              label={label}
              size="small"
              sx={{
                bgcolor: `${getTypeColor(type)}20`,
                color: getTypeColor(type),
                '& .MuiChip-icon': { color: getTypeColor(type) }
              }}
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

export default WeeklyCalendar; 