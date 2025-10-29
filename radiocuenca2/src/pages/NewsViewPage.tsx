import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link as MuiLink, 
  Paper, 
  CircularProgress,
  Alert,
  Button,
  CardMedia,
  Container,
  useTheme
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CalendarToday } from '@mui/icons-material';
import { getNewsById } from '../services/newsService';
// import { getMockNewsById } from '../services/mockNewsService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { News } from '../services/newsService';

const NewsViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!id) {
          throw new Error('ID de noticia no válido');
        }
        const data = await getNewsById(parseInt(id));
        setNews(data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('No se pudo cargar la noticia. Es posible que no exista o haya sido eliminada.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  // Función para renderizar el contenido del video de YouTube
  const renderVideo = (url: string) => {
    // Extraer el ID del video de YouTube
    const getYoutubeId = (youtubeUrl: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = youtubeUrl.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYoutubeId(url);
    if (!videoId) return null;

    return (
      <Box sx={{ mt: 3, mb: 4 }}>
        <iframe
          width="100%"
          height="450"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !news) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'No se encontró la noticia'}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </Button>
      </Box>
    );
  }

  const formattedDate = format(
    new Date(news.publish_date), 
    'dd MMMM yyyy',
    { locale: es }
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink 
          component={Link} 
          to="/" 
          color="inherit"
          sx={{
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              color: 'primary.main'
            }
          }}
        >
          Inicio
        </MuiLink>
        <MuiLink 
          component={Link} 
          to="/noticias" 
          color="inherit"
          sx={{
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              color: 'primary.main'
            }
          }}
        >
          Noticias
        </MuiLink>
        <Typography color="text.primary">
          {news.title}
        </Typography>
      </Breadcrumbs>

      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 3, md: 6 }, 
          borderRadius: 4,
          boxShadow: isDark 
            ? '0 8px 40px rgba(0, 0, 0, 0.4)' 
            : '0 8px 40px rgba(139, 90, 43, 0.12)',
          backgroundColor: isDark ? 'rgba(24, 16, 12, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          border: isDark ? '1px solid rgba(193, 154, 107, 0.15)' : '1px solid rgba(139, 90, 43, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: isDark
              ? 'linear-gradient(90deg, #C19A6B 0%, #D9BC97 50%, #C19A6B 100%)'
              : 'linear-gradient(90deg, #8B5A2B 0%, #A67C52 50%, #8B5A2B 100%)'
          }
        }}
      >
        {/* Título y fecha */}
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 800,
            mb: 3,
            fontFamily: '"Playfair Display", serif',
            color: isDark ? '#E8D4B8' : '#5D3A1A',
            lineHeight: 1.25,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            letterSpacing: '-0.02em'
          }}
        >
          {news.title}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: 4,
          pb: 3,
          borderBottom: isDark 
            ? '2px solid rgba(193, 154, 107, 0.2)' 
            : '2px solid rgba(139, 90, 43, 0.15)'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: isDark 
              ? 'rgba(193, 154, 107, 0.1)' 
              : 'rgba(139, 90, 43, 0.08)'
          }}>
            <CalendarToday sx={{ fontSize: 18, color: isDark ? '#C19A6B' : '#8B5A2B' }} />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: isDark ? '#D9BC97' : '#8B5A2B'
              }}
            >
              {formattedDate}
            </Typography>
          </Box>
        </Box>
        
        
        {/* Imagen destacada */}
        {news.image_url && (
          <Box sx={{ 
            mb: 5,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: isDark 
              ? '0 20px 50px rgba(0, 0, 0, 0.4)' 
              : '0 20px 50px rgba(139, 90, 43, 0.15)',
            border: isDark 
              ? '1px solid rgba(193, 154, 107, 0.2)' 
              : '1px solid rgba(139, 90, 43, 0.1)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              border: isDark 
                ? '3px solid rgba(193, 154, 107, 0.1)' 
                : '3px solid rgba(139, 90, 43, 0.05)',
              borderRadius: 4,
              pointerEvents: 'none'
            }
          }}>
            <CardMedia
              component="img"
              image={news.image_url}
              alt={news.title}
              sx={{ 
                width: '100%',
                maxHeight: '600px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </Box>
        )}
        
        {/* Video */}
        {news.video_url && (
          <Box sx={{
            mb: 5,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: isDark 
              ? '0 20px 50px rgba(0, 0, 0, 0.4)' 
              : '0 20px 50px rgba(139, 90, 43, 0.15)'
          }}>
            {renderVideo(news.video_url)}
          </Box>
        )}
        
        {/* Contenido */}
        <Box sx={{
          mb: 6,
          '& p': {
            mb: 3,
            lineHeight: 1.9,
            fontSize: { xs: '1.05rem', md: '1.15rem' },
            color: isDark ? 'rgba(240, 227, 206, 0.92)' : 'rgba(74, 55, 40, 0.92)',
            fontFamily: '"Poppins", sans-serif',
            textAlign: 'justify'
          },
          '& p:first-of-type::first-letter': {
            fontSize: '3.5em',
            fontWeight: 700,
            lineHeight: 0.9,
            float: 'left',
            marginRight: '0.15em',
            marginTop: '0.1em',
            color: isDark ? '#C19A6B' : '#8B5A2B',
            fontFamily: '"Playfair Display", serif'
          }
        }}>
          {news.content.split('\n').map((paragraph, index) => (
            <Typography 
              key={index}
              component="p"
              variant="body1"
            >
              {paragraph}
            </Typography>
          ))}
        </Box>
        
        {/* Botones de navegación */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: { xs: 'center', sm: 'space-between' },
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 3,
          mt: 6,
          pt: 5,
          borderTop: 2,
          borderColor: isDark ? 'rgba(193, 154, 107, 0.2)' : 'rgba(139, 90, 43, 0.15)'
        }}>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/noticias"
            size="large"
            sx={{
              borderWidth: 2,
              borderRadius: 12,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              borderColor: isDark ? '#C19A6B' : '#8B5A2B',
              color: isDark ? '#C19A6B' : '#8B5A2B',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderWidth: 2,
                borderColor: isDark ? '#D9BC97' : '#A67C52',
                backgroundColor: isDark ? 'rgba(193, 154, 107, 0.1)' : 'rgba(139, 90, 43, 0.05)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Ver todas las noticias
          </Button>
          
          <Button 
            variant="contained" 
            component={Link} 
            to="/"
            size="large"
            sx={{
              borderRadius: 12,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              background: isDark 
                ? 'linear-gradient(135deg, #C19A6B 0%, #AA8062 100%)'
                : 'linear-gradient(135deg, #8B5A2B 0%, #A67C52 100%)',
              boxShadow: isDark 
                ? '0 4px 20px rgba(193, 154, 107, 0.3)'
                : '0 4px 20px rgba(139, 90, 43, 0.25)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: isDark 
                  ? '0 8px 30px rgba(193, 154, 107, 0.4)'
                  : '0 8px 30px rgba(139, 90, 43, 0.35)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Volver al Inicio
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewsViewPage; 