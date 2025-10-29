import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link as MuiLink, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NewsForm from '../../components/admin/NewsForm';
import { getNewsById } from '../../services/newsService';
import type { News } from '../../services/newsService';

interface NewsEditorPageProps {
  isEdit?: boolean;
}

const NewsEditorPage: React.FC<NewsEditorPageProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirigir si no hay usuario autenticado
    if (!user) {
      navigate('/login');
      return;
    }

    // Si estamos en modo edición, cargar la noticia
    if (isEdit && id) {
      const fetchNews = async () => {
        try {
          const data = await getNewsById(parseInt(id));
          setNews(data);
        } catch (err) {
          console.error('Error fetching news:', err);
          setError('No se pudo cargar la noticia para editar.');
        } finally {
          setLoading(false);
        }
      };

      fetchNews();
    }
  }, [isEdit, id, user, navigate]);

  // Verificar autenticación
  if (!user) {
    return null; // No renderizar nada si no hay usuario autenticado
  }

  // Mostrar pantalla de carga mientras se obtiene la noticia
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar error si no se pudo cargar la noticia
  if (isEdit && error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <MuiLink 
          component={Link} 
          to="/admin"
          sx={{ display: 'block', mt: 2 }}
        >
          Volver al panel de administración
        </MuiLink>
      </Box>
    );
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
          {isEdit ? 'Editar Noticia' : 'Crear Noticia'}
        </Typography>
      </Breadcrumbs>

      {/* Título */}
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ mb: 3 }}
      >
        {isEdit ? 'Editar Noticia' : 'Crear Nueva Noticia'}
      </Typography>

      {/* Formulario */}
      <NewsForm 
        initialData={news || undefined}
        isEdit={isEdit}
      />
    </Box>
  );
};

export default NewsEditorPage; 