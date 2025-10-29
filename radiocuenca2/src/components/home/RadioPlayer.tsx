import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  Slider, 
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Stack,
  LinearProgress,
  Tooltip,
  Fade,
  Slide,
  Collapse
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  VolumeUp, 
  VolumeOff,
  Radio,
  GraphicEq,
  Wifi as SignalIcon,
  Refresh,
  ErrorOutline,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';

// URLs del stream de radio con diferentes rutas posibles
const RADIO_URLS = [
  'http://server2.veemesoft.com.ar:12504/stream',
  'http://server2.veemesoft.com.ar:12504/listen',
  'http://server2.veemesoft.com.ar:12504/',
  'http://server2.veemesoft.com.ar:12504/radio.mp3',
  'http://server2.veemesoft.com.ar:12504/stream.mp3',
  'http://server2.veemesoft.com.ar:12504/live'
];

// Variable global para el índice de URL (se resetea en cada instancia)
let currentUrlIndex = 0;
let globalInstanceId = 0;

interface RadioPlayerProps {
  isMinimized?: boolean;
}

const RadioPlayer: React.FC<RadioPlayerProps> = ({ isMinimized = false }) => {
  // ID único para esta instancia
  const instanceId = useRef<number>(++globalInstanceId);
  
  // Estados principales
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(60);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Desconectado');
  const [retryCount, setRetryCount] = useState<number>(0);
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(32));
  
  // Estados para el diseño minimalista (mantenidos para compatibilidad interna)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  // Referencias
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Función para limpiar recursos
  const cleanup = useCallback(() => {
    const id = instanceId.current;
    console.log(`🧹 [Instancia ${id}] Limpiando reproductor...`);
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.warn(`⚠️ [Instancia ${id}] Error cerrando audio context:`, e);
      }
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    
    if (audioRef.current) {
      const audio = audioRef.current;
      try {
        audio.pause();
        audio.src = '';
        audio.removeAttribute('src');
        audio.load();
        
        if (audio.parentNode) {
          audio.parentNode.removeChild(audio);
        }
      } catch (e) {
        console.warn(`⚠️ [Instancia ${id}] Error limpiando audio:`, e);
      }
      
      audioRef.current = null;
    }
    
    currentUrlIndex = 0;
    console.log(`✅ [Instancia ${id}] Cleanup completado`);
  }, []);

  // Función para mostrar errores
  const showErrorMessage = useCallback((message: string) => {
    console.error('❌ Error en reproductor:', message);
    setError(message);
    setShowError(true);
    setConnectionStatus('Error de conexión');
    setIsLoading(false);
  }, []);

  // Función para obtener mensaje de error descriptivo
  const getAudioErrorMessage = (error: MediaError | null): string => {
    if (!error) return 'Error desconocido';
    
    switch (error.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        return 'Reproducción cancelada';
      case MediaError.MEDIA_ERR_NETWORK:
        return 'Error de red';
      case MediaError.MEDIA_ERR_DECODE:
        return 'Error de decodificación';
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        return 'Stream no soportado';
      default:
        return `Error ${error.code}`;
    }
  };

  const updateAudioData = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    setAudioData(dataArray);

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateAudioData);
    }
  }, [isPlaying]);

  // Función para inicializar visualizador
  const initializeVisualizer = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioRef.current);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      updateAudioData();
    } catch (e) {
      console.warn('⚠️ No se pudo inicializar el visualizador de audio:', e);
    }
  }, [updateAudioData]);

  // Función para crear elemento de audio
  const createAudioElement = useCallback(() => {
    const id = instanceId.current;
    console.log(`🎵 [Instancia ${id}] Creando nuevo elemento de audio...`);
    
    if (audioRef.current) {
      const oldAudio = audioRef.current;
      try {
        oldAudio.pause();
        oldAudio.src = '';
        oldAudio.load();
      } catch (e) {
        console.warn(`⚠️ [Instancia ${id}] Error limpiando audio anterior:`, e);
      }
      audioRef.current = null;
    }

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'none';
    audio.volume = (volume / 100) * (isMuted ? 0 : 1);
    audio.setAttribute('data-instance-id', id.toString());

    // Event listeners para manejo de estados
    audio.addEventListener('loadstart', () => {
      const currentUrl = RADIO_URLS[currentUrlIndex];
      console.log(`📡 [Instancia ${id}] Iniciando carga del stream: ${currentUrl}`);
      setIsLoading(true);
      setConnectionStatus(`Conectando...`);
      setError(null);
    });

    audio.addEventListener('canplay', () => {
      console.log('✅ Stream listo para reproducir');
      setIsLoading(false);
      setConnectionStatus('EN VIVO');
      setRetryCount(0);
    });

    audio.addEventListener('playing', () => {
      console.log('▶️ Reproduciendo stream');
      setIsPlaying(true);
      setIsLoading(false);
      setConnectionStatus('EN VIVO');
      
      // Inicializar visualizador de manera segura
      setTimeout(() => {
        if (audioRef.current && !audioContextRef.current) {
          try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioContext.createMediaElementSource(audioRef.current);
            const analyser = audioContext.createAnalyser();
            
            analyser.fftSize = 64;
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            
            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            
            updateAudioData();
          } catch (e) {
            console.warn('⚠️ No se pudo inicializar el visualizador de audio:', e);
          }
        }
      }, 100);
    });

    audio.addEventListener('pause', () => {
      console.log('⏸️ Stream pausado');
      setIsPlaying(false);
      setConnectionStatus('Pausado');
    });

    audio.addEventListener('error', (e) => {
      const error = audio.error;
      const currentUrl = RADIO_URLS[currentUrlIndex];
      const errorMessage = getAudioErrorMessage(error);
      
      console.error(`❌ Error en stream ${currentUrl}:`, errorMessage, error);
      
      if (currentUrlIndex < RADIO_URLS.length - 1) {
        currentUrlIndex++;
        console.log(`🔄 Intentando con siguiente URL: ${RADIO_URLS[currentUrlIndex]}`);
        setTimeout(() => {
          const newAudio = createAudioElement();
          newAudio.src = RADIO_URLS[currentUrlIndex];
          newAudio.play().catch(console.error);
        }, 1000);
      } else {
        showErrorMessage(`Error de conexión: ${errorMessage}`);
        setRetryCount(prev => prev + 1);
        
        if (retryCount < 2) {
          console.log(`🔄 Reintentando conexión completa en 3 segundos... (intento ${retryCount + 1}/2)`);
          retryTimeoutRef.current = setTimeout(() => {
            currentUrlIndex = 0;
            const newAudio = createAudioElement();
            newAudio.src = RADIO_URLS[currentUrlIndex];
            newAudio.play().catch(console.error);
          }, 3000);
        }
      }
    });

    audioRef.current = audio;
    return audio;
  }, [volume, isMuted, retryCount, updateAudioData]);

  const playStream = useCallback(async () => {
    console.log('📻 Iniciando playStream...');
    
    try {
      const audio = createAudioElement();
      const url = RADIO_URLS[currentUrlIndex];
      
      console.log(`📻 Cargando stream: ${url}`);
      audio.src = url;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (error) {
      console.error('❌ Error al reproducir:', error);
      showErrorMessage('No se pudo iniciar la reproducción');
    }
  }, [createAudioElement, showErrorMessage]);

  const handlePlayPause = useCallback(async () => {
    console.log('🎛️ HandlePlayPause clicked! isPlaying:', isPlaying);
    
    try {
      if (!audioRef.current) {
        console.log('📻 No audio element, creating new stream...');
        await playStream();
        return;
      }

      if (isPlaying) {
        console.log('⏸️ Pausing stream...');
        audioRef.current.pause();
      } else {
        console.log('▶️ Resuming/starting stream...');
        if (audioRef.current.src) {
          await audioRef.current.play();
        } else {
          await playStream();
        }
      }
    } catch (error) {
      console.error('❌ Error en play/pause:', error);
      showErrorMessage('Error al controlar la reproducción');
    }
  }, [isPlaying, playStream, showErrorMessage]);

  const handleVolumeChange = useCallback((event: Event, newValue: number | number[]) => {
    const volume = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(volume);
    
    if (audioRef.current) {
      audioRef.current.volume = (volume / 100) * (isMuted ? 0 : 1);
    }
  }, [isMuted]);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      if (audioRef.current) {
        audioRef.current.volume = newMuted ? 0 : volume / 100;
      }
      return newMuted;
    });
  }, [volume]);

  const handleRefresh = useCallback(() => {
    console.log('🔄 Refrescando reproductor...');
    
    setError(null);
    setShowError(false);
    setRetryCount(0);
    currentUrlIndex = 0;
    
    if (audioRef.current) {
      cleanup();
    }
    
    setTimeout(() => {
      if (isPlaying) {
        playStream();
      }
    }, 500);
  }, [cleanup, isPlaying, playStream]);

  const handleCloseError = useCallback(() => {
    setShowError(false);
  }, []);

  // Efecto de limpieza simplificado
  useEffect(() => {
    const id = instanceId.current;
    console.log(`🎛️ [Instancia ${id}] Inicializando reproductor...`);

    const handleBeforeUnload = () => {
      console.log(`🔄 [Instancia ${id}] Página cerrándose, limpiando...`);
      // Cleanup directo sin función
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch (e) {
          console.warn(`⚠️ Error cerrando audio context:`, e);
        }
        audioContextRef.current = null;
      }
      
      if (audioRef.current) {
        const audio = audioRef.current;
        try {
          audio.pause();
          audio.src = '';
          audio.removeAttribute('src');
          audio.load();
        } catch (e) {
          console.warn(`⚠️ Error limpiando audio:`, e);
        }
        audioRef.current = null;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Cleanup directo al desmontar
      console.log('🗑️ Componente desmontándose, ejecutando cleanup...');
      cleanup();
    };
  }, []); // Sin dependencias para evitar re-ejecuciones

  // Componente de visualizador minimalista
  const MiniVisualizer: React.FC = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        height: 16,
        mr: 1
      }}
    >
      {Array.from(audioData.slice(0, 5)).map((value, index) => (
        <Box
          key={index}
          sx={{
            width: 2,
            height: `${Math.max(4, (value / 255) * 100)}%`,
            backgroundColor: isPlaying 
              ? (isDark ? '#C19A6B' : '#8B5A2B')
              : 'rgba(139, 90, 43, 0.3)',
            borderRadius: 1,
            transition: 'height 0.1s ease',
            minHeight: 2,
            opacity: isPlaying ? 1 : 0.5
          }}
        />
      ))}
    </Box>
  );

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      py: isMinimized ? 1 : 2,
      px: 2
    }}>
      {/* Barra de progreso */}
      {isLoading && (
        <LinearProgress 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            '& .MuiLinearProgress-bar': {
              backgroundColor: isDark ? '#C19A6B' : '#8B5A2B'
            }
          }}
        />
      )}

      {/* Reproductor principal */}
      <Box
        sx={{
          backgroundColor: isDark 
            ? 'rgba(60, 42, 30, 0.9)'
            : 'rgba(245, 238, 224, 0.9)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${isDark ? 'rgba(193, 154, 107, 0.3)' : 'rgba(139, 90, 43, 0.2)'}`,
          borderRadius: isMinimized ? 20 : 25,
          px: isMinimized ? 2 : 3,
          py: isMinimized ? 1 : 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: isMinimized ? 1 : 2,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          width: 'fit-content',
          maxWidth: '100%'
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: isMinimized ? 24 : 32,
            height: isMinimized ? 24 : 32,
            borderRadius: '50%',
            backgroundColor: isDark ? '#C19A6B' : '#8B5A2B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          <Radio sx={{ fontSize: isMinimized ? 14 : 18 }} />
        </Box>

        {/* Título */}
        {!isMinimized && (
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600,
              color: isDark ? '#F0E3CE' : '#4A3728',
              fontSize: '0.9rem',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            FM Cuenca Cañera 94.5
          </Typography>
        )}

        {/* Botón de play/pause */}
        <IconButton
          onClick={handlePlayPause}
          disabled={isLoading}
          size="small"
          sx={{
            width: isMinimized ? 28 : 36,
            height: isMinimized ? 28 : 36,
            backgroundColor: isDark ? '#C19A6B' : '#8B5A2B',
            color: 'white',
            '&:hover': { 
              backgroundColor: isDark ? '#AA8062' : '#6B4226',
              transform: 'scale(1.05)'
            },
            '&:disabled': {
              backgroundColor: theme.palette.grey[400],
              color: theme.palette.grey[600]
            }
          }}
        >
          {isLoading ? (
            <CircularProgress size={isMinimized ? 12 : 16} sx={{ color: 'white' }} />
          ) : isPlaying ? (
            <Pause sx={{ fontSize: isMinimized ? 14 : 18 }} />
          ) : (
            <PlayArrow sx={{ fontSize: isMinimized ? 14 : 18 }} />
          )}
        </IconButton>

        {/* Visualizador */}
        {isPlaying && !isMinimized && (
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <MiniVisualizer />
          </Box>
        )}

        {/* Status chip */}
        <Chip
          icon={
            connectionStatus.includes('EN VIVO') ? <GraphicEq sx={{ fontSize: 8 }} /> :
            isLoading ? <CircularProgress size={6} sx={{ color: 'inherit' }} /> :
            error ? <ErrorOutline sx={{ fontSize: 8 }} /> :
            <SignalIcon sx={{ fontSize: 8 }} />
          }
          label={connectionStatus}
          size="small"
          variant={connectionStatus.includes('EN VIVO') ? 'filled' : 'outlined'}
          color={
            connectionStatus.includes('EN VIVO') ? 'success' : 
            error ? 'error' : 
            'default'
          }
          sx={{ 
            fontSize: isMinimized ? '0.6rem' : '0.7rem',
            height: isMinimized ? 18 : 22,
            '& .MuiChip-label': { px: 0.5 }
          }}
        />

        {/* Control de volumen */}
        {!isMinimized && (
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 0.5, ml: 1 }}>
            <IconButton 
              size="small"
              onClick={handleMuteToggle}
              sx={{
                width: 24,
                height: 24,
                color: isDark ? '#C19A6B' : '#8B5A2B'
              }}
            >
              {isMuted || volume === 0 ? <VolumeOff sx={{ fontSize: 16 }} /> : <VolumeUp sx={{ fontSize: 16 }} />}
            </IconButton>
            <Slider
              size="small"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              sx={{
                width: 80,
                color: isDark ? '#C19A6B' : '#8B5A2B',
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12
                }
              }}
            />
          </Box>
        )}

        {/* Botón de refresh si hay error */}
        {error && (
          <IconButton
            size="small"
            onClick={handleRefresh}
            sx={{
              width: isMinimized ? 20 : 24,
              height: isMinimized ? 20 : 24,
              color: isDark ? '#C19A6B' : '#8B5A2B',
              '&:hover': { transform: 'rotate(180deg)' }
            }}
          >
            <Refresh sx={{ fontSize: isMinimized ? 12 : 14 }} />
          </IconButton>
        )}
      </Box>

      {/* Snackbar para errores */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ width: '100%' }}
          action={
            <Tooltip title="Reconectar" arrow>
              <IconButton
                size="small"
                onClick={handleRefresh}
                sx={{ color: 'inherit' }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          }
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RadioPlayer; 