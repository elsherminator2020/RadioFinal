import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  Chip,
  Tooltip,
  Stack,
  LinearProgress,
  Avatar,
  Badge,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Add, 
  Edit, 
  Delete, 
  Visibility, 
  YouTube, 
  Article,
  PhotoCamera,
  VideoLibrary,
  Radio,
  CloudUpload,
  CheckCircle,
  Error,
  Dashboard,
  TrendingUp,
  Campaign
} from '@mui/icons-material';
import { OpenInNew } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getNews, deleteNews } from '../../services/newsService';
import { getProgramming, deleteProgram, getProgrammingStats, checkStorageStatus } from '../../services/programmingService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { News } from '../../services/newsService';
import type { Program } from '../../services/programmingService';

// Estilos personalizados para las celdas de la tabla
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

// Componente para extraer ID de video de YouTube
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Componente para mostrar vista previa de video de YouTube
const YouTubePreview: React.FC<{ url: string }> = ({ url }) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  return (
    <Box
      sx={{
        width: 80,
        height: 45,
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.8
        }
      }}
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
        alt="YouTube video"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <YouTube
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: 20
        }}
      />
    </Box>
  );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [news, setNews] = useState<News[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programmingStats, setProgrammingStats] = useState<any>(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  const [programToDelete, setProgramToDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState<any>(null);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  // Efecto para redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Cargar noticias
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        setNews(data);
      } catch (err) {
        setError('Error al cargar las noticias');
        console.error('Error fetching news:', err);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);


  // Cargar programación
  useEffect(() => {
    const fetchProgramming = async () => {
      try {
        const [programsData, statsData] = await Promise.all([
          getProgramming(),
          getProgrammingStats()
        ]);
        setPrograms(programsData.slice(0, 5)); // Mostrar solo los primeros 5
        setProgrammingStats(statsData);
      } catch (err) {
        setError('Error al cargar la programación');
        console.error('Error fetching programming:', err);
      } finally {
        setLoadingPrograms(false);
      }
    };

    fetchProgramming();
  }, []);

  // Verificar estado del almacenamiento al cargar
  useEffect(() => {
    const checkStorage = async () => {
      const status = await checkStorageStatus();
      setStorageStatus(status);
    };
    
    checkStorage();
  }, []);

  // Manejar la eliminación de una noticia
  const handleDeleteNews = async () => {
    if (newsToDelete === null) return;
    
    try {
      await deleteNews(newsToDelete);
      setNews(news.filter(item => item.id !== newsToDelete));
      setDeleteSuccess('Noticia eliminada correctamente');
      
      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
    } catch (err) {
      setDeleteError('Error al eliminar la noticia');
      console.error('Error deleting news:', err);
    } finally {
      setDeleteDialogOpen(false);
      setNewsToDelete(null);
    }
  };

  // Manejar la eliminación de un programa
  const handleDeleteProgram = async () => {
    if (programToDelete === null) return;
    
    try {
      await deleteProgram(programToDelete);
      setPrograms(programs.filter(item => item.id !== programToDelete));
      setDeleteSuccess('Programa eliminado correctamente');
      
      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
    } catch (err) {
      setDeleteError('Error al eliminar el programa');
      console.error('Error deleting program:', err);
    } finally {
      setDeleteDialogOpen(false);
      setProgramToDelete(null);
    }
  };

  const openDeleteDialog = (id: number, type: 'news' | 'program' = 'news') => {
    if (type === 'news') {
      setNewsToDelete(id);
    } else {
      setProgramToDelete(id);
    }
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setNewsToDelete(null);
    setProgramToDelete(null);
  };

  const handleDelete = () => {
    if (newsToDelete !== null) {
      handleDeleteNews();
    } else if (programToDelete !== null) {
      handleDeleteProgram();
    }
  };

  // Obtener estadísticas
  const stats = {
    totalNews: news.length,
    newsWithImages: news.filter(n => n.image_url).length,
    newsWithVideos: news.filter(n => n.video_url).length,
    recentNews: news.filter(n => {
      const publishDate = new Date(n.publish_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return publishDate >= weekAgo;
    }).length
  };

  // Función para configurar almacenamiento
  const handleSetupStorage = async () => {
    // Redirigir a la página dedicada de almacenamiento
    navigate('/admin/storage');
  };

  // Verificar carga y autenticación
  if (!user) {
    return null; // No renderizar nada si no hay usuario autenticado
  }

  // Acciones del SpeedDial
  const speedDialActions = [
    {
      icon: <Add />,
      name: 'Nueva Noticia',
      action: () => navigate('/admin/news/new')
    },
    {
      icon: <Radio />,
      name: 'Nuevo Programa',
      action: () => navigate('/admin/programming/new')
    },
    {
      icon: <Campaign />,
      name: 'Nueva Publicidad',
      action: () => navigate('/admin/advertisements/new')
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header mejorado */}
        <Box sx={{ 
          mb: 4, 
          p: 3, 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          borderRadius: 3,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                mr: 2,
                width: 56,
                height: 56
              }}>
                <Dashboard sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                  Panel de Administración
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Radio Cuenca Cañera 94.5FM
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Bienvenido de vuelta, {user?.email}. Gestiona tu contenido y configuración desde aquí.
            </Typography>
          </Box>
          
          {/* Patrón decorativo de fondo */}
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 1
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 1
          }} />
        </Box>

        {deleteSuccess && (
          <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
            {deleteSuccess}
          </Alert>
        )}

        {deleteError && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {deleteError}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Estadísticas Rápidas Mejoradas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Badge badgeContent={stats.totalNews} color="error" sx={{ mb: 2 }}>
                  <Article sx={{ fontSize: 48, opacity: 0.9 }} />
                </Badge>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.totalNews}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Total Noticias
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
                  sx={{ 
                    mt: 2, 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Badge badgeContent={stats.newsWithImages} color="error" sx={{ mb: 2 }}>
                  <PhotoCamera sx={{ fontSize: 48, opacity: 0.9 }} />
                </Badge>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.newsWithImages}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Con Imágenes
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.totalNews > 0 ? (stats.newsWithImages / stats.totalNews) * 100 : 0} 
                  sx={{ 
                    mt: 2, 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Badge badgeContent={stats.newsWithVideos} color="error" sx={{ mb: 2 }}>
                  <VideoLibrary sx={{ fontSize: 48, opacity: 0.9 }} />
                </Badge>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.newsWithVideos}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Con Videos
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.totalNews > 0 ? (stats.newsWithVideos / stats.totalNews) * 100 : 0} 
                  sx={{ 
                    mt: 2, 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Badge badgeContent={stats.recentNews} color="error" sx={{ mb: 2 }}>
                  <TrendingUp sx={{ fontSize: 48, opacity: 0.9 }} />
                </Badge>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.recentNews}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Esta Semana
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.totalNews > 0 ? (stats.recentNews / stats.totalNews) * 100 : 0} 
                  sx={{ 
                    mt: 2, 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tarjetas de acciones rápidas mejoradas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Article sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                  Noticias
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Gestionar y crear noticias del sitio web
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="outlined"
                  component={Link}
                  to="/admin/news"
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  Gestionar
                </Button>
                <Button 
                  variant="contained"
                  startIcon={<Add />}
                  component={Link}
                  to="/admin/news/new"
                  color="primary"
                >
                  Crear
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: '50%', 
                  bgcolor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Radio sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                  Programación
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Gestionar horarios y programas de radio
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="outlined"
                  component={Link}
                  to="/admin/programming"
                  color="success"
                  sx={{ mr: 1 }}
                >
                  Gestionar
                </Button>
                <Button 
                  variant="contained"
                  startIcon={<Add />}
                  component={Link}
                  to="/admin/programming/new"
                  color="success"
                >
                  Crear
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: '50%', 
                  bgcolor: 'warning.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Campaign sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                  Publicidades
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Gestionar anuncios publicitarios
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="outlined"
                  component={Link}
                  to="/admin/advertisements"
                  color="warning"
                  sx={{ mr: 1 }}
                >
                  Gestionar
                </Button>
                <Button 
                  variant="contained"
                  startIcon={<Add />}
                  component={Link}
                  to="/admin/advertisements/new"
                  color="warning"
                >
                  Crear
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Sección de noticias mejorada */}
        <Paper sx={{ mt: 4, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Gestión de Noticias
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                color="primary" 
                component={Link}
                to="/admin/news"
              >
                Ver Todas
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Add />}
                component={Link}
                to="/admin/news/new"
              >
                Nueva Noticia
              </Button>
            </Stack>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {loadingNews ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : news.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Article sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay noticias disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comienza creando tu primera noticia
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Add />}
                component={Link}
                to="/admin/news/new"
              >
                Crear Primera Noticia
              </Button>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
              <Table stickyHeader aria-label="tabla de noticias">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Título</StyledTableCell>
                    <StyledTableCell align="center">Fecha</StyledTableCell>
                    <StyledTableCell align="center">Imagen</StyledTableCell>
                    <StyledTableCell align="center">Video</StyledTableCell>
                    <StyledTableCell align="center">Estado</StyledTableCell>
                    <StyledTableCell align="center">Acciones</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {news.map((item) => (
                    <StyledTableRow key={item.id}>
                      <StyledTableCell component="th" scope="row">
                        <Box sx={{ minWidth: 200, maxWidth: 400 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 600,
                              mb: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.3
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.4
                            }}
                          >
                            {item.content.substring(0, 150)}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Typography variant="body2">
                          {format(new Date(item.publish_date), 'dd/MM/yyyy', { locale: es })}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.image_url ? (
                          <Tooltip title="Ver imagen completa">
                            <Box
                              sx={{
                                width: 50,
                                height: 30,
                                borderRadius: 1,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                mx: 'auto'
                              }}
                            >
                              <img
                                src={item.image_url}
                                alt="Preview"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </Box>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin imagen
                          </Typography>
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.video_url ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <YouTubePreview url={item.video_url} />
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin video
                          </Typography>
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                          {item.image_url && (
                            <Chip label="IMG" size="small" color="success" />
                          )}
                          {item.video_url && (
                            <Chip label="VID" size="small" color="error" />
                          )}
                          {!item.image_url && !item.video_url && (
                            <Chip label="TEXTO" size="small" color="default" />
                          )}
                        </Stack>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="nowrap">
                          <Tooltip title="Ver noticia">
                            <IconButton 
                              color="info" 
                              component={Link} 
                              to={`/noticias/${item.id}`}
                              size="small"
                              sx={{ p: 0.5 }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton 
                              color="primary" 
                              component={Link} 
                              to={`/admin/news/edit/${item.id}`}
                              size="small"
                              sx={{ p: 0.5 }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton 
                              color="error" 
                              onClick={() => openDeleteDialog(item.id!)}
                              size="small"
                              sx={{ p: 0.5 }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Sección de programación */}
        <Paper sx={{ mt: 4, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Gestión de Programación
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                color="primary" 
                component={Link}
                to="/admin/programming"
              >
                Ver Todas
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Add />}
                component={Link}
                to="/admin/programming/new"
              >
                Nuevo Programa
              </Button>
            </Stack>
          </Box>
          
          <Divider sx={{ mb: 2 }} />

          {/* Estadísticas de programación */}
          {programmingStats && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary">
                    {programmingStats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Programas
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main">
                    {programmingStats.active}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Activos
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="info.main">
                    {programmingStats.withHosts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Con Conductor
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="warning.main">
                    {programmingStats.withImages}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Con Imagen
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          )}
          
          {loadingPrograms ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : programs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Radio sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay programas disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comienza creando tu primer programa
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Add />}
                component={Link}
                to="/admin/programming/new"
              >
                Crear Primer Programa
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 700 }} aria-label="tabla de programación">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Programa</StyledTableCell>
                    <StyledTableCell align="center">Horario</StyledTableCell>
                    <StyledTableCell align="center">Tipo</StyledTableCell>
                    <StyledTableCell align="center">Conductor</StyledTableCell>
                    <StyledTableCell align="center">Estado</StyledTableCell>
                    <StyledTableCell align="center">Acciones</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {programs.map((program) => (
                    <StyledTableRow key={program.id}>
                      <StyledTableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {program.image_url ? (
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                overflow: 'hidden',
                                flexShrink: 0
                              }}
                            >
                              <img
                                src={program.image_url}
                                alt={program.program_name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: 'grey.200',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              <Radio sx={{ fontSize: 20, color: 'grey.500' }} />
                            </Box>
                          )}
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle2" noWrap>
                              {program.program_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {program.description.substring(0, 50)}...
                            </Typography>
                          </Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Typography variant="body2">
                          {program.start_time} - {program.end_time}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {program.day_of_week}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Chip 
                          label={program.program_type.toUpperCase()} 
                          size="small" 
                          color={
                            program.program_type === 'music' ? 'primary' :
                            program.program_type === 'news' ? 'error' :
                            program.program_type === 'talk' ? 'secondary' :
                            program.program_type === 'sports' ? 'success' :
                            'warning'
                          }
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Typography variant="body2">
                          {program.host_name || 'Sin conductor'}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Chip 
                          label={program.active ? 'Activo' : 'Inactivo'} 
                          size="small" 
                          color={program.active ? 'success' : 'default'}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Editar programa">
                            <IconButton 
                              color="primary" 
                              component={Link} 
                              to={`/admin/programming/edit/${program.id}`}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar programa">
                            <IconButton 
                              color="error" 
                              onClick={() => openDeleteDialog(program.id!, 'program')}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Sección de configuración de almacenamiento */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CloudUpload sx={{ mr: 1 }} />
                Configuración de Almacenamiento
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {storageStatus && (
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Chip
                      icon={storageStatus.configured ? <CheckCircle /> : <Error />}
                      label={storageStatus.configured ? 'Configurado' : 'No configurado'}
                      color={storageStatus.configured ? 'success' : 'error'}
                    />
                    {storageStatus.configured && (
                      <Typography variant="body2" color="text.secondary">
                        Bucket 'programming-images' disponible
                      </Typography>
                    )}
                  </Stack>
                  
                  {!storageStatus.configured && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Stack spacing={2}>
                        <Typography variant="body2">
                          <strong>⚠️ Almacenamiento no configurado</strong>
                        </Typography>
                        <Typography variant="body2">
                          El bucket 'programming-images' no existe. Esto causará errores al subir imágenes de programas.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={handleSetupStorage}
                            disabled={settingUpStorage}
                            startIcon={settingUpStorage ? <CircularProgress size={16} /> : <CloudUpload />}
                          >
                            {settingUpStorage ? 'Intentando...' : 'Configurar automáticamente'}
                          </Button>
                          <Button
                            variant="text"
                            size="small"
                            href="https://supabase.com/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<OpenInNew />}
                          >
                            Abrir Supabase Dashboard
                          </Button>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          💡 Si la configuración automática falla, debe configurarse manualmente desde Supabase Dashboard.
                        </Typography>
                      </Stack>
                    </Alert>
                  )}
                  
                  {storageStatus.error && (
                    <Alert 
                      severity={storageStatus.error.includes('RLS') || storageStatus.error.includes('permission') ? 'error' : 'warning'} 
                      sx={{ mb: 2 }}
                    >
                      <Stack spacing={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {storageStatus.error.includes('RLS') ? '🔒 Error de Políticas RLS' : '⚠️ Error de Configuración'}
                        </Typography>
                        <Typography variant="body2">
                          {storageStatus.error}
                        </Typography>
                        {storageStatus.error.includes('RLS') && (
                          <Typography variant="caption" color="text.secondary">
                            Las políticas de Row Level Security impiden la configuración automática. 
                            Debe configurarse manualmente desde Supabase Dashboard.
                          </Typography>
                        )}
                      </Stack>
                    </Alert>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* SpeedDial para acciones rápidas */}
      <SpeedDial
        ariaLabel="Acciones rápidas"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
        open={speedDialOpen}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              action.action();
              setSpeedDialOpen(false);
            }}
          />
        ))}
      </SpeedDial>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro que desea eliminar {newsToDelete ? 'esta noticia' : 'este programa'}? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DashboardPage; 