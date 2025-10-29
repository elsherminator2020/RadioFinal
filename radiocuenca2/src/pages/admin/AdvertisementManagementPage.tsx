import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link as MuiLink, 
  CircularProgress, 
  Alert,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Tooltip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CardActions,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Add, 
  Edit, 
  Delete, 
  Search,
  Campaign,
  Visibility,
  VisibilityOff,
  Clear,
  GridView,
  ViewList,
  TrendingUp,
  LocationOn,
  AspectRatio,
  Business,
  Analytics
} from '@mui/icons-material';
import { tableCellClasses } from '@mui/material/TableCell';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAdvertisements, 
  deleteAdvertisement, 
  toggleAdvertisementStatus, 
  getAdvertisementStats
} from '../../services/advertisementService';
import type { Advertisement } from '../../services/advertisementService';

// Estilos personalizados para las celdas de la tabla
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

const AdvertisementManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [filteredAdvertisements, setFilteredAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [advertisementToDelete, setAdvertisementToDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalClicks: 0,
    totalImpressions: 0,
    byPosition: {
      header: 0,
      sidebar: 0,
      footer: 0,
      content: 0,
      popup: 0,
    }
  });

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Efecto para redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Cargar publicidades
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const [data, statsData] = await Promise.all([
          getAdvertisements(),
          getAdvertisementStats()
        ]);
        setAdvertisements(data);
        setFilteredAdvertisements(data);
        setStats(statsData);
      } catch (err) {
        setError('Error al cargar las publicidades');
        console.error('Error fetching advertisements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...advertisements];

    if (searchTerm) {
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.advertiser_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterPosition) {
      filtered = filtered.filter(ad => ad.position === filterPosition);
    }

    if (filterSize) {
      filtered = filtered.filter(ad => ad.size === filterSize);
    }

    if (filterStatus) {
      const isActive = filterStatus === 'active';
      filtered = filtered.filter(ad => ad.active === isActive);
    }

    setFilteredAdvertisements(filtered);
  }, [advertisements, searchTerm, filterPosition, filterSize, filterStatus]);

  // Manejar eliminación de publicidad
  const handleDeleteAdvertisement = async () => {
    if (advertisementToDelete === null) return;
    
    try {
      await deleteAdvertisement(advertisementToDelete);
      setAdvertisements(advertisements.filter(item => item.id !== advertisementToDelete));
      setDeleteSuccess('Publicidad eliminada correctamente');
      
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
    } catch (err) {
      setDeleteError('Error al eliminar la publicidad');
      console.error('Error deleting advertisement:', err);
    } finally {
      setDeleteDialogOpen(false);
      setAdvertisementToDelete(null);
    }
  };

  // Manejar cambio de estado
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const updatedAdvertisement = await toggleAdvertisementStatus(id, !currentStatus);
      setAdvertisements(advertisements.map(ad => 
        ad.id === id ? updatedAdvertisement : ad
      ));
      setUpdateSuccess(`Publicidad ${!currentStatus ? 'activada' : 'desactivada'} correctamente`);
      
      setTimeout(() => {
        setUpdateSuccess(null);
      }, 3000);
    } catch (err) {
      setUpdateError('Error al cambiar el estado de la publicidad');
      console.error('Error toggling advertisement status:', err);
    }
  };

  const openDeleteDialog = (id: number) => {
    setAdvertisementToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAdvertisementToDelete(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterPosition('');
    setFilterSize('');
    setFilterStatus('');
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'header': return <LocationOn fontSize="small" />;
      case 'sidebar': return <AspectRatio fontSize="small" />;
      case 'footer': return <LocationOn fontSize="small" />;
      case 'content': return <LocationOn fontSize="small" />;
      case 'popup': return <LocationOn fontSize="small" />;
      default: return <LocationOn fontSize="small" />;
    }
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'header': return 'Encabezado';
      case 'sidebar': return 'Lateral';
      case 'footer': return 'Pie de página';
      case 'content': return 'Contenido';
      case 'popup': return 'Popup';
      default: return position;
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Pequeño';
      case 'medium': return 'Mediano';
      case 'large': return 'Grande';
      case 'banner': return 'Banner';
      default: return size;
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'error';
    if (priority >= 6) return 'warning';
    if (priority >= 4) return 'info';
    return 'default';
  };

  const renderGridView = () => (
    <Grid container spacing={3}>
      {filteredAdvertisements.map((ad) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={ad.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height={160}
                image={ad.image_url}
                alt={ad.title}
                sx={{ objectFit: 'cover' }}
              />
              <Box sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8, 
                display: 'flex', 
                gap: 0.5 
              }}>
                <Chip
                  size="small"
                  icon={ad.active ? <Visibility /> : <VisibilityOff />}
                  label={ad.active ? 'Activo' : 'Inactivo'}
                  color={ad.active ? 'success' : 'default'}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                />
                <Chip
                  size="small"
                  label={`P${ad.priority}`}
                  color={getPriorityColor(ad.priority) as any}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                />
              </Box>
            </Box>
            
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom noWrap>
                {ad.title}
              </Typography>
              
              {ad.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {ad.description.substring(0, 80)}...
                </Typography>
              )}
              
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOn fontSize="small" />
                  <Typography variant="body2">
                    {getPositionLabel(ad.position)}
                  </Typography>
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AspectRatio fontSize="small" />
                  <Typography variant="body2">
                    {getSizeLabel(ad.size)}
                  </Typography>
                </Stack>
                
                {ad.advertiser_name && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Business fontSize="small" />
                    <Typography variant="body2">
                      {ad.advertiser_name}
                    </Typography>
                  </Stack>
                )}
                
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    size="small"
                    icon={<Analytics />}
                    label={`${ad.click_count} clics`}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    icon={<TrendingUp />}
                    label={`${ad.impression_count} impresiones`}
                    variant="outlined"
                  />
                </Stack>
              </Stack>
            </CardContent>
            
            <CardActions>
              <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Editar publicidad">
                    <IconButton 
                      size="small"
                      color="primary" 
                      component={Link} 
                      to={`/admin/advertisements/edit/${ad.id}`}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Eliminar publicidad">
                    <IconButton 
                      size="small"
                      color="error" 
                      onClick={() => openDeleteDialog(ad.id!)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                
                <Tooltip title={ad.active ? 'Desactivar' : 'Activar'}>
                  <Switch
                    size="small"
                    checked={ad.active}
                    onChange={() => handleToggleStatus(ad.id!, ad.active)}
                  />
                </Tooltip>
              </Stack>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTableView = () => (
    <TableContainer>
      <Table sx={{ minWidth: 750 }} aria-label="tabla de publicidades">
        <TableHead>
          <TableRow>
            <StyledTableCell>Publicidad</StyledTableCell>
            <StyledTableCell align="center">Posición</StyledTableCell>
            <StyledTableCell align="center">Tamaño</StyledTableCell>
            <StyledTableCell align="center">Prioridad</StyledTableCell>
            <StyledTableCell align="center">Anunciante</StyledTableCell>
            <StyledTableCell align="center">Estadísticas</StyledTableCell>
            <StyledTableCell align="center">Estado</StyledTableCell>
            <StyledTableCell align="center">Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAdvertisements.map((ad) => (
            <StyledTableRow key={ad.id}>
              <StyledTableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 40,
                      borderRadius: 1,
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {ad.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {ad.description?.substring(0, 50)}...
                    </Typography>
                  </Box>
                </Box>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Tooltip title={getPositionLabel(ad.position)}>
                  <Chip
                    icon={getPositionIcon(ad.position)}
                    label={getPositionLabel(ad.position)}
                    size="small"
                    variant="outlined"
                  />
                </Tooltip>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Chip
                  label={getSizeLabel(ad.size)}
                  size="small"
                  variant="outlined"
                />
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Chip
                  icon={<TrendingUp />}
                  label={ad.priority}
                  size="small"
                  color={getPriorityColor(ad.priority) as any}
                />
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Typography variant="body2">
                  {ad.advertiser_name || 'Sin anunciante'}
                </Typography>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title={`${ad.click_count} clics`}>
                    <Chip
                      icon={<Analytics />}
                      label={ad.click_count}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Tooltip>
                  <Tooltip title={`${ad.impression_count} impresiones`}>
                    <Chip
                      icon={<TrendingUp />}
                      label={ad.impression_count}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Tooltip>
                </Stack>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Tooltip title={ad.active ? 'Publicidad activa' : 'Publicidad inactiva'}>
                  <Switch
                    checked={ad.active}
                    onChange={() => handleToggleStatus(ad.id!, ad.active)}
                    color="primary"
                  />
                </Tooltip>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="Editar publicidad">
                    <IconButton 
                      color="primary" 
                      component={Link} 
                      to={`/admin/advertisements/edit/${ad.id}`}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Eliminar publicidad">
                    <IconButton 
                      color="error" 
                      onClick={() => openDeleteDialog(ad.id!)}
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
  );

  // Verificar carga y autenticación
  if (!user) {
    return null;
  }

  return (
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
          Gestión de Publicidades
        </Typography>
      </Breadcrumbs>

      {/* Título y estadísticas */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestión de Publicidades
          </Typography>
          <Typography color="text.secondary">
            {stats.total} publicidades total • {stats.active} activas • {stats.totalClicks} clics totales
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to="/admin/advertisements/new"
        >
          Nueva Publicidad
        </Button>
      </Box>

      {/* Estadísticas rápidas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={2}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="primary">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="success.main">
              {stats.active}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Activas
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="info.main">
              {stats.totalClicks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Clics
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="warning.main">
              {stats.totalImpressions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Impresiones
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="secondary.main">
              {stats.byPosition.sidebar}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Laterales
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="error.main">
              {stats.byPosition.header}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Encabezados
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Alertas */}
      {deleteSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {deleteSuccess}
        </Alert>
      )}

      {updateSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {updateSuccess}
        </Alert>
      )}

      {deleteError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {deleteError}
        </Alert>
      )}

      {updateError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {updateError}
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
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Buscar publicidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm('')}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Posición</InputLabel>
              <Select
                value={filterPosition}
                label="Posición"
                onChange={(e) => setFilterPosition(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="header">Encabezado</MenuItem>
                <MenuItem value="sidebar">Lateral</MenuItem>
                <MenuItem value="footer">Pie de página</MenuItem>
                <MenuItem value="content">Contenido</MenuItem>
                <MenuItem value="popup">Popup</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Tamaño</InputLabel>
              <Select
                value={filterSize}
                label="Tamaño"
                onChange={(e) => setFilterSize(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="small">Pequeño</MenuItem>
                <MenuItem value="medium">Mediano</MenuItem>
                <MenuItem value="large">Grande</MenuItem>
                <MenuItem value="banner">Banner</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filterStatus}
                label="Estado"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="active">Activas</MenuItem>
                <MenuItem value="inactive">Inactivas</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="outlined"
                onClick={clearFilters}
                disabled={!searchTerm && !filterPosition && !filterSize && !filterStatus}
                sx={{ flexGrow: 1 }}
              >
                Limpiar Filtros
              </Button>
              
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, value) => value && setViewMode(value)}
                size="small"
              >
                <ToggleButton value="list">
                  <ViewList />
                </ToggleButton>
                <ToggleButton value="grid">
                  <GridView />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Contenido principal */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredAdvertisements.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Campaign sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {advertisements.length === 0 ? 'No hay publicidades disponibles' : 'No se encontraron publicidades'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {advertisements.length === 0 
              ? 'Comienza creando tu primera publicidad' 
              : 'Intenta cambiar los filtros de búsqueda'
            }
          </Typography>
          {advertisements.length === 0 && (
            <Button 
              variant="contained" 
              startIcon={<Add />}
              component={Link}
              to="/admin/advertisements/new"
            >
              Crear Primera Publicidad
            </Button>
          )}
        </Paper>
      ) : (
        <Paper sx={{ p: viewMode === 'grid' ? 3 : 0 }}>
          {viewMode === 'grid' ? renderGridView() : renderTableView()}
        </Paper>
      )}

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
            ¿Está seguro que desea eliminar esta publicidad? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteAdvertisement} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvertisementManagementPage;

