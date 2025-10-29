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
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Add, 
  Edit, 
  Delete, 
  Search,
  Radio,
  MusicNote,
  Newspaper,
  Mic,
  Sports,
  Weekend,
  Clear,
  GridView,
  ViewList
} from '@mui/icons-material';
import { tableCellClasses } from '@mui/material/TableCell';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getProgramming, 
  deleteProgram, 
  toggleProgramStatus, 
  getProgrammingStats 
} from '../../services/programmingService';
import type { Program } from '../../services/programmingService';
import ProgramCard from '../../components/admin/ProgramCard';

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

const ProgrammingManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    withImages: 0,
    withHosts: 0,
    byType: {
      music: 0,
      news: 0,
      talk: 0,
      sports: 0,
      variety: 0,
    }
  });

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Efecto para redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Cargar programación
  useEffect(() => {
    const fetchProgramming = async () => {
      try {
        const [data, statsData] = await Promise.all([
          getProgramming(),
          getProgrammingStats()
        ]);
        setPrograms(data);
        setFilteredPrograms(data);
        setStats(statsData);
      } catch (err) {
        setError('Error al cargar la programación');
        console.error('Error fetching programming:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramming();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...programs];

    if (searchTerm) {
      filtered = filtered.filter(program =>
        program.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (program.host_name && program.host_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType) {
      filtered = filtered.filter(program => program.program_type === filterType);
    }

    if (filterDay) {
      filtered = filtered.filter(program => program.day_of_week === filterDay);
    }

    if (filterStatus) {
      const isActive = filterStatus === 'active';
      filtered = filtered.filter(program => program.active === isActive);
    }

    setFilteredPrograms(filtered);
  }, [programs, searchTerm, filterType, filterDay, filterStatus]);

  // Manejar eliminación de programa
  const handleDeleteProgram = async () => {
    if (programToDelete === null) return;
    
    try {
      await deleteProgram(programToDelete);
      setPrograms(programs.filter(item => item.id !== programToDelete));
      setDeleteSuccess('Programa eliminado correctamente');
      
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

  // Manejar cambio de estado
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const updatedProgram = await toggleProgramStatus(id, !currentStatus);
      setPrograms(programs.map(program => 
        program.id === id ? updatedProgram : program
      ));
      setUpdateSuccess(`Programa ${!currentStatus ? 'activado' : 'desactivado'} correctamente`);
      
      setTimeout(() => {
        setUpdateSuccess(null);
      }, 3000);
    } catch (err) {
      setUpdateError('Error al cambiar el estado del programa');
      console.error('Error toggling program status:', err);
    }
  };

  const openDeleteDialog = (id: number) => {
    setProgramToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProgramToDelete(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterDay('');
    setFilterStatus('');
  };

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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'music': return 'Música';
      case 'news': return 'Noticias';
      case 'talk': return 'Conversación';
      case 'sports': return 'Deportes';
      case 'variety': return 'Variedad';
      default: return 'Radio';
    }
  };

  const getDayLabel = (day: string) => {
    switch (day) {
      case 'lunes-viernes': return 'Lun-Vie';
      case 'sabados': return 'Sábados';
      case 'domingos': return 'Domingos';
      case 'lunes': return 'Lunes';
      case 'martes': return 'Martes';
      case 'miercoles': return 'Miércoles';
      case 'jueves': return 'Jueves';
      case 'viernes': return 'Viernes';
      case 'sabado': return 'Sábado';
      case 'domingo': return 'Domingo';
      default: return day;
    }
  };

  const renderGridView = () => (
    <Grid container spacing={3}>
      {filteredPrograms.map((program) => (
        <Grid item xs={12} sm={6} md={4} key={program.id}>
          <ProgramCard program={program} onDelete={openDeleteDialog} />
        </Grid>
      ))}
    </Grid>
  );

  const renderTableView = () => (
    <TableContainer>
      <Table sx={{ minWidth: 750 }} aria-label="tabla de programación">
        <TableHead>
          <TableRow>
            <StyledTableCell>Programa</StyledTableCell>
            <StyledTableCell align="center">Tipo</StyledTableCell>
            <StyledTableCell align="center">Horario</StyledTableCell>
            <StyledTableCell align="center">Día</StyledTableCell>
            <StyledTableCell align="center">Conductor</StyledTableCell>
            <StyledTableCell align="center">Estado</StyledTableCell>
            <StyledTableCell align="center">Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPrograms.map((program) => (
            <StyledTableRow key={program.id}>
              <StyledTableCell component="th" scope="row">
                <Box sx={{ minWidth: 200, maxWidth: 350, display: 'flex', alignItems: 'center', gap: 2 }}>
                  {program.image_url && (
                    <Box sx={{ width: 48, height: 48, borderRadius: '8px', overflow: 'hidden', boxShadow: 1, flexShrink: 0 }}>
                      <img src={program.image_url} alt={program.program_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  )}
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
                    {program.program_name}
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
                    {program.description.substring(0, 100)}
                  </Typography>
                </Box>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Tooltip title={getTypeLabel(program.program_type)}>
                  <Chip
                    icon={getTypeIcon(program.program_type)}
                    label={getTypeLabel(program.program_type)}
                    size="small"
                    sx={{ 
                      bgcolor: getTypeColor(program.program_type),
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                </Tooltip>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Typography variant="body2">
                  {program.start_time} - {program.end_time}
                </Typography>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Chip
                  label={getDayLabel(program.day_of_week)}
                  size="small"
                  variant="outlined"
                />
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Typography variant="body2">
                  {program.host_name || 'Sin conductor'}
                </Typography>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Tooltip title={program.active ? 'Programa activo' : 'Programa inactivo'}>
                  <Switch
                    checked={program.active}
                    onChange={() => handleToggleStatus(program.id!, program.active)}
                    color="primary"
                  />
                </Tooltip>
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
                      onClick={() => openDeleteDialog(program.id!)}
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
          Gestión de Programación
        </Typography>
      </Breadcrumbs>

      {/* Título y estadísticas */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestión de Programación
          </Typography>
          <Typography color="text.secondary">
            {stats.total} programas total • {stats.active} activos • {stats.withHosts} con conductores
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to="/admin/programming/new"
        >
          Nuevo Programa
        </Button>
      </Box>

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
              placeholder="Buscar programas..."
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
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filterType}
                label="Tipo"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="music">Música</MenuItem>
                <MenuItem value="news">Noticias</MenuItem>
                <MenuItem value="talk">Conversación</MenuItem>
                <MenuItem value="sports">Deportes</MenuItem>
                <MenuItem value="variety">Variedad</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Día</InputLabel>
              <Select
                value={filterDay}
                label="Día"
                onChange={(e) => setFilterDay(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="lunes-viernes">Lun-Vie</MenuItem>
                <MenuItem value="sabados">Sábados</MenuItem>
                <MenuItem value="domingos">Domingos</MenuItem>
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
                <MenuItem value="active">Activos</MenuItem>
                <MenuItem value="inactive">Inactivos</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="outlined"
                onClick={clearFilters}
                disabled={!searchTerm && !filterType && !filterDay && !filterStatus}
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
      ) : filteredPrograms.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Radio sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {programs.length === 0 ? 'No hay programas disponibles' : 'No se encontraron programas'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {programs.length === 0 
              ? 'Comienza creando tu primer programa' 
              : 'Intenta cambiar los filtros de búsqueda'
            }
          </Typography>
          {programs.length === 0 && (
            <Button 
              variant="contained" 
              startIcon={<Add />}
              component={Link}
              to="/admin/programming/new"
            >
              Crear Primer Programa
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
            ¿Está seguro que desea eliminar este programa? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteProgram} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgrammingManagementPage; 