import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Radio as RadioIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import type { Program } from '../../services/programmingService';

interface ProgramCardProps {
  program: Program;
  onDelete: (id: number) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onDelete }) => {
  const getDayLabel = (day: string) => {
    const days: { [key: string]: string } = {
      'monday': 'Lunes',
      'tuesday': 'Martes',
      'wednesday': 'Miércoles',
      'thursday': 'Jueves',
      'friday': 'Viernes',
      'saturday': 'Sábado',
      'sunday': 'Domingo'
    };
    return days[day] || day;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      {program.image_url && (
        <CardMedia
          component="img"
          height="200"
          image={program.image_url}
          alt={program.program_name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
          <Chip 
            icon={<ScheduleIcon />}
            label={`${program.start_time} - ${program.end_time}`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            icon={<RadioIcon />}
            label={getDayLabel(program.day_of_week)} 
            size="small" 
            color="success" 
          />
        </Stack>
        
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
            minHeight: '2.6em',
            mb: 1
          }}
        >
          {program.program_name}
        </Typography>
        
        {program.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5,
              minHeight: '4.5em'
            }}
          >
            {program.description}
          </Typography>
        )}
        
        {program.host_name && (
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}
          >
            Conducido por: {program.host_name}
          </Typography>
        )}
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Editar">
            <IconButton 
              size="small" 
              color="primary"
              component={Link}
              to={`/admin/programming/edit/${program.id}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Eliminar">
            <IconButton 
              size="small" 
              color="error"
              onClick={() => onDelete(program.id!)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default ProgramCard;
