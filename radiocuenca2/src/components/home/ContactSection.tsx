import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  useTheme,
  Divider,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon,
  RadioOutlined as RadioIcon
} from '@mui/icons-material';

const ContactSection: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box 
      sx={{ 
        py: { xs: 6, md: 10 },
        backgroundColor: isDark 
          ? 'rgba(24, 16, 12, 0.7)' 
          : 'rgba(248, 244, 233, 0.7)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2370&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05,
          zIndex: -1,
        }
      }}
    >
      <Container maxWidth={false}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              fontFamily: '"Playfair Display", serif',
              color: isDark ? 'primary.light' : 'primary.dark',
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
            Conectate con Nosotros
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto', 
              mt: 4,
              color: isDark ? 'rgba(240, 227, 206, 0.95)' : 'rgba(74, 55, 40, 0.95)',
            }}
          >
            En Radio Cuenca Cañera 94.5 FM valoramos el contacto con nuestra audiencia. 
            ¿Tienes una sugerencia, un mensaje o quieres participar en nuestros programas? 
            ¡Estamos a un mensaje de distancia!
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Card 
              elevation={isDark ? 3 : 2}
              sx={{
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: isDark 
                  ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                  : '0 10px 30px rgba(139, 90, 43, 0.1)',
                backgroundColor: isDark 
                  ? 'rgba(60, 42, 30, 0.8)' 
                  : 'rgba(255, 255, 255, 0.9)',
                position: 'relative',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <RadioIcon 
                    sx={{ 
                      fontSize: 40, 
                      color: 'primary.main',
                      mr: 2
                    }} 
                  />
                  <Typography 
                    variant="h4" 
                    component="h3"
                    sx={{ 
                      fontWeight: 600,
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    Datos de Contacto
                  </Typography>
                </Box>

                <Typography variant="body1" paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
                  Nos encantaría saber de ti. Ya sea que quieras compartir tus comentarios, 
                  solicitar una canción especial, o simplemente saludar, estamos aquí para escucharte.
                  Nuestro equipo está disponible para responder a tus inquietudes y 
                  hacer que tu experiencia con Radio Cuenca Cañera sea inolvidable.
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <PhoneIcon sx={{ color: 'primary.main', mr: 2, fontSize: 24 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Teléfonos
                      </Typography>
                      <Typography variant="body2">
                        Tel: 03482-466429 / Cel: 3482-266688
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <EmailIcon sx={{ color: 'primary.main', mr: 2, fontSize: 24 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Correo Electrónico
                      </Typography>
                      <Typography variant="body2">
                        radiocanera@gmail.com
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ color: 'primary.main', mr: 2, fontSize: 24 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Dirección
                      </Typography>
                      <Typography variant="body2">
                        Villa Ocampo, Santa Fe, Argentina
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ 
                  my: 4, 
                  borderColor: isDark 
                    ? 'rgba(193, 154, 107, 0.2)' 
                    : 'rgba(139, 90, 43, 0.15)'
                }} />

                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 600,
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    Síguenos en Redes Sociales
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton 
                      sx={{ 
                        color: 'primary.main',
                        backgroundColor: isDark 
                          ? 'rgba(193, 154, 107, 0.1)' 
                          : 'rgba(139, 90, 43, 0.05)',
                        '&:hover': {
                          backgroundColor: isDark 
                            ? 'rgba(193, 154, 107, 0.2)' 
                            : 'rgba(139, 90, 43, 0.1)',
                        }
                      }}
                    >
                      <FacebookIcon />
                    </IconButton>
                    <IconButton 
                      sx={{ 
                        color: 'primary.main',
                        backgroundColor: isDark 
                          ? 'rgba(193, 154, 107, 0.1)' 
                          : 'rgba(139, 90, 43, 0.05)',
                        '&:hover': {
                          backgroundColor: isDark 
                            ? 'rgba(193, 154, 107, 0.2)' 
                            : 'rgba(139, 90, 43, 0.1)',
                        }
                      }}
                    >
                      <InstagramIcon />
                    </IconButton>
                    <IconButton 
                      sx={{ 
                        color: 'primary.main',
                        backgroundColor: isDark 
                          ? 'rgba(193, 154, 107, 0.1)' 
                          : 'rgba(139, 90, 43, 0.05)',
                        '&:hover': {
                          backgroundColor: isDark 
                            ? 'rgba(193, 154, 107, 0.2)' 
                            : 'rgba(139, 90, 43, 0.1)',
                        }
                      }}
                    >
                      <TwitterIcon />
                    </IconButton>
                    <IconButton 
                      sx={{ 
                        color: 'primary.main',
                        backgroundColor: isDark 
                          ? 'rgba(193, 154, 107, 0.1)' 
                          : 'rgba(139, 90, 43, 0.05)',
                        '&:hover': {
                          backgroundColor: isDark 
                            ? 'rgba(193, 154, 107, 0.2)' 
                            : 'rgba(139, 90, 43, 0.1)',
                        }
                      }}
                    >
                      <WhatsAppIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 4
              }}
            >
              <Card 
                elevation={isDark ? 3 : 2}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: isDark 
                    ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                    : '0 10px 30px rgba(139, 90, 43, 0.1)',
                  backgroundColor: isDark 
                    ? 'rgba(60, 42, 30, 0.8)' 
                    : 'rgba(255, 255, 255, 0.9)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  flex: 1
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 600,
                      fontFamily: '"Playfair Display", serif',
                      color: isDark ? 'primary.light' : 'primary.dark',
                    }}
                  >
                    Horario de Atención
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    Estamos disponibles para atenderte:
                  </Typography>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Lunes a Viernes
                    </Typography>
                    <Typography variant="body2">
                      8:00 AM - 8:00 PM
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Sábados
                    </Typography>
                    <Typography variant="body2">
                      9:00 AM - 5:00 PM
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card 
                elevation={isDark ? 3 : 2}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: isDark 
                    ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                    : '0 10px 30px rgba(139, 90, 43, 0.1)',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  flex: 1
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 600,
                      fontFamily: '"Playfair Display", serif',
                      color: 'white',
                    }}
                  >
                    ¿Quieres Participar?
                  </Typography>
                  
                  <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Si quieres participar en nuestros programas, solicitar una canción o enviar un saludo al aire, 
                    no dudes en contactarnos. ¡Tu mensaje es importante para nosotros!
                  </Typography>
                  
                  <Button 
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 2,
                      backgroundColor: 'white',
                      color: 'primary.main',
                      fontWeight: 600,
                      borderRadius: 10,
                      py: 1,
                      px: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                    href="mailto:radiocanera@gmail.com"
                  >
                    Contáctanos Ahora
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactSection; 