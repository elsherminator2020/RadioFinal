import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Paper, Typography, Alert, Stack, Chip, Divider } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { checkProgrammingBucket, createProgrammingBucket, getManualPolicySql, STORAGE_DASHBOARD_URL } from '../../services/storageService';

const StorageSetupPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bucketExists, setBucketExists] = useState<boolean>(false);
  const [buckets, setBuckets] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const status = await checkProgrammingBucket();
      setBucketExists(status.bucketExists);
      setBuckets([]);
    } catch (e: any) {
      setError(e.message || 'Error verificando el almacenamiento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAutoConfigure = async () => {
    setError(null);
    setSuccessMsg(null);
    try {
      await createProgrammingBucket();
      setSuccessMsg('Bucket creado correctamente.');
      await refresh();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const policySql = getManualPolicySql();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={800}>Configuración de Almacenamiento</Typography>

          {!bucketExists ? (
            <Alert severity="warning" variant="outlined">
              Se usará el bucket general 'images' con la carpeta 'programs/'. Si no existe, créalo como público y aplica las políticas de la sección inferior.
            </Alert>
          ) : (
            <Alert severity="success" variant="outlined">
              El bucket 'images' está disponible. Las imágenes de programas se guardarán en 'programs/'.
            </Alert>
          )}

          {error && <Alert severity="error">{error}</Alert>}
          {successMsg && <Alert severity="success">{successMsg}</Alert>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" onClick={handleAutoConfigure} disabled={loading}>
              Configurar automáticamente
            </Button>
            <Button variant="outlined" href={STORAGE_DASHBOARD_URL} target="_blank" rel="noreferrer">
              Abrir Supabase Dashboard
            </Button>
            <Button variant="text" onClick={refresh} disabled={loading}>Reintentar</Button>
          </Stack>

          <Divider />

          <Typography variant="subtitle1" fontWeight={700}>Buckets existentes</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {buckets.map((b) => (
              <Chip key={b} label={b} color={b === 'programming-images' ? 'primary' : 'default'} />
            ))}
            {buckets.length === 0 && <Typography variant="body2" color="text.secondary">(vacío)</Typography>}
          </Stack>

          {!bucketExists && (
            <>
              <Divider />
              <Typography variant="subtitle1" fontWeight={700}>Configuración manual (SQL)</Typography>
              <Typography variant="body2" color="text.secondary">
                Si la configuración automática falla, use estas políticas en Storage → Policies del dashboard.
              </Typography>
              <Box component="pre" sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, overflow: 'auto', border: '1px dashed', borderColor: 'divider' }}>
{policySql}
              </Box>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default StorageSetupPage;


