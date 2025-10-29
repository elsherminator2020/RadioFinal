import React from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  useTheme,
  Skeleton,
  Alert
} from '@mui/material';
import NewsCard from './NewsCard';
import type { News } from '../../services/newsService';

interface NewsGridProps {
  news: News[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  compact?: boolean;
}

const NewsGrid: React.FC<NewsGridProps> = ({ 
  news, 
  loading = false, 
  error = null, 
  title,
  compact = false
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Loading skeleton
  const renderSkeletons = () => {
    const skeletonCount = compact ? 4 : 3;
    return Array(skeletonCount).fill(0).map((_, index) => (
      <Grid item key={index} xs={12} sm={compact ? 6 : 12} md={compact ? 3 : 4}>
        <Box 
          sx={{ 
            height: compact ? 340 : 420, 
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
            border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
          }}
        >
          <Skeleton 
            variant="rectangular" 
            height={compact ? 160 : 220} 
            sx={{ 
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
            }} 
          />
          <Box sx={{ p: 3 }}>
            <Skeleton variant="text" height={32} width="85%" sx={{ mb: 1.5, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />
            <Skeleton variant="text" height={24} width="40%" sx={{ mb: 2.5, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }} />
            <Skeleton variant="text" height={16} sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }} />
            <Skeleton variant="text" height={16} sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }} />
            <Skeleton variant="text" height={16} width="60%" sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }} />
          </Box>
        </Box>
      </Grid>
    ));
  };

  return (
    <Box>
      {title && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              color: isDark ? 'primary.light' : 'primary.main',
              position: 'relative',
              display: 'inline-block',
              pb: 2,
              mb: 1,
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: '80px',
                height: '3px',
                backgroundColor: theme.palette.primary.main,
                transform: 'translateX(-50%)'
              }
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              maxWidth: '600px',
              mx: 'auto',
              mt: 1,
              opacity: 0.8
            }}
          >
            {compact ? 
              'Descubre las noticias más importantes de nuestra comunidad' : 
              'Mantente informado con todas las novedades y acontecimientos de la región'}
          </Typography>
        </Box>
      )}

      {loading ? (
        <Grid container spacing={4}>
          {renderSkeletons()}
        </Grid>
      ) : error ? (
        <Alert 
          severity="error" 
          variant="filled"
          sx={{ 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: 2,
            py: 2
          }}
        >
          {error}
        </Alert>
      ) : news.length === 0 ? (
        <Alert 
          severity="info" 
          variant="filled"
          sx={{ 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: 2,
            py: 2
          }}
        >
          No hay noticias disponibles en este momento. Vuelve a revisar pronto para más actualizaciones.
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {news.map((item) => (
            <Grid 
              item 
              key={item.id} 
              xs={12} 
              sm={compact ? 6 : 12} 
              md={compact ? 3 : 4} 
              lg={compact ? 3 : 4}
            >
              <NewsCard news={item} compact={compact} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default NewsGrid; 