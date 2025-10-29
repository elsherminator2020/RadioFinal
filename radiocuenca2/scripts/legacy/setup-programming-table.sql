-- ================================================================
-- RADIO CUENCA CAÑERA 94.5FM - TABLA DE PROGRAMACIÓN
-- ================================================================
-- Instrucciones:
-- 1. Ve a tu dashboard de Supabase: https://supabase.com
-- 2. Navega a "SQL Editor" 
-- 3. Crea una "New query"
-- 4. Copia y pega todo este código
-- 5. Presiona "Run" para ejecutar
-- ================================================================

-- ================================================================
-- 1. CREAR TABLA DE PROGRAMACIÓN
-- ================================================================

-- Tabla de programación
CREATE TABLE IF NOT EXISTS public.programming (
    id BIGSERIAL PRIMARY KEY,
    program_name TEXT NOT NULL CHECK (char_length(program_name) >= 3 AND char_length(program_name) <= 100),
    description TEXT NOT NULL CHECK (char_length(description) >= 10 AND char_length(description) <= 500),
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo', 'lunes-viernes', 'sabados', 'domingos')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    program_type TEXT NOT NULL DEFAULT 'music' CHECK (program_type IN ('music', 'news', 'talk', 'sports', 'variety')),
    host_name TEXT CHECK (char_length(host_name) <= 100),
    image_url TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT check_time_order CHECK (start_time < end_time)
);

-- ================================================================
-- 2. CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- ================================================================

-- Índices para programación
CREATE INDEX IF NOT EXISTS idx_programming_day_of_week ON public.programming(day_of_week);
CREATE INDEX IF NOT EXISTS idx_programming_active ON public.programming(active);
CREATE INDEX IF NOT EXISTS idx_programming_type ON public.programming(program_type);
CREATE INDEX IF NOT EXISTS idx_programming_time ON public.programming(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_programming_search ON public.programming USING gin(to_tsvector('spanish', program_name || ' ' || description));

-- ================================================================
-- 3. CREAR TRIGGER PARA TIMESTAMP AUTOMÁTICO
-- ================================================================

-- Trigger para actualizar timestamp automáticamente
CREATE TRIGGER handle_updated_at_programming
    BEFORE UPDATE ON public.programming
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- ================================================================
-- 4. CONFIGURAR POLÍTICAS DE SEGURIDAD (RLS)
-- ================================================================

-- Habilitar RLS
ALTER TABLE public.programming ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (solo programas activos)
CREATE POLICY "Permitir lectura pública de programación activa" 
ON public.programming FOR SELECT 
USING (active = true);

-- Política para administradores (usuarios autenticados)
CREATE POLICY "Permitir operaciones de admin en programación" 
ON public.programming FOR ALL 
USING (auth.role() = 'authenticated');

-- ================================================================
-- 5. INSERTAR DATOS DE EJEMPLO
-- ================================================================

-- Verificar si ya existen datos antes de insertar
DO $$
BEGIN
    -- Insertar programación solo si la tabla está vacía
    IF NOT EXISTS (SELECT 1 FROM public.programming LIMIT 1) THEN
        INSERT INTO public.programming (program_name, description, day_of_week, start_time, end_time, program_type, host_name, active) VALUES
        ('Despertar Cañero', 'Comenzá tu día con la mejor música y las noticias más importantes para arrancar con energía.', 'lunes-viernes', '06:00:00', '08:00:00', 'music', 'Equipo Matutino', true),
        ('Noticiero Matutino', 'Informate con las últimas noticias locales, nacionales e internacionales. Tu fuente confiable de información.', 'lunes-viernes', '08:00:00', '10:00:00', 'news', 'Periodistas Radio Cuenca', true),
        ('Música Variada', 'Los mejores éxitos de todos los tiempos para acompañar tu mañana de trabajo.', 'lunes-viernes', '10:00:00', '12:00:00', 'music', null, true),
        ('Mediodía Informativo', 'Noticias al mediodía y música para el almuerzo. Mantente informado a la hora del almuerzo.', 'lunes-viernes', '12:00:00', '14:00:00', 'news', 'Equipo Informativo', true),
        ('Tarde Musical', 'La mejor selección musical para tu tarde. Música para todos los gustos y edades.', 'lunes-viernes', '14:00:00', '16:00:00', 'music', null, true),
        ('Conversa Cañera', 'Espacio de diálogo con la comunidad y temas de interés general. Tu voz importa.', 'lunes-viernes', '16:00:00', '18:00:00', 'talk', 'Mesa de Debate', true),
        ('Noticiero Vespertino', 'Resumen del día y las noticias más relevantes. Cierre informativo del día.', 'lunes-viernes', '18:00:00', '20:00:00', 'news', 'Periodistas Radio Cuenca', true),
        ('Noche Musical', 'Música relajante para acompañar tu noche. El mejor ambiente para terminar el día.', 'lunes-viernes', '20:00:00', '22:00:00', 'music', null, true),
        ('Sábado Deportivo', 'Todo sobre deportes locales y regionales. Fútbol, básquet y todos los deportes de la zona.', 'sabados', '08:00:00', '10:00:00', 'sports', 'Equipo Deportivo', true),
        ('Folklore y Tradición', 'La música tradicional de nuestra región. Rescatando nuestras raíces musicales.', 'sabados', '10:00:00', '12:00:00', 'music', 'Especialista en Folklore', true),
        ('Varieté Sabatino', 'Entretenimiento y música variada para el fin de semana. Diversión garantizada.', 'sabados', '12:00:00', '14:00:00', 'variety', 'Animadores Weekend', true),
        ('Tarde de Sábado', 'Música, entretenimiento y participación de la audiencia. Tu programa de los sábados.', 'sabados', '14:00:00', '17:00:00', 'variety', 'Conductores de Tarde', true),
        ('Domingo Familiar', 'Programación especial para toda la familia. Música y entretenimiento para grandes y chicos.', 'domingos', '09:00:00', '11:00:00', 'variety', 'Familia Radio Cuenca', true),
        ('Música Clásica', 'Lo mejor de la música clásica y melódica. Para los amantes de la buena música.', 'domingos', '11:00:00', '13:00:00', 'music', null, true),
        ('Almuerzo Dominical', 'Música suave para acompañar el almuerzo familiar. El mejor ambiente para el domingo.', 'domingos', '13:00:00', '15:00:00', 'music', null, true),
        ('Recuerdos Musicales', 'Los grandes éxitos de décadas pasadas. Un viaje por la historia de la música.', 'domingos', '15:00:00', '17:00:00', 'music', 'Especialista en Clásicos', true);
        
        RAISE NOTICE 'Programación de ejemplo insertada correctamente';
    ELSE
        RAISE NOTICE 'La tabla programming ya contiene datos, saltando inserción';
    END IF;
END $$;

-- ================================================================
-- 6. CREAR FUNCIONES ÚTILES PARA LA APLICACIÓN
-- ================================================================

-- Función para buscar programas
CREATE OR REPLACE FUNCTION search_programming(search_term TEXT)
RETURNS TABLE(
    id BIGINT,
    program_name TEXT,
    description TEXT,
    day_of_week TEXT,
    start_time TIME,
    end_time TIME,
    program_type TEXT,
    host_name TEXT,
    image_url TEXT,
    active BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.program_name, p.description, p.day_of_week, p.start_time, p.end_time, 
           p.program_type, p.host_name, p.image_url, p.active, p.created_at, p.updated_at
    FROM public.programming p
    WHERE 
        to_tsvector('spanish', p.program_name || ' ' || p.description) @@ plainto_tsquery('spanish', search_term)
        OR p.program_name ILIKE '%' || search_term || '%'
        OR p.description ILIKE '%' || search_term || '%'
        OR p.host_name ILIKE '%' || search_term || '%'
    ORDER BY p.day_of_week, p.start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener programación por día
CREATE OR REPLACE FUNCTION get_programming_by_day(day_name TEXT)
RETURNS TABLE(
    id BIGINT,
    program_name TEXT,
    description TEXT,
    day_of_week TEXT,
    start_time TIME,
    end_time TIME,
    program_type TEXT,
    host_name TEXT,
    image_url TEXT,
    active BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.program_name, p.description, p.day_of_week, p.start_time, p.end_time, 
           p.program_type, p.host_name, p.image_url, p.active, p.created_at, p.updated_at
    FROM public.programming p
    WHERE p.day_of_week = day_name AND p.active = true
    ORDER BY p.start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 7. VERIFICACIÓN FINAL
-- ================================================================

DO $$
DECLARE
    programming_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO programming_count FROM public.programming;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'CONFIGURACIÓN DE PROGRAMACIÓN COMPLETADA';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tabla programming: CREADA ✓';
    RAISE NOTICE 'Políticas RLS: CONFIGURADAS ✓';
    RAISE NOTICE 'Índices: CREADOS ✓';
    RAISE NOTICE 'Triggers: CONFIGURADOS ✓';
    RAISE NOTICE 'Funciones: CREADAS ✓';
    RAISE NOTICE 'Programas insertados: % ✓', programming_count;
    RAISE NOTICE '========================================';
    RAISE NOTICE 'La tabla de programación está lista para usar';
    RAISE NOTICE '========================================';
END $$; 