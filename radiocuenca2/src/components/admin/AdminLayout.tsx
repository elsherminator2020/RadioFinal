import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme, useMediaQuery, Toolbar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';
import AdminBreadcrumbs from './AdminBreadcrumbs';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [stats] = useState({
    totalNews: 0,
    totalPrograms: 0,
    totalAds: 0
  });
  
  // TODO: Conectar con estadísticas reales
  // const loadStats = async () => {
  //   const newsCount = await getNewsCount();
  //   const programsCount = await getProgramsCount();
  //   const adsCount = await getAdsCount();
  //   setStats({ totalNews: newsCount, totalPrograms: programsCount, totalAds: adsCount });
  // };

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const drawerWidth = 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        stats={stats}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { md: sidebarOpen ? 0 : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {!sidebarOpen && (
          <Toolbar sx={{ mb: 2, p: 0 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setSidebarOpen(true)}
              edge="start"
              sx={{ 
                mr: 2,
                border: 1,
                borderColor: 'divider'
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        )}
        
        <AdminBreadcrumbs />
        
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
