import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  useTheme, 
  useMediaQuery, 
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  Stack
} from '@mui/material';
import { CalendarToday, Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getNews } from '../services/newsService';
import { SidebarAdvertisements, ContentAdvertisements } from '../components/advertisements/AdvertisementDisplay';
import type { News } from '../services/newsService';

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const itemsPerPage = 9;
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNews = news.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getNews();
        setNews(data);
      } catch (err) {
        setError('Error al cargar las noticias');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const extractSummary = (content: string, maxWords: number = 30): string => {
    const text = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
    const words = text.split(' ').slice(0, maxWords);
    return words.length >= maxWords ? words.join(' ') + '...' : words.join(' ');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      py: { xs: 3, md: 5 }, 
      minHeight: '60vh',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100vw'
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              fontWeight: 800,
              color: isDark ? '#C19A6B' : '#8B5A2B',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '3px',
                backgroundColor: 'primary.main',
                borderRadius: '2px'
              }
            }}
          >
            Noticias
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              mt: 3,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Mantente informado con las últimas noticias y acontecimientos de Radio Cuenca Cañera 94.5FM
          </Typography>
        </Box>

        {/* Publicidades de contenido */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <ContentAdvertisements maxAds={1} />
        </Box>

        {/* Layout con sidebar */}
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Contenido principal */}
          <Grid item xs={12} md={9.5}>
            {/* News Grid */}
            {currentNews.length > 0 ? (
              <>
                <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
                  {currentNews.map((article) => (
                    <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <Paper
                    elevation={isDark ? 3 : 1}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      bgcolor: isDark ? 'rgba(60, 42, 30, 0.7)' : '#F5EEE0',
                      border: isDark ? 'none' : '1px solid rgba(139, 90, 43, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: isDark 
                          ? '0 12px 25px rgba(0,0,0,0.3)' 
                          : '0 12px 25px rgba(139, 90, 43, 0.15)',
                      }
                    }}
                  >
                    {/* Image */}
                    {article.image_url && (
                      <Box
                        sx={{
                          height: 200,
                          backgroundImage: `url(${article.image_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '30%',
                            background: `linear-gradient(to top, ${isDark ? 'rgba(60, 42, 30, 0.8)' : 'rgba(245, 238, 224, 0.8)'} 0%, transparent 100%)`
                          }
                        }}
                      />
                    )}

                    {/* Content */}
                    <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Date */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: isDark ? '#C19A6B' : '#8B5A2B',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5
                          }}
                        >
                          {new Date(article.publish_date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>

                      {/* Title */}
                      <Typography 
                        variant="h6" 
                        component="h3"
                        sx={{ 
                          mb: 2, 
                          color: isDark ? '#F0E3CE' : '#4A3728',
                          fontWeight: 700,
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {article.title}
                      </Typography>

                      {/* Summary */}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 3, 
                          color: 'text.secondary',
                          flexGrow: 1,
                          lineHeight: 1.6
                        }}
                      >
                        {extractSummary(article.content)}
                      </Typography>

                      {/* Read More Link */}
                      <Box sx={{ mt: 'auto' }}>
                        <Divider sx={{ mb: 2, borderColor: isDark ? 'rgba(193, 154, 107, 0.2)' : 'rgba(139, 90, 43, 0.15)' }} />
                        <Link 
                          to={`/noticias/${article.id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Chip
                            icon={<Visibility sx={{ fontSize: 16 }} />}
                            label="Leer más"
                            variant="outlined"
                            clickable
                            sx={{
                              color: isDark ? '#C19A6B' : '#8B5A2B',
                              borderColor: isDark ? '#C19A6B' : '#8B5A2B',
                              '&:hover': {
                                backgroundColor: isDark ? 'rgba(193, 154, 107, 0.1)' : 'rgba(139, 90, 43, 0.1)',
                                transform: 'scale(1.05)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          />
                        </Link>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 3, md: 4 }, mb: { xs: 2, md: 3 } }}>
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: isDark ? '#C19A6B' : '#8B5A2B',
                        '&.Mui-selected': {
                          backgroundColor: isDark ? '#C19A6B' : '#8B5A2B',
                          color: 'white',
                        },
                        '&:hover': {
                          backgroundColor: isDark ? 'rgba(193, 154, 107, 0.1)' : 'rgba(139, 90, 43, 0.1)',
                        }
                      }
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ textAlign: 'center' }}
                  >
                    Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, news.length)} de {news.length} noticias
                  </Typography>
                </Stack>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No hay noticias disponibles en este momento
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vuelve pronto para ver las últimas actualizaciones
            </Typography>
          </Box>
        )}
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

export default NewsPage; 