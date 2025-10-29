import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import RadioIcon from '@mui/icons-material/Radio';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeMode } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useThemeMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    handleClose();
  };

  return (
    <AppBar 
      position="static"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(0, 0, 0, 0.7)',
        color: theme.palette.mode === 'light' ? 'primary.main' : 'white',
        borderBottom: 1,
        borderColor: 'divider',
        width: '100%'
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          {/* Logo y título */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: isMobile ? 0 : 1 }}>
            <RadioIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                fontWeight: 700,
                fontFamily: '"Playfair Display", serif',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Radio Cuenca Cañera 94.5FM
            </Typography>
          </Box>

          {/* Menú de navegación en desktop */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{ mx: 1 }}
              >
                Inicio
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/noticias"
                sx={{ mx: 1 }}
              >
                Noticias
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/programacion"
                sx={{ mx: 1 }}
              >
                Programación
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/quienes-somos"
                sx={{ mx: 1 }}
              >
                Quiénes Somos
              </Button>
              {user ? (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin"
                    sx={{ mx: 1 }}
                  >
                    Admin
                  </Button>
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    sx={{ mx: 1 }}
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ mx: 1 }}
                >
                  Iniciar Sesión
                </Button>
              )}
              
              {/* Theme Toggle Button */}
              <Tooltip title={mode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
                <IconButton 
                  onClick={toggleColorMode} 
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            // Menú móvil
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              {/* Theme Toggle Button (Mobile) */}
              <Tooltip title={mode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
                <IconButton 
                  onClick={toggleColorMode} 
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Tooltip>
              
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleNavigate('/')}>Inicio</MenuItem>
                <MenuItem onClick={() => handleNavigate('/noticias')}>Noticias</MenuItem>
                <MenuItem onClick={() => handleNavigate('/programacion')}>Programación</MenuItem>
                <MenuItem onClick={() => handleNavigate('/quienes-somos')}>Quiénes Somos</MenuItem>
                {user ? [
                    <MenuItem key="admin" onClick={() => handleNavigate('/admin')}>Admin</MenuItem>,
                    <MenuItem key="logout" onClick={handleLogout}>Cerrar Sesión</MenuItem>
                  ] : (
                    <MenuItem onClick={() => handleNavigate('/login')}>Iniciar Sesión</MenuItem>
                  )}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 