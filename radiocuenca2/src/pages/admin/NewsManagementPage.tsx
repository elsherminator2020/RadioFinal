import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Fab,
  Breadcrumbs,
  Link as MuiLink,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { 
  Add, 
  Edit, 
  Delete, 
  Visibility, 
  Search,
  YouTube, 
  Image as ImageIcon,
  GridView,
  ViewList,
  Article
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getNews, deleteNews } from '../../services/newsService';
import NewsCard from '../../components/admin/NewsCard';
import { format, isThisWeek, isThisMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import type { News } from '../../services/newsService';

// Función para extraer ID de video de YouTube
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

type FilterType = 'all' | 'with-image' | 'with-video' | 'text-only' | 'this-week' | 'this-month';
type ViewType = 'grid' | 'list';

// Estilos personalizados para las celdas de la tabla (igual que en programación)
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
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

const NewsManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewType, setViewType] = useState<ViewType>('grid');

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
        setFilteredNews(data);
      } catch (err) {
        setError('Error al cargar las noticias');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filtrar noticias
  useEffect(() => {
    let filtered = news;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo
    switch (filter) {
      case 'with-image':
        filtered = filtered.filter(item => item.image_url);
        break;
      case 'with-video':
        filtered = filtered.filter(item => item.video_url);
        break;
      case 'text-only':
        filtered = filtered.filter(item => !item.image_url && !item.video_url);
        break;
      case 'this-week':
        filtered = filtered.filter(item => isThisWeek(new Date(item.publish_date)));
        break;
      case 'this-month':
        filtered = filtered.filter(item => isThisMonth(new Date(item.publish_date)));
        break;
      default:
        break;
    }

    setFilteredNews(filtered);
  }, [news, searchTerm, filter]);

  // Manejar la eliminación de una noticia
  const handleDeleteNews = async () => {
    if (newsToDelete === null) return;
    
    try {
      await deleteNews(newsToDelete);
      const updatedNews = news.filter(item => item.id !== newsToDelete);
      setNews(updatedNews);
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

  const openDeleteDialog = (id: number) => {
    setNewsToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setNewsToDelete(null);
  };

  // Obtener estadísticas
  const stats = {
    total: news.length,
    withImages: news.filter(n => n.image_url).length,
    withVideos: news.filter(n => n.video_url).length,
    thisWeek: news.filter(n => isThisWeek(new Date(n.publish_date))).length,
  };

  // Verificar carga y autenticación
  if (!user) {
    return null;
  }

  // Renderizar tarjeta de noticia usando componente NewsCard
  const renderNewsCard = (item: News) => (
    <Grid item xs={12} sm={6} md={4} key={item.id}>
      <NewsCard news={item} onDelete={openDeleteDialog} />
    </Grid>
  );

  // Renderizar vista de lista mejorada
  const renderNewsList = () => (
    <TableContainer>
      <Table sx={{ minWidth: 750 }} aria-label="tabla de noticias">
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
          {filteredNews.map((item) => (
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
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(item.publish_date), 'HH:mm', { locale: es })}
                </Typography>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                {item.image_url ? (
                  <Tooltip title="Con imagen">
                    <Chip
                      icon={<ImageIcon />}
                      label="Imagen"
                      size="small"
                      color="success"
                    />
                  </Tooltip>
                ) : (
                  <Chip
                    label="Sin imagen"
                    size="small"
                    variant="outlined"
                    color="default"
                  />
                )}
              </StyledTableCell>
              
              <StyledTableCell align="center">
                {item.video_url ? (
                  <Tooltip title="Con video">
                    <Chip
                      icon={<YouTube />}
                      label="Video"
                      size="small"
                      color="error"
                    />
                  </Tooltip>
                ) : (
                  <Chip
                    label="Sin video"
                    size="small"
                    variant="outlined"
                    color="default"
                  />
                )}
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Stack direction="row" spacing={0.5} justifyContent="center">
                  {item.image_url && (
                    <Chip icon={<ImageIcon />} label="IMG" size="small" color="success" />
                  )}
                  {item.video_url && (
                    <Chip icon={<YouTube />} label="VID" size="small" color="error" />
                  )}
                  {!item.image_url && !item.video_url && (
                    <Chip icon={<Article />} label="TEXTO" size="small" color="default" />
                  )}
                </Stack>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="Ver noticia">
                    <IconButton 
                      size="small" 
                      color="info"
                      component={Link}
                      to={`/noticias/${item.id}`}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Editar noticia">
                    <IconButton 
                      size="small" 
                      color="primary"
                      component={Link}
                      to={`/admin/news/edit/${item.id}`}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Eliminar noticia">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => openDeleteDialog(item.id!)}
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
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink component={Link} to="/" color="inherit">
            Inicio
          </MuiLink>
          <MuiLink component={Link} to="/admin" color="inherit">
            Administración
          </MuiLink>
          <Typography color="text.primary">
            Gestión de Noticias
          </Typography>
        </Breadcrumbs>

        {/* Título y estadísticas */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Gestión de Noticias
            </Typography>
            <Typography color="text.secondary">
              {stats.total} noticias total • {stats.withImages} con imágenes • {stats.withVideos} con videos
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/admin/news/new"
          >
            Nueva Noticia
          </Button>
        </Box>

        {/* Alertas */}
        {deleteSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {deleteSuccess}
          </Alert>
        )}

        {deleteError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {deleteError}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Controles de filtros y búsqueda */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar noticias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filtrar por</InputLabel>
                <Select
                  value={filter}
                  label="Filtrar por"
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                >
                  <MenuItem value="all">Todas las noticias</MenuItem>
                  <MenuItem value="with-image">Con imágenes</MenuItem>
                  <MenuItem value="with-video">Con videos</MenuItem>
                  <MenuItem value="text-only">Solo texto</MenuItem>
                  <MenuItem value="this-week">Esta semana</MenuItem>
                  <MenuItem value="this-month">Este mes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Vista en cuadrícula">
                  <IconButton
                    color={viewType === 'grid' ? 'primary' : 'default'}
                    onClick={() => setViewType('grid')}
                  >
                    <GridView />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Vista en lista">
                  <IconButton
                    color={viewType === 'list' ? 'primary' : 'default'}
                    onClick={() => setViewType('list')}
                  >
                    <ViewList />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                {filteredNews.length} resultado(s)
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Contenido principal */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredNews.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <Article sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {searchTerm || filter !== 'all' ? 'No se encontraron noticias' : 'No hay noticias disponibles'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || filter !== 'all' 
                ? 'Intenta cambiar los filtros de búsqueda' 
                : 'Comienza creando tu primera noticia'
              }
            </Typography>
            {(!searchTerm && filter === 'all') && (
              <Button
                variant="contained"
                startIcon={<Add />}
                component={Link}
                to="/admin/news/new"
              >
                Crear Primera Noticia
              </Button>
            )}
          </Paper>
        ) : (
          viewType === 'grid' ? (
            <Grid container spacing={3}>
              {filteredNews.map((item) => renderNewsCard(item))}
            </Grid>
          ) : (
            <Paper sx={{ p: 0 }}>
              {renderNewsList()}
            </Paper>
          )
        )}

        {/* FAB para agregar noticia */}
        <Fab
          color="primary"
          aria-label="agregar noticia"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          component={Link}
          to="/admin/news/new"
        >
          <Add />
        </Fab>

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
              ¿Está seguro que desea eliminar esta noticia? Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDeleteNews} color="error" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default NewsManagementPage; 