import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  useTheme, 
  useMediaQuery,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import RadioIcon from '@mui/icons-material/Radio';

const AboutUsPage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth={false}>
        {/* Título principal */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              fontWeight: 800,
              color: isDark ? '#C19A6B' : '#8B5A2B',
              mb: 2,
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
            Quiénes Somos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}>
            Conozca más sobre FM Cuenca Cañera 94.5, nuestra historia en Villa Ocampo, Santa Fe, y nuestro compromiso con la comunidad de la región.
          </Typography>
        </Box>

        {/* Sección de Historia de la Radio */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 4, md: 6 }, 
              borderRadius: 4,
              bgcolor: isDark ? 'rgba(60, 42, 30, 0.6)' : '#F5EEE0',
              border: isDark ? 'none' : '1px solid rgba(139, 90, 43, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Patrón decorativo de fondo */}
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.03,
                background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isDark ? 'C19A6B' : '8B5A2B'}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                zIndex: 0
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Header con ícono */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: isDark 
                      ? 'linear-gradient(135deg, #C19A6B 0%, #AA8062 100%)'
                      : 'linear-gradient(135deg, #8B5A2B 0%, #6B4226 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: '0 4px 12px rgba(139, 90, 43, 0.3)'
                  }}
                >
                  <RadioIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  sx={{ 
                    color: isDark ? '#D9BC97' : '#8B5A2B',
                    fontWeight: 700,
                    fontSize: { xs: '1.8rem', md: '2.125rem' }
                  }}
                >
                  Nuestra Historia
                </Typography>
              </Box>

              {/* Contenido de la historia */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography 
                    paragraph 
                    sx={{ 
                      mb: 3, 
                      lineHeight: 1.8,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      color: isDark ? '#F0E3CE' : '#4A3728',
                      fontWeight: 400
                    }}
                  >
                    <strong style={{ 
                      color: isDark ? '#D9BC97' : '#8B5A2B',
                      fontWeight: 600 
                    }}>
                      FM Cuenca Cañera nació en Villa Ocampo, Santa Fe
                    </strong>, como un proyecto radial comprometido con la comunidad local y la región de la Cuenca Cañera. Desde sus inicios, la emisora se propuso ser un puente de comunicación cercano, que reflejara la identidad, cultura y necesidades de sus oyentes.
                  </Typography>
                  
                  <Typography 
                    paragraph 
                    sx={{ 
                      mb: 3, 
                      lineHeight: 1.8,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      color: isDark ? '#F0E3CE' : '#4A3728'
                    }}
                  >
                    A lo largo de los años, <strong style={{ 
                      color: isDark ? '#D9BC97' : '#8B5A2B',
                      fontWeight: 600 
                    }}>FM Cuenca Cañera se ha consolidado como una voz confiable</strong> para la difusión de noticias, deportes, música y eventos de interés regional. Su programación diversa y accesible ha logrado captar la atención de una audiencia amplia, que confía en la radio para informarse y entretenerse las 24 horas del día.
                  </Typography>
                  
                  <Typography 
                    paragraph 
                    sx={{ 
                      mb: 3, 
                      lineHeight: 1.8,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      color: isDark ? '#F0E3CE' : '#4A3728'
                    }}
                  >
                    Comprometida con el desarrollo local, la emisora ha acompañado a la comunidad en los momentos importantes, <strong style={{ 
                      color: isDark ? '#D9BC97' : '#8B5A2B',
                      fontWeight: 600 
                    }}>apoyando iniciativas culturales, deportivas y sociales</strong>, y brindando un espacio para la participación ciudadana.
                  </Typography>
                  
                  <Typography 
                    paragraph 
                    sx={{ 
                      lineHeight: 1.8,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      color: isDark ? '#F0E3CE' : '#4A3728'
                    }}
                  >
                    Hoy, <strong style={{ 
                      color: isDark ? '#D9BC97' : '#8B5A2B',
                      fontWeight: 600 
                    }}>FM Cuenca Cañera continúa renovándose y adaptándose a los nuevos tiempos</strong>, ofreciendo además su señal online para llegar más allá de las fronteras de Villa Ocampo, manteniendo siempre su esencia y compromiso con su gente.
                  </Typography>
                </Grid>
              </Grid>

              {/* Destacado final */}
              <Box 
                sx={{ 
                  mt: 4,
                  p: 3,
                  borderRadius: 3,
                  background: isDark 
                    ? 'linear-gradient(135deg, rgba(193, 154, 107, 0.15) 0%, rgba(170, 128, 98, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(139, 90, 43, 0.1) 0%, rgba(107, 66, 38, 0.05) 100%)',
                  border: `1px solid ${isDark ? 'rgba(193, 154, 107, 0.2)' : 'rgba(139, 90, 43, 0.15)'}`,
                  textAlign: 'center'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: isDark ? '#D9BC97' : '#8B5A2B',
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  📻 FM Cuenca Cañera 94.5 MHz
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: isDark ? '#F0E3CE' : '#4A3728',
                    fontStyle: 'italic',
                    fontSize: { xs: '0.95rem', md: '1rem' }
                  }}
                >
                  "La voz de Villa Ocampo que conecta corazones en toda la región"
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>

        {/* Línea divisoria con ícono */}
        <Box sx={{ display: 'flex', alignItems: 'center', my: 6 }}>
          <Divider sx={{ flex: 1, borderColor: isDark ? 'rgba(193, 154, 107, 0.2)' : 'rgba(139, 90, 43, 0.15)' }} />
          <RadioIcon sx={{ mx: 2, color: 'primary.main', fontSize: 28 }} />
          <Divider sx={{ flex: 1, borderColor: isDark ? 'rgba(193, 154, 107, 0.2)' : 'rgba(139, 90, 43, 0.15)' }} />
        </Box>

        {/* Sección de Contacto y Ubicación */}
        <Grid container spacing={4}>
          {/* Información de Contacto */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 4,
              height: '100%',
              bgcolor: isDark ? 'rgba(60, 42, 30, 0.6)' : '#F5EEE0',
              boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.2)' : '0 8px 20px rgba(139, 90, 43, 0.1)',
              border: isDark ? 'none' : '1px solid rgba(139, 90, 43, 0.1)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  sx={{ 
                    mb: 3, 
                    color: isDark ? '#D9BC97' : '#8B5A2B',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ContactIcon sx={{ mr: 1, fontSize: 32 }} />
                  Contáctanos
                </Typography>
                
                <List sx={{ mt: 2 }}>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Teléfono"
                      secondary="Tel: 03482-466429 / Cel: 3482-266688"
                      primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Correo Electrónico"
                      secondary="radiocanera@gmail.com"
                      primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Dirección"
                      secondary="Villa Ocampo, Santa Fe, Argentina"
                      primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                      <AccessTimeIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Horario"
                      secondary="Lunes a Viernes: 8:00 AM - 8:00 PM 
                      Sábados: 9:00 AM - 5:00 PM"
                      primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                    />
                  </ListItem>
                </List>
                
                <Divider sx={{ my: 3, borderColor: isDark ? 'rgba(193, 154, 107, 0.2)' : 'rgba(139, 90, 43, 0.15)' }} />
                
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Síguenos en redes sociales
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Link href="https://facebook.com" target="_blank" color="inherit">
                    <FacebookIcon sx={{ fontSize: 32, color: 'primary.main', '&:hover': { opacity: 0.8 } }} />
                  </Link>
                  <Link href="https://instagram.com" target="_blank" color="inherit">
                    <InstagramIcon sx={{ fontSize: 32, color: 'primary.main', '&:hover': { opacity: 0.8 } }} />
                  </Link>
                  <Link href="https://twitter.com" target="_blank" color="inherit">
                    <TwitterIcon sx={{ fontSize: 32, color: 'primary.main', '&:hover': { opacity: 0.8 } }} />
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Mapa de Google */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 4,
              height: '100%',
              boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.2)' : '0 8px 20px rgba(139, 90, 43, 0.1)',
              overflow: 'hidden',
              border: isDark ? 'none' : '1px solid rgba(139, 90, 43, 0.1)',
            }}>
              <CardContent sx={{ p: 0, height: '100%', '&:last-child': { pb: 0 } }}>
                <Box sx={{ p: 3, bgcolor: isDark ? 'rgba(60, 42, 30, 0.6)' : '#F5EEE0' }}>
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    sx={{ 
                      color: isDark ? '#D9BC97' : '#8B5A2B',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <LocationOnIcon sx={{ mr: 1, fontSize: 32 }} />
                    Nuestra Ubicación
                  </Typography>
                </Box>
                <Box sx={{ height: isMobile ? '300px' : '400px', width: '100%' }}>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.7908876548963!2d-59.355681518318264!3d-28.485843563691702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x944f1bbefd8c25af%3A0xf10bc45eafcb2454!2sFM%2094.5%20Radio%20Cuenca%20Ca%C3%B1era!5e0!3m2!1ses!2sar!4v1747866889930!5m2!1ses!2sar" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Custom icon for the Contact section
const ContactIcon = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width="1em" 
    height="1em" 
    {...props}
  >
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

export default AboutUsPage; 