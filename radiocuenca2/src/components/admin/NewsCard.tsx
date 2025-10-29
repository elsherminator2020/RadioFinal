import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { News } from '../../services/newsService';

interface NewsCardProps {
  news: News;
  onDelete: (id: number) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onDelete }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      {news.image_url && (
        <CardMedia
          component="img"
          height="200"
          image={news.image_url}
          alt={news.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
          <Chip 
            label={format(new Date(news.publish_date), 'dd/MM/yyyy', { locale: es })} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          {news.image_url && (
            <Chip 
              icon={<ImageIcon />} 
              label="Imagen" 
              size="small" 
              color="success" 
            />
          )}
          {news.video_url && (
            <Chip 
              icon={<VideoIcon />} 
              label="Video" 
              size="small" 
              color="error" 
            />
          )}
        </Stack>
        
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
            minHeight: '2.6em',
            mb: 1
          }}
        >
          {news.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5,
            minHeight: '4.5em'
          }}
        >
          {news.content}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Ver noticia">
            <IconButton 
              size="small" 
              color="info"
              component={Link}
              to={`/noticias/${news.id}`}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Editar">
            <IconButton 
              size="small" 
              color="primary"
              component={Link}
              to={`/admin/news/edit/${news.id}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Eliminar">
            <IconButton 
              size="small" 
              color="error"
              onClick={() => onDelete(news.id!)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
