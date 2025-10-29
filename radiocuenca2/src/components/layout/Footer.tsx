import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton, useTheme } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube, Email, Phone, LocationOn } from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: isDark ? '#3C2A1E' : '#8B5A2B', 
        color: isDark ? '#F0E3CE' : 'white',
        py: 4,
        mt: 6,
        borderTop: 1,
        borderColor: isDark ? 'rgba(193, 154, 107, 0.2)' : 'rgba(255, 255, 255, 0.2)',
        width: '100%'
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Radio Cuenca Cañera 94.5FM
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              La radio que te acompaña con la mejor música y las últimas noticias.
            </Typography>
            <Box sx={{ 
              mt: 2,
              display: 'flex',
              gap: 1
            }}>
              <IconButton 
                color="inherit" 
                aria-label="Facebook"
                sx={{ 
                  bgcolor: isDark ? 'rgba(193, 154, 107, 0.15)' : 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(193, 154, 107, 0.25)' : 'rgba(255, 255, 255, 0.25)',
                  }
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="Twitter"
                sx={{ 
                  bgcolor: isDark ? 'rgba(193, 154, 107, 0.15)' : 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(193, 154, 107, 0.25)' : 'rgba(255, 255, 255, 0.25)',
                  }
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="Instagram"
                sx={{ 
                  bgcolor: isDark ? 'rgba(193, 154, 107, 0.15)' : 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(193, 154, 107, 0.25)' : 'rgba(255, 255, 255, 0.25)',
                  }
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="YouTube"
                sx={{ 
                  bgcolor: isDark ? 'rgba(193, 154, 107, 0.15)' : 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(193, 154, 107, 0.25)' : 'rgba(255, 255, 255, 0.25)',
                  }
                }}
              >
                <YouTube />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Enlaces
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column' 
              }}
            >
              <Link 
                href="/" 
                color="inherit" 
                underline="hover" 
                sx={{ 
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  '&:hover': {
                    pl: 0.5,
                  }
                }}
              >
                Inicio
              </Link>
              <Link 
                href="/noticias" 
                color="inherit" 
                underline="hover" 
                sx={{ 
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  '&:hover': {
                    pl: 0.5,
                  }
                }}
              >
                Noticias
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover" 
                sx={{ 
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  '&:hover': {
                    pl: 0.5,
                  }
                }}
              >
                Programación
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  '&:hover': {
                    pl: 0.5,
                  }
                }}
              >
                Contacto
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contacto
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
              <LocationOn fontSize="small" sx={{ mt: 0.5, mr: 1, opacity: 0.8 }} />
              <Typography variant="body2">
                Villa Ocampo, Santa Fe, Argentina
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Phone fontSize="small" sx={{ mr: 1, opacity: 0.8 }} />
              <Typography variant="body2">
                Tel: 03482-466429 / Cel: 3482-266688
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email fontSize="small" sx={{ mr: 1, opacity: 0.8 }} />
              <Typography variant="body2">
                radiocanera@gmail.com
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box 
          sx={{ 
            borderTop: 1, 
            borderColor: isDark ? 'rgba(193, 154, 107, 0.2)' : 'rgba(255, 255, 255, 0.2)', 
            mt: 4, 
            pt: 2, 
            textAlign: 'center',
            opacity: 0.7 
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Radio Cuenca Cañera 94.5FM. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 