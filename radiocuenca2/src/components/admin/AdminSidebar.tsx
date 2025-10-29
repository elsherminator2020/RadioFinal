import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  Radio as RadioIcon,
  Campaign as CampaignIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  List as ListIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  stats?: {
    totalNews: number;
    totalPrograms: number;
    totalAds: number;
  };
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, onClose, stats }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [newsOpen, setNewsOpen] = React.useState(false);
  const [programmingOpen, setProgrammingOpen] = React.useState(false);
  const [adsOpen, setAdsOpen] = React.useState(false);

  const drawerWidth = 280;

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin',
      exact: true
    },
    {
      title: 'Noticias',
      icon: <ArticleIcon />,
      badge: stats?.totalNews,
      expandable: true,
      open: newsOpen,
      setOpen: setNewsOpen,
      subitems: [
        { title: 'Ver Todas', icon: <ListIcon />, path: '/admin/news' },
        { title: 'Crear Nueva', icon: <AddIcon />, path: '/admin/news/new' }
      ]
    },
    {
      title: 'Programación',
      icon: <RadioIcon />,
      badge: stats?.totalPrograms,
      expandable: true,
      open: programmingOpen,
      setOpen: setProgrammingOpen,
      subitems: [
        { title: 'Ver Todos', icon: <ListIcon />, path: '/admin/programming' },
        { title: 'Crear Nuevo', icon: <AddIcon />, path: '/admin/programming/new' }
      ]
    },
    {
      title: 'Publicidades',
      icon: <CampaignIcon />,
      badge: stats?.totalAds,
      expandable: true,
      open: adsOpen,
      setOpen: setAdsOpen,
      subitems: [
        { title: 'Ver Todas', icon: <ListIcon />, path: '/admin/advertisements' },
        { title: 'Crear Nueva', icon: <AddIcon />, path: '/admin/advertisements/new' }
      ]
    },
    {
      title: 'Almacenamiento',
      icon: <CampaignIcon />,
      path: '/admin/storage',
      exact: false
    }
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Administración
        </Typography>
        <IconButton onClick={onClose} size="small">
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.title}>
            {item.expandable ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => item.setOpen?.(!item.open)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      mb: 0.5,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.badge ? (
                        <Badge badgeContent={item.badge} color="primary">
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                    {item.open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={item.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subitems?.map((subitem) => (
                      <ListItem key={subitem.path} disablePadding>
                        <ListItemButton
                          onClick={() => handleNavigate(subitem.path)}
                          selected={isActive(subitem.path)}
                          sx={{
                            pl: 4,
                            borderRadius: 2,
                            mx: 1,
                            mb: 0.5,
                            '&.Mui-selected': {
                              backgroundColor: theme.palette.primary.main,
                              color: 'white',
                              '&:hover': {
                                backgroundColor: theme.palette.primary.dark
                              },
                              '& .MuiListItemIcon-root': {
                                color: 'white'
                              }
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {subitem.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={subitem.title}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(item.path!)}
                  selected={item.exact ? location.pathname === item.path : isActive(item.path!)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white'
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Radio Cuenca Cañera 94.5FM
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: 1,
          borderColor: 'divider'
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default AdminSidebar;
