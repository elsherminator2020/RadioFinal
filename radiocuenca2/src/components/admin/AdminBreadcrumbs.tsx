import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { NavigateNext as NavigateNextIcon, Home as HomeIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const AdminBreadcrumbs: React.FC = () => {
  const location = useLocation();
  
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const breadcrumbNameMap: { [key: string]: string } = {
    'admin': 'Administración',
    'news': 'Noticias',
    'programming': 'Programación',
    'advertisements': 'Publicidades',
    'new': 'Crear Nuevo',
    'edit': 'Editar'
  };

  if (location.pathname === '/admin') {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 1
          }
        }}
      >
        <Link
          component={RouterLink}
          to="/admin"
          underline="hover"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Dashboard
        </Link>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          if (!isNaN(Number(value))) {
            return null;
          }
          
          const name = breadcrumbNameMap[value] || value;
          
          return last ? (
            <Typography 
              key={to} 
              color="text.primary"
              sx={{ fontWeight: 600 }}
            >
              {name}
            </Typography>
          ) : (
            <Link
              key={to}
              component={RouterLink}
              to={to}
              underline="hover"
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              {name}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default AdminBreadcrumbs;
