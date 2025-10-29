import { createTheme } from '@mui/material';
import type { PaletteMode, ThemeOptions } from '@mui/material';

// Colores personalizados para el tema - ahora con tonos marrones/madera
const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Paleta para modo claro - tonos madera claros
          primary: {
            main: '#8B5A2B', // Marrón madera
            light: '#A67C52',
            dark: '#6F4518',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#D2B48C', // Beige/Tan
            light: '#E6D2B5',
            dark: '#B69B6A',
            contrastText: '#000000',
          },
          background: {
            default: '#F8F4E9', // Beige muy claro
            paper: '#FFFBF0',   // Crema
          },
          text: {
            primary: '#4A3728', // Marrón oscuro
            secondary: '#7D6B5D', // Marrón medio
          },
        }
      : {
          // Paleta para modo oscuro - tonos madera oscuros y fondo negro transparente
          primary: {
            main: '#C19A6B', // Camel/Camello
            light: '#D9BC97',
            dark: '#9A7B55',
            contrastText: '#000000',
          },
          secondary: {
            main: '#AA8062', // Marrón claro
            light: '#C2A48C',
            dark: '#8C6143',
            contrastText: '#000000',
          },
          background: {
            default: '#1a1a1a', // Negro sólido en lugar de transparente
            paper: '#2d2d2d',   // Gris oscuro sólido
          },
          text: {
            primary: '#F0E3CE', // Beige claro
            secondary: '#C7B299', // Beige medio
          },
        }),
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'light' 
            ? '0 4px 12px rgba(139, 90, 43, 0.08)' 
            : '0 4px 12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === 'light' 
              ? '0 10px 20px rgba(139, 90, 43, 0.15)' 
              : '0 10px 20px rgba(0, 0, 0, 0.35)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0 2px 10px rgba(139, 90, 43, 0.1)' 
            : '0 2px 10px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          '@media (min-width:600px)': {
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
      },
    },
  },
});

// Tema por defecto (modo claro)
const theme = createTheme(getDesignTokens('light'));

export { getDesignTokens };
export default theme; 