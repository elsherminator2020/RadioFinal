import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        py: 5,
      }}
    >
      <Paper 
        sx={{ 
          p: 5, 
          borderRadius: 2,
          maxWidth: '600px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Página no encontrada
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/"
          size="large"
        >
          Volver al Inicio
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage; 