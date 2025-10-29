import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, CircularProgress, Alert } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import ProgrammingForm from '../../components/admin/ProgrammingForm';
import { getProgramById } from '../../services/programmingService';
import type { Program } from '../../services/programmingService';

interface ProgrammingEditorPageProps {
  isEdit?: boolean;
}

const ProgrammingEditorPage: React.FC<ProgrammingEditorPageProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      if (isEdit && id) {
        try {
          setLoading(true);
          const programData = await getProgramById(parseInt(id));
          setProgram(programData);
        } catch (err: any) {
          console.error('Error fetching program:', err);
          setError('Error al cargar el programa');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProgram();
  }, [isEdit, id]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ py: 4 }}>
          <Button 
            startIcon={<ArrowBack />} 
            component={Link} 
            to="/admin/programming"
            sx={{ mb: 3 }}
          >
            Volver a Programación
          </Button>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          component={Link} 
          to="/admin/programming"
          sx={{ mb: 3 }}
        >
          Volver a Programación
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          {isEdit ? 'Editar Programa' : 'Crear Programa'}
        </Typography>
        
        {isEdit && program && (
          <Typography color="text.secondary" gutterBottom>
            Editando: {program.program_name}
          </Typography>
        )}
        
        <ProgrammingForm initialData={program || undefined} isEdit={isEdit} />
      </Box>
    </Container>
  );
};

export default ProgrammingEditorPage; 