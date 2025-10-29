import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Chip,
  Stack,
  useTheme,
  Grow
} from '@mui/material';
import { 
  OpenInNew, 
  Campaign,
  TrendingUp,
  Analytics
} from '@mui/icons-material';
import { getAdvertisementsByPosition, recordAdvertisementClick } from '../../services/advertisementService';
import type { Advertisement } from '../../services/advertisementService';

interface AdvertisementDisplayProps {
  position: 'header' | 'sidebar' | 'footer' | 'content' | 'popup';
  maxAds?: number;
  className?: string;
}

const AdvertisementDisplay: React.FC<AdvertisementDisplayProps> = ({ 
  position, 
  maxAds = 3,
  className 
}) => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const ads = await getAdvertisementsByPosition(position);
        setAdvertisements(ads.slice(0, maxAds));
      } catch (err) {
        console.error('Error fetching advertisements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, [position, maxAds]);

  const handleAdClick = async (ad: Advertisement) => {
    try {
      await recordAdvertisementClick(ad.id!);
      if (ad.link_url) {
        window.open(ad.link_url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Error recording click:', err);
    }
  };

  // No mostrar nada si no hay publicidades
  if (loading || advertisements.length === 0) {
    return null;
  }

  const getAdSize = (position: string) => {
    // Todas las posiciones usan altura automática con límites máximos
    const maxHeights: Record<string, number> = {
      header: 600,
      sidebar: 300,
      footer: 250,
      content: 400,
      popup: 500
    };
    
    return { 
      width: '100%', 
      height: 'auto',
      maxHeight: maxHeights[position] || 400
    };
  };

  const renderAdvertisement = (ad: Advertisement, index: number) => {
    const adSize = getAdSize(position);
    const isHeader = position === 'header';
    
    return (
      <Grow in={true} timeout={500 + (index * 200)} key={ad.id}>
        <Card 
          elevation={isHeader ? 0 : undefined}
          sx={{ 
            cursor: ad.link_url ? 'pointer' : 'default',
            transition: 'all 0.3s ease',
            '&:hover': ad.link_url ? {
              transform: isHeader ? 'scale(1.01)' : 'translateY(-4px)',
              boxShadow: isHeader ? 'none' : theme.shadows[8]
            } : {},
            mb: isHeader ? 0 : 2,
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: isHeader ? 'transparent' : undefined
          }}
          onClick={() => ad.link_url && handleAdClick(ad)}
        >
          {/* Badge de publicidad - oculto en header */}
          {!isHeader && (
            <Box sx={{ 
              position: 'absolute', 
              top: 6, 
              right: 6, 
              zIndex: 2 
            }}>
              <Chip
                size="small"
                icon={position === 'sidebar' ? undefined : <Campaign />}
                label={position === 'sidebar' ? 'AD' : 'PUBLICIDAD'}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  fontSize: position === 'sidebar' ? '0.6rem' : '0.7rem',
                  fontWeight: 'bold',
                  height: position === 'sidebar' ? '20px' : 'auto',
                  '& .MuiChip-label': {
                    px: position === 'sidebar' ? 1 : 1.5
                  }
                }}
              />
            </Box>
          )}

          <CardMedia
            component="img"
            image={ad.image_url}
            alt={ad.title}
            sx={{ 
              objectFit: 'contain',
              objectPosition: 'center',
              width: '100%',
              maxWidth: '100%',
              height: 'auto',
              maxHeight: `${adSize.maxHeight}px`,
              display: 'block',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'
            }}
          />

          {/* Contenido - oculto en header */}
          {!isHeader && (
            <CardContent sx={{ p: { xs: 1.5, md: position === 'sidebar' ? 1 : 1.5 } }}>
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom
              sx={{ 
                fontSize: position === 'sidebar' ? '0.85rem' : '0.9rem',
                fontWeight: 'bold',
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: position === 'sidebar' ? 1 : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: position === 'sidebar' ? 0.5 : 1
              }}
            >
              {ad.title}
            </Typography>

            {ad.description && position !== 'sidebar' && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  mb: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.4,
                  fontSize: '0.85rem'
                }}
              >
                {ad.description}
              </Typography>
            )}

            {ad.link_url && position !== 'sidebar' && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                  Ver más
                </Typography>
                <OpenInNew sx={{ fontSize: 14, color: 'primary.main' }} />
              </Stack>
            )}

              {/* Estadísticas (solo en modo desarrollo y no en sidebar) */}
              {process.env.NODE_ENV === 'development' && position !== 'sidebar' && (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    size="small"
                    icon={<Analytics />}
                    label={`${ad.click_count} clics`}
                    variant="outlined"
                    sx={{ fontSize: '0.6rem' }}
                  />
                  <Chip
                    size="small"
                    icon={<TrendingUp />}
                    label={`${ad.impression_count} impresiones`}
                    variant="outlined"
                    sx={{ fontSize: '0.6rem' }}
                  />
                </Stack>
              )}
            </CardContent>
          )}
        </Card>
      </Grow>
    );
  };

  return (
    <Box 
      className={className} 
      sx={{ 
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}
    >
      {advertisements.map((ad, index) => renderAdvertisement(ad, index))}
    </Box>
  );
};

// Componente específico para publicidades laterales
export const SidebarAdvertisements: React.FC<{ maxAds?: number }> = ({ maxAds = 2 }) => {
  return (
    <Box sx={{ 
      mb: 3,
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: 'text.secondary',
          fontSize: '0.95rem',
          fontWeight: 'bold',
          mb: 2
        }}
      >
        <Campaign fontSize="small" />
        Publicidad
      </Typography>
      <AdvertisementDisplay position="sidebar" maxAds={maxAds} />
    </Box>
  );
};

// Componente específico para publicidades de encabezado
export const HeaderAdvertisements: React.FC<{ maxAds?: number }> = ({ maxAds = 1 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Box sx={{ 
      mb: 4,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      px: { xs: 2, md: 3 }
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '95%', md: '1400px' },
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: isDark 
          ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
          : '0 8px 32px rgba(139, 90, 43, 0.15)',
        border: isDark 
          ? '2px solid rgba(193, 154, 107, 0.25)' 
          : '2px solid rgba(139, 90, 43, 0.12)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: isDark 
            ? '0 12px 40px rgba(0, 0, 0, 0.5)' 
            : '0 12px 40px rgba(139, 90, 43, 0.2)'
        }
      }}>
        <AdvertisementDisplay position="header" maxAds={maxAds} />
      </Box>
    </Box>
  );
};

// Componente específico para publicidades de pie de página
export const FooterAdvertisements: React.FC<{ maxAds?: number }> = ({ maxAds = 2 }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <AdvertisementDisplay position="footer" maxAds={maxAds} />
    </Box>
  );
};

// Componente específico para publicidades de contenido
export const ContentAdvertisements: React.FC<{ maxAds?: number }> = ({ maxAds = 1 }) => {
  return (
    <Box sx={{ my: 3 }}>
      <AdvertisementDisplay position="content" maxAds={maxAds} />
    </Box>
  );
};

export default AdvertisementDisplay;


