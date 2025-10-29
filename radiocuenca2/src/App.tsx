import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeColorProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Lazy loading de las páginas para mejorar el rendimiento
const HomePage = lazy(() => import('./pages/HomePage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const ProgrammingPage = lazy(() => import('./pages/ProgrammingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const NewsEditorPage = lazy(() => import('./pages/admin/NewsEditorPage'));
const NewsManagementPage = lazy(() => import('./pages/admin/NewsManagementPage'));
const NewsViewPage = lazy(() => import('./pages/NewsViewPage'));
const ProgrammingManagementPage = lazy(() => import('./pages/admin/ProgrammingManagementPage'));
const ProgrammingEditorPage = lazy(() => import('./pages/admin/ProgrammingEditorPage'));
const AdvertisementManagementPage = lazy(() => import('./pages/admin/AdvertisementManagementPage'));
const AdvertisementEditorPage = lazy(() => import('./pages/admin/AdvertisementEditorPage'));
const StorageSetupPage = lazy(() => import('./pages/admin/StorageSetupPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Componente de carga
const LoadingFallback = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100%'
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ThemeColorProvider>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <Router>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Rutas públicas */}
                            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/noticias" element={<Layout><NewsPage /></Layout>} />
            <Route path="/noticias/:id" element={<Layout><NewsViewPage /></Layout>} />
            <Route path="/programacion" element={<Layout><ProgrammingPage /></Layout>} />
            <Route path="/quienes-somos" element={<Layout><AboutUsPage /></Layout>} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Rutas de administración */}
                <Route path="/admin" element={<Layout><AdminLayout><DashboardPage /></AdminLayout></Layout>} />
                <Route path="/admin/news" element={<Layout><AdminLayout><NewsManagementPage /></AdminLayout></Layout>} />
                <Route path="/admin/news/new" element={<Layout><AdminLayout><NewsEditorPage /></AdminLayout></Layout>} />
                <Route path="/admin/news/edit/:id" element={<Layout><AdminLayout><NewsEditorPage isEdit={true} /></AdminLayout></Layout>} />
                <Route path="/admin/programming" element={<Layout><AdminLayout><ProgrammingManagementPage /></AdminLayout></Layout>} />
                <Route path="/admin/programming/new" element={<Layout><AdminLayout><ProgrammingEditorPage /></AdminLayout></Layout>} />
                <Route path="/admin/programming/edit/:id" element={<Layout><AdminLayout><ProgrammingEditorPage isEdit={true} /></AdminLayout></Layout>} />
                <Route path="/admin/advertisements" element={<Layout><AdminLayout><AdvertisementManagementPage /></AdminLayout></Layout>} />
                <Route path="/admin/advertisements/new" element={<Layout><AdminLayout><AdvertisementEditorPage /></AdminLayout></Layout>} />
                <Route path="/admin/advertisements/edit/:id" element={<Layout><AdminLayout><AdvertisementEditorPage isEdit={true} /></AdminLayout></Layout>} />
                <Route path="/admin/storage" element={<Layout><AdminLayout><StorageSetupPage /></AdminLayout></Layout>} />
                
                {/* Ruta para página no encontrada */}
                <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
              </Routes>
            </Suspense>
          </Box>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeColorProvider>
  );
}

export default App;
