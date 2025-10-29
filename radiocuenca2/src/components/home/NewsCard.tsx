import React from 'react';
import { 
  Card, 
  CardActionArea, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box,
  Button,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarToday, ArrowForward, AccessTime } from '@mui/icons-material';
import type { News } from '../../services/newsService';

interface NewsCardProps {
  news: News;
  compact?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, compact = false }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { id, title, content, image_url, publish_date } = news;
  
  // Formatear la fecha de publicación
  const formattedDate = format(
    new Date(publish_date), 
    'dd MMM yyyy',
    { locale: es }
  );
  
  // Truncar el contenido para la vista previa
  const truncatedContent = compact 
    ? content.substring(0, 100) + (content.length > 100 ? '...' : '')
    : content.substring(0, 180) + (content.length > 180 ? '...' : '');

  const handleClick = () => {
    navigate(`/noticias/${id}`);
  };

  return (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        border: isDark ? '1px solid rgba(193, 154, 107, 0.1)' : '1px solid rgba(139, 90, 43, 0.08)',
        boxShadow: isDark 
          ? '0 4px 20px rgba(0, 0, 0, 0.3)'
          : '0 4px 20px rgba(139, 90, 43, 0.08)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: isDark
            ? 'linear-gradient(90deg, #C19A6B 0%, #D9BC97 100%)'
            : 'linear-gradient(90deg, #8B5A2B 0%, #A67C52 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease'
        },
        '&:hover': {
          transform: 'translateY(-12px)',
          boxShadow: isDark
            ? '0 20px 50px rgba(0, 0, 0, 0.5)'
            : '0 20px 50px rgba(139, 90, 43, 0.15)',
          '&::before': {
            opacity: 1
          }
        }
      }}
    >
      <CardActionArea 
        onClick={handleClick}
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: '100%'
        }}
      >
        {image_url && (
          <Box sx={{ 
            position: 'relative', 
            width: '100%',
            overflow: 'hidden'
          }}>
            <CardMedia
              component="img"
              height={compact ? 200 : 240}
              image={image_url}
              alt={title}
              sx={{
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: isDark ? 'brightness(0.9)' : 'brightness(1)',
                '&:hover': {
                  transform: 'scale(1.08)'
                }
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                zIndex: 1
              }}
            />
            <Box sx={{ 
              position: 'absolute', 
              bottom: 12, 
              left: 12,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center'
            }}>
              <AccessTime sx={{ fontSize: 14, color: 'white', mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                {formattedDate}
              </Typography>
            </Box>
          </Box>
        )}
        
        <CardContent sx={{ 
          flexGrow: 1, 
          p: { xs: 2.5, md: 3 },
          width: '100%'
        }}>
          <Typography 
            gutterBottom 
            variant={compact ? "h6" : "h5"} 
            component="div"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontWeight: 700,
              mb: 2,
              lineHeight: 1.35,
              color: isDark ? '#D9BC97' : '#5D3A1A',
              fontSize: compact ? '1.15rem' : '1.4rem',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: isDark ? '#E8D4B8' : '#8B5A2B'
              }
            }}
          >
            {title}
          </Typography>
          
          {!image_url && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              opacity: 0.7
            }}>
              <CalendarToday fontSize="small" sx={{ mr: 1, fontSize: '0.875rem' }} />
              <Typography variant="caption">
                {formattedDate}
              </Typography>
            </Box>
          )}
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: compact ? 3 : 4,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.75,
              mb: 2,
              fontSize: '0.975rem',
              opacity: 0.85
            }}
          >
            {truncatedContent}
          </Typography>
        </CardContent>
      </CardActionArea>
      
      <Box sx={{ 
        p: { xs: 2.5, md: 3 }, 
        pt: 0,
        display: 'flex',
        alignItems: 'center',
        borderTop: isDark ? '1px solid rgba(193, 154, 107, 0.1)' : '1px solid rgba(139, 90, 43, 0.05)'
      }}>
        <Button 
          size="small" 
          color="primary" 
          onClick={handleClick}
          endIcon={<ArrowForward sx={{ fontSize: 18, transition: 'transform 0.3s ease' }} />}
          sx={{ 
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.925rem',
            p: 0,
            mt: 1,
            color: isDark ? '#C19A6B' : '#8B5A2B',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'transparent',
              color: isDark ? '#D9BC97' : '#A67C52',
              '& .MuiButton-endIcon': {
                transform: 'translateX(5px)'
              }
            }
          }}
        >
          Leer más
        </Button>
      </Box>
    </Card>
  );
};

export default NewsCard; 