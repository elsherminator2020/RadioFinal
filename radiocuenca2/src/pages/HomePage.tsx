import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Container, 
  useTheme, 
  Divider, 
  Grow, 
  Fade,
  Grid,
  useMediaQuery
} from '@mui/material';
import NewsGrid from '../components/home/NewsGrid';
import NewsCarousel from '../components/home/NewsCarousel';
import { HeaderAdvertisements, ContentAdvertisements, SidebarAdvertisements } from '../components/advertisements/AdvertisementDisplay';
import { getNews } from '../services/newsService';
import { Link, useNavigate } from 'react-router-dom';
import type { News } from '../services/newsService';

const HomePage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('🔄 Cargando noticias desde Supabase...');
        const data = await getNews();
        console.log('✅ Noticias cargadas:', data);
        setNews(data);
      } catch (err) {
        setError('Error al cargar las noticias');
        console.error('❌ Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Obtener solo las 4 noticias más recientes para la sección destacada
  const featuredNews = news.slice(0, 4);
  
  // Obtener las siguientes 6 noticias para la sección de noticias recientes
  const recentNews = news.slice(4, 10);

  return (
    <Box sx={{ 
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100vw'
    }}>
      {/* Publicidades de encabezado */}
      <HeaderAdvertisements maxAds={1} />

      {/* Sección de bienvenida */}
      <Grow in={true} timeout={1000}>
        <Container maxWidth="xl" sx={{ mb: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 4, md: 6 }, 
              borderRadius: 4, 
              bgcolor: isDark ? 'rgba(60, 42, 30, 0.7)' : '#F5EEE0',
              color: isDark ? '#F0E3CE' : '#4A3728',
              textAlign: 'center',
              border: isDark ? 'none' : '1px solid rgba(139, 90, 43, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(139, 90, 43, 0.15)'
              }
            }}
          >
            {/* Fondo decorativo */}
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.05,
                background: isDark 
                  ? 'radial-gradient(circle at 30% 40%, rgba(193, 154, 107, 0.3) 0%, rgba(60, 42, 30, 0) 70%), radial-gradient(circle at 70% 60%, rgba(193, 154, 107, 0.3) 0%, rgba(60, 42, 30, 0) 70%)'
                  : 'radial-gradient(circle at 30% 40%, rgba(139, 90, 43, 0.2) 0%, rgba(139, 90, 43, 0) 70%), radial-gradient(circle at 70% 60%, rgba(139, 90, 43, 0.2) 0%, rgba(139, 90, 43, 0) 70%)',
                zIndex: 0
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.2rem', sm: '2.7rem', md: '3.2rem' },
                  marginBottom: 2,
                  backgroundImage: isDark 
                    ? 'linear-gradient(45deg, #D9BC97 0%, #C19A6B 100%)' 
                    : 'linear-gradient(45deg, #8B5A2B 0%, #A67C52 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: isDark ? 'transparent' : undefined
                }}
              >
                Radio Cuenca Cañera 94.5FM
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3,
                  opacity: 0.9,
                  fontWeight: 500,
                  fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' }
                }}
              >
                La radio que te acompaña con la mejor música y las últimas noticias
              </Typography>
              <Typography 
                sx={{ 
                  maxWidth: '800px', 
                  mx: 'auto', 
                  mb: 4, 
                  opacity: 0.8,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.7
                }}
              >
                Sintonízanos las 24 horas del día y mantente informado con las novedades de tu región.
                Disfruta de la mejor programación musical, noticias actualizadas y entretenimiento
                para toda la familia.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                onClick={() => navigate('/programacion')}
                sx={{
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  borderRadius: 10,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: theme.shadows[4],
                  transition: 'all 0.3s ease',
                  background: isDark ? 'linear-gradient(45deg, #C19A6B 0%, #AA8062 100%)' : undefined,
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Nuestra Programación
              </Button>
            </Box>
          </Paper>
        </Container>
      </Grow>

      {/* Carrusel de Últimas Noticias */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <NewsCarousel 
          news={news.slice(0, 6)} 
          loading={loading}
          title="Últimas Noticias"
        />
      </Box>

      {/* Publicidades de contenido */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <ContentAdvertisements maxAds={1} />
      </Box>

      {/* Línea divisoria con título */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Box 
          sx={{ 
            mb: { xs: 4, md: 6 }, 
            mt: { xs: 2, md: 4 },
            display: 'flex', 
            alignItems: 'center',
            overflow: 'hidden'
          }}
        >
          <Divider sx={{ 
            flexGrow: 1, 
            borderColor: isDark ? 'rgba(193, 154, 107, 0.2)' : 'rgba(139, 90, 43, 0.15)',
            borderWidth: 1
          }} />
          <Typography 
            variant="h4" 
            component="span" 
            sx={{ 
              px: 3, 
              fontWeight: 700,
              color: isDark ? '#C19A6B' : '#8B5A2B',
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Noticias
          </Typography>
          <Divider sx={{ 
            flexGrow: 1, 
            borderColor: isDark ? 'rgba(193, 154, 107, 0.2)' : 'rgba(139, 90, 43, 0.15)',
            borderWidth: 1
          }} />
        </Box>
      </Container>

      {/* Sección de noticias destacadas con sidebar */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Contenido principal */}
          <Grid item xs={12} md={9.5}>
            <Fade in={true} timeout={1000}>
              <Box>
                <NewsGrid 
                  news={featuredNews} 
                  loading={loading} 
                  error={error} 
                  title="Noticias Destacadas" 
                  compact={true}
                />
              </Box>
            </Fade>

            {/* Sección de noticias recientes */}
            {recentNews.length > 0 && (
              <Fade in={true} timeout={1500}>
                <Box sx={{ mt: 8 }}>
                  <NewsGrid 
                    news={recentNews} 
                    title="Noticias Recientes" 
                  />
                </Box>
              </Fade>
            )}

            {/* Botón para ver todas las noticias */}
            <Box sx={{ textAlign: 'center', my: 8 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                component={Link}
                to="/noticias"
                sx={{
                  px: 6,
                  py: 1.8,
                  borderRadius: 10,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  borderWidth: 2,
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
            </Box>
          </Grid>

          {/* Sidebar con publicidades */}
          {!isMobile && (
            <Grid item xs={12} md={2.5}>
              <Box sx={{ 
                position: 'sticky', 
                top: 100,
                maxWidth: '280px',
                overflow: 'hidden'
              }}>
                <SidebarAdvertisements maxAds={3} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 