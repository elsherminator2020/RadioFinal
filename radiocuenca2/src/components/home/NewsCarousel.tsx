import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Skeleton,
  Container
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  AccessTime,
  Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { News } from '../../services/newsService';

interface NewsCarouselProps {
  news: News[];
  loading?: boolean;
  title?: string;
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({
  news = [],
  loading = false,
  title = "Últimas Noticias"
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Determinar cuántas noticias mostrar
  const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 3;
  const maxIndex = Math.max(0, news.length - itemsPerPage);

  // Auto-avanzar el carrusel
  useEffect(() => {
    if (news.length <= itemsPerPage) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 8000); // Cambiar cada 8 segundos

    return () => clearInterval(interval);
  }, [news.length, itemsPerPage, maxIndex]);

  // Función para navegar a una noticia
  const handleNewsClick = (newsId?: number) => {
    if (newsId) {
      navigate(`/noticias/${newsId}`);
    }
  };

  // Funciones de navegación
  const handlePrevious = () => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  // Función para truncar texto
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Función para extraer síntesis
  const extractSummary = (content: string, maxLength: number = 120) => {
    const cleanContent = content.replace(/<[^>]*>/g, '');
    const sentences = cleanContent.split(/[.!?]+/);
    let summary = sentences[0];
    
    if (summary.length > maxLength) {
      summary = summary.substring(0, maxLength) + '...';
    } else if (sentences.length > 1 && (summary + sentences[1]).length <= maxLength) {
      summary += '. ' + sentences[1];
    }
    
    return summary || 'Resumen no disponible...';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: isDark ? '#C19A6B' : '#8B5A2B',
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            justifyContent: 'center'
          }}
        >
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <Card
              key={index}
              sx={{
                width: `calc(${100 / itemsPerPage}% - 16px)`,
                maxWidth: 350
              }}
            >
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={32} width="80%" />
                <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
                <Skeleton variant="text" height={16} width="100%" sx={{ mt: 2 }} />
                <Skeleton variant="text" height={16} width="90%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    );
  }

  if (!news.length) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, md: 4 }, position: 'relative' }}>
        <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center' }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: isDark ? 'primary.light' : 'primary.main',
              position: 'relative',
              display: 'inline-block',
              pb: 2,
              mb: 1,
              fontSize: { xs: '1.75rem', md: '2.125rem' },
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: '80px',
                height: '3px',
                backgroundColor: theme.palette.primary.main,
                transform: 'translateX(-50%)'
              }
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            opacity: 0.7
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No hay noticias disponibles en este momento
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, md: 4 }, position: 'relative' }}>
      {/* Título del carrusel */}
      <Typography
        variant="h4"
        component="h2"
        sx={{
          mb: { xs: 3, md: 4 },
          fontWeight: 700,
          color: isDark ? '#C19A6B' : '#8B5A2B',
          textAlign: 'center',
          fontSize: { xs: '1.75rem', md: '2.125rem' }
        }}
      >
        {title}
      </Typography>

      {/* Contenedor del carrusel */}
      <Box sx={{ position: 'relative' }}>
        {/* Botones de navegación */}
        {news.length > itemsPerPage && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: isDark ? 'rgba(193, 154, 107, 0.9)' : 'rgba(139, 90, 43, 0.9)',
                color: 'white',
                width: 50,
                height: 50,
                '&:hover': {
                  bgcolor: isDark ? 'rgba(193, 154, 107, 1)' : 'rgba(139, 90, 43, 1)',
                  transform: 'translateY(-50%) scale(1.1)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ArrowBackIos />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: isDark ? 'rgba(193, 154, 107, 0.9)' : 'rgba(139, 90, 43, 0.9)',
                color: 'white',
                width: 50,
                height: 50,
                '&:hover': {
                  bgcolor: isDark ? 'rgba(193, 154, 107, 1)' : 'rgba(139, 90, 43, 1)',
                  transform: 'translateY(-50%) scale(1.1)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          </>
        )}

        {/* Contenedor de las tarjetas */}
        <Box
          sx={{
            overflow: 'hidden',
            mx: { xs: 0, md: 3 }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              transition: 'transform 0.5s ease-in-out',
              gap: 3
            }}
          >
            {news.map((newsItem, index) => (
              <Card
                key={newsItem.id || index}
                sx={{
                  flex: `0 0 calc(${100 / itemsPerPage}% - ${(3 * (itemsPerPage - 1)) / itemsPerPage}px)`,
                  maxWidth: 350,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  bgcolor: isDark ? 'rgba(60, 42, 30, 0.8)' : 'white',
                  border: `1px solid ${isDark ? 'rgba(193, 154, 107, 0.2)' : 'rgba(139, 90, 43, 0.1)'}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                    '& .news-image': {
                      transform: 'scale(1.05)',
                    }
                  }
                }}
                onClick={() => handleNewsClick(newsItem.id)}
              >
                {/* Imagen de la noticia */}
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      newsItem.image_url ||
                      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1920&auto=format&fit=crop'
                    }
                    alt={newsItem.title}
                    className="news-image"
                    sx={{
                      transition: 'transform 0.5s ease',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Chip de categoría */}
                  <Chip
                    label="NOTICIA"
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      bgcolor: isDark ? '#C19A6B' : '#8B5A2B',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>

                {/* Contenido de la tarjeta */}
                <CardContent sx={{ p: 3 }}>
                  {/* Fecha de la noticia */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mb: 1.5
                    }}
                  >
                    <AccessTime 
                      sx={{ 
                        fontSize: 16, 
                        color: isDark ? '#C19A6B' : '#8B5A2B' 
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      sx={{
                        fontWeight: 500,
                        color: isDark ? '#C19A6B' : '#8B5A2B',
                        fontSize: '0.85rem'
                      }}
                    >
                      {formatDate(newsItem.publish_date)}
                    </Typography>
                  </Box>

                  {/* Título de la noticia */}
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      color: isDark ? '#F0E3CE' : '#4A3728',
                      fontSize: '1.1rem',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {truncateText(newsItem.title, 60)}
                  </Typography>

                  {/* Síntesis de la noticia */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark ? 'rgba(240, 227, 206, 0.8)' : 'rgba(74, 55, 40, 0.8)',
                      lineHeight: 1.5,
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {extractSummary(newsItem.content)}
                  </Typography>

                  {/* Botón para leer más */}
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<Visibility />}
                    sx={{
                      color: isDark ? '#C19A6B' : '#8B5A2B',
                      borderColor: isDark ? '#C19A6B' : '#8B5A2B',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: isDark ? 'rgba(193, 154, 107, 0.1)' : 'rgba(139, 90, 43, 0.1)',
                        borderColor: isDark ? '#C19A6B' : '#8B5A2B',
                      }
                    }}
                  >
                    Leer más
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Indicadores de navegación */}
        {news.length > itemsPerPage && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mt: 3
            }}
          >
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: currentIndex === index
                    ? (isDark ? '#C19A6B' : '#8B5A2B')
                    : (isDark ? 'rgba(193, 154, 107, 0.3)' : 'rgba(139, 90, 43, 0.3)'),
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default NewsCarousel; 