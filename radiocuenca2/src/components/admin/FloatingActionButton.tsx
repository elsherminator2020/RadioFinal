import React, { useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import {
  Add as AddIcon,
  Article as ArticleIcon,
  Radio as RadioIcon,
  Campaign as CampaignIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const FloatingActionButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const actions = [
    { 
      icon: <ArticleIcon />, 
      name: 'Nueva Noticia', 
      action: () => navigate('/admin/news/new'),
      color: 'primary'
    },
    { 
      icon: <RadioIcon />, 
      name: 'Nuevo Programa', 
      action: () => navigate('/admin/programming/new'),
      color: 'success'
    },
    { 
      icon: <CampaignIcon />, 
      name: 'Nueva Publicidad', 
      action: () => navigate('/admin/advertisements/new'),
      color: 'warning'
    },
  ];

  const handleAction = (actionFn: () => void) => {
    actionFn();
    setOpen(false);
  };

  if (!location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <SpeedDial
      ariaLabel="Acciones rápidas"
      sx={{ 
        position: 'fixed', 
        bottom: 24, 
        right: 24,
        '& .MuiSpeedDial-fab': {
          width: 56,
          height: 56
        }
      }}
      icon={<SpeedDialIcon icon={<AddIcon />} openIcon={<CloseIcon />} />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={() => handleAction(action.action)}
          sx={{
            '& .MuiSpeedDialAction-staticTooltipLabel': {
              whiteSpace: 'nowrap',
              fontWeight: 500
            }
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default FloatingActionButton;
