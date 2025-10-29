import React from 'react';
import { Container, Box, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import RadioPlayer from '../home/RadioPlayer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Verificar si estamos en una ruta de administración
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Detectar scroll para minimizar el reproductor con debouncing y histéresis
  React.useEffect(() => {
    const handleScroll = () => {
      // Limpiar timeout anterior
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Debouncing del scroll
      scrollTimeoutRef.current = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Usar histéresis para evitar oscilaciones
        // Minimizar cuando baja a 120px, restaurar cuando sube a 80px
        if (!isScrolled && scrollTop > 120) {
          setIsScrolled(true);
        } else if (isScrolled && scrollTop < 80) {
          setIsScrolled(false);
        }
      }, 10); // Pequeño delay para debouncing
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isScrolled]);
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      backgroundColor: theme.palette.background.default,
    }}>
      <Header />
      
      {/* Mostrar el reproductor de radio en todas las páginas excepto en admin */}
      {!isAdminRoute && (
        <Box sx={{ 
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          width: '100%',
          // Fondo completamente transparente
          backgroundColor: 'transparent',
          // Mantener padding fijo para evitar saltos de layout
          py: 1,
          // Usar transform en lugar de cambios de layout
          transform: isScrolled ? 'scaleY(0.8)' : 'scaleY(1)',
          transformOrigin: 'center',
          // Transición más suave y específica
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          // Evitar overflow durante la transición
          overflow: 'hidden'
        }}>
          <Container 
            maxWidth={false} 
            disableGutters
            sx={{
              // Compensar el scale con padding interno
              py: isScrolled ? 0.25 : 0,
              transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <RadioPlayer isMinimized={isScrolled} />
          </Container>
        </Box>
      )}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          width: '100%',
          pt: { xs: 2, md: 4 },
          pb: { xs: 4, md: 6 },
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          backgroundColor: theme.palette.background.default,
          '&::after': theme.palette.mode === 'dark' ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1474021650940-5fade069a7fb?q=80&w=1920&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 0.03,
            zIndex: -1,
          } : {},
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout; 