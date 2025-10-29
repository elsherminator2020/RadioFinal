-- ================================================================
-- RADIO CUENCA CAÑERA 94.5FM - CONFIGURACIÓN COMPLETA DE BASE DE DATOS
-- ================================================================
-- Instrucciones:
-- 1. Ve a tu dashboard de Supabase: https://supabase.com
-- 2. Navega a "SQL Editor" 
-- 3. Crea una "New query"
-- 4. Copia y pega todo este código
-- 5. Presiona "Run" para ejecutar
-- ================================================================

-- Eliminar tablas existentes si las hay (opcional, descomenta si necesitas recrear)
-- DROP TABLE IF EXISTS public.news CASCADE;
-- DROP TABLE IF EXISTS public.banners CASCADE;
-- DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- ================================================================
-- 1. CREAR TABLAS PRINCIPALES
-- ================================================================

-- Tabla de noticias
CREATE TABLE IF NOT EXISTS public.news (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 200),
    content TEXT NOT NULL CHECK (char_length(content) >= 20),
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de banners
CREATE TABLE IF NOT EXISTS public.banners (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 100),
    description TEXT CHECK (description IS NULL OR char_length(description) <= 500),
    image_url TEXT NOT NULL,
    link TEXT,
    position TEXT NOT NULL DEFAULT 'main' CHECK (position IN ('main', 'sidebar', 'footer')),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ================================================================
-- 2. CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- ================================================================

-- Índices para noticias
CREATE INDEX IF NOT EXISTS idx_news_publish_date ON public.news(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON public.news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_title_search ON public.news USING gin(to_tsvector('spanish', title));
CREATE INDEX IF NOT EXISTS idx_news_content_search ON public.news USING gin(to_tsvector('spanish', content));

-- Índices para banners
CREATE INDEX IF NOT EXISTS idx_banners_active ON public.banners(active);
CREATE INDEX IF NOT EXISTS idx_banners_position ON public.banners(position);

-- ================================================================
-- 3. CREAR FUNCIÓN PARA ACTUALIZAR TIMESTAMP AUTOMÁTICAMENTE
-- ================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 4. CREAR TRIGGERS PARA TIMESTAMP AUTOMÁTICO
-- ================================================================

DROP TRIGGER IF EXISTS handle_updated_at_news ON public.news;
CREATE TRIGGER handle_updated_at_news
    BEFORE UPDATE ON public.news
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_banners ON public.banners;
CREATE TRIGGER handle_updated_at_banners
    BEFORE UPDATE ON public.banners
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ================================================================
-- 5. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Habilitar RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Permitir lectura pública de noticias" ON public.news;
DROP POLICY IF EXISTS "Permitir lectura pública de banners activos" ON public.banners;
DROP POLICY IF EXISTS "Permitir todas las operaciones a usuarios autenticados en noticias" ON public.news;
DROP POLICY IF EXISTS "Permitir todas las operaciones a usuarios autenticados en banners" ON public.banners;

-- ================================================================
-- 6. CREAR POLÍTICAS DE SEGURIDAD
-- ================================================================

-- Políticas para NOTICIAS
-- Permitir lectura pública (cualquiera puede ver noticias)
CREATE POLICY "Permitir lectura pública de noticias" 
ON public.news FOR SELECT 
USING (true);

-- Permitir todas las operaciones a usuarios autenticados (administradores)
CREATE POLICY "Permitir operaciones de admin en noticias" 
ON public.news FOR ALL 
USING (auth.role() = 'authenticated');

-- Políticas para BANNERS
-- Permitir lectura pública solo de banners activos
CREATE POLICY "Permitir lectura pública de banners activos" 
ON public.banners FOR SELECT 
USING (active = true);

-- Permitir todas las operaciones a usuarios autenticados (administradores)
CREATE POLICY "Permitir operaciones de admin en banners" 
ON public.banners FOR ALL 
USING (auth.role() = 'authenticated');

-- ================================================================
-- 7. INSERTAR DATOS DE EJEMPLO
-- ================================================================

-- Verificar si ya existen datos antes de insertar
DO $$
BEGIN
    -- Insertar noticias solo si la tabla está vacía
    IF NOT EXISTS (SELECT 1 FROM public.news LIMIT 1) THEN
        INSERT INTO public.news (title, content, publish_date, image_url) VALUES
        ('🎉 Bienvenidos a Radio Cuenca Cañera 94.5FM', 
         'Nos complace anunciar el lanzamiento oficial de nuestro sitio web renovado. Aquí podrás encontrar todas las noticias más importantes de nuestra región, así como acceder a nuestra programación en vivo las 24 horas del día. Estamos comprometidos con brindar la mejor información y entretenimiento para toda la familia. Nuestro equipo de profesionales trabaja incansablemente para ofrecerte contenido de calidad, música variada y programas que conecten con nuestra comunidad. ¡Gracias por acompañarnos en esta nueva etapa!',
         CURRENT_DATE,
         'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1000&auto=format&fit=crop'
        ),
        ('🎵 Nueva programación musical para toda la familia', 
         'A partir de este mes, incorporamos nuevos espacios musicales para todos los gustos y edades. Desde las últimas tendencias del pop y rock hasta los clásicos que nunca pasan de moda, incluyendo folclore nacional, tango, cumbia y música internacional. Sintonízanos de lunes a viernes a partir de las 8:00 AM y descubre toda la variedad musical que tenemos preparada para ti. También contamos con programas especializados los fines de semana con música de los 80s, 90s y el mejor rock nacional.',
         CURRENT_DATE - INTERVAL '1 day',
         'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000&auto=format&fit=crop'
        ),
        ('🎤 Entrevista especial con artistas locales', 
         'Este sábado a las 15:00 hs tendremos una entrevista especial con los artistas más destacados de nuestra región. No te pierdas esta oportunidad única de conocer más sobre su música, sus proyectos futuros y sus historias de vida. Hablaremos con cantantes, músicos y compositores que están marcando tendencia en el panorama musical local. Una cita imperdible para todos los amantes de la música regional y nacional. La entrevista se transmitirá en vivo y podrás participar enviando tus preguntas.',
         CURRENT_DATE - INTERVAL '2 days',
         'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000&auto=format&fit=crop'
        ),
        ('📻 Nuevo horario de noticias locales', 
         'Informamos a todos nuestros oyentes que a partir del próximo lunes implementaremos un nuevo horario para nuestros informativos locales. Las noticias se emitirán a las 7:00, 12:00, 18:00 y 22:00 horas, brindando información actualizada sobre los acontecimientos más importantes de nuestra ciudad y región. Nuestro equipo de periodistas locales se encuentra trabajando para ofrecerte la información más relevante y veraz de la zona.',
         CURRENT_DATE - INTERVAL '3 days',
         'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?q=80&w=1000&auto=format&fit=crop'
        ),
        ('🏆 Radio Cuenca Cañera celebra 25 años al aire', 
         'Con gran alegría celebramos 25 años ininterrumpidos acompañando a nuestra comunidad. Desde 1999, hemos sido la voz de la región, brindando entretenimiento, información y compañía a miles de familias. Durante estas dos décadas y media, hemos sido testigos y protagonistas de los momentos más importantes de nuestra historia local. Agradecemos a todos nuestros oyentes, anunciantes y colaboradores que hicieron posible este sueño. ¡Por muchos años más juntos!',
         CURRENT_DATE - INTERVAL '4 days',
         'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop'
        );
        
        RAISE NOTICE 'Noticias de ejemplo insertadas correctamente';
    ELSE
        RAISE NOTICE 'La tabla news ya contiene datos, saltando inserción';
    END IF;

    -- Insertar banners solo si la tabla está vacía
    IF NOT EXISTS (SELECT 1 FROM public.banners LIMIT 1) THEN
        INSERT INTO public.banners (name, description, image_url, link, position, active) VALUES
        ('Radio Cuenca Cañera 94.5FM - En Vivo', 
         'Tu estación de radio favorita transmitiendo las 24 horas del día con la mejor programación musical, informativa y de entretenimiento para toda la región',
         'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1920&auto=format&fit=crop',
         null,
         'main',
         true
        ),
        ('Programación Musical Variada', 
         'Escúchanos en vivo con la mejor selección musical: pop, rock, folclore, tango, cumbia y música internacional. Algo para cada momento del día',
         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&auto=format&fit=crop',
         null,
         'main',
         true
        ),
        ('Noticias Locales y Regionales', 
         'Mantente informado con nuestros informativos diarios. Noticias locales, regionales y nacionales con la seriedad y veracidad que nos caracterizan',
         'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?q=80&w=1920&auto=format&fit=crop',
         null,
         'main',
         true
        );
        
        RAISE NOTICE 'Banners de ejemplo insertados correctamente';
    ELSE
        RAISE NOTICE 'La tabla banners ya contiene datos, saltando inserción';
    END IF;
END $$;

-- ================================================================
-- 8. CREAR FUNCIONES ÚTILES PARA LA APLICACIÓN
-- ================================================================

-- Función para buscar noticias
CREATE OR REPLACE FUNCTION search_news(search_term TEXT)
RETURNS TABLE(
    id BIGINT,
    title TEXT,
    content TEXT,
    publish_date DATE,
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT n.id, n.title, n.content, n.publish_date, n.image_url, n.video_url, n.created_at, n.updated_at
    FROM public.news n
    WHERE 
        to_tsvector('spanish', n.title || ' ' || n.content) @@ plainto_tsquery('spanish', search_term)
        OR n.title ILIKE '%' || search_term || '%'
        OR n.content ILIKE '%' || search_term || '%'
    ORDER BY n.publish_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_news', (SELECT COUNT(*) FROM public.news),
        'news_with_images', (SELECT COUNT(*) FROM public.news WHERE image_url IS NOT NULL),
        'news_with_videos', (SELECT COUNT(*) FROM public.news WHERE video_url IS NOT NULL),
        'total_banners', (SELECT COUNT(*) FROM public.banners),
        'active_banners', (SELECT COUNT(*) FROM public.banners WHERE active = true),
        'recent_news', (SELECT COUNT(*) FROM public.news WHERE created_at >= NOW() - INTERVAL '7 days')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 9. VERIFICACIÓN FINAL
-- ================================================================

DO $$
DECLARE
    news_count INTEGER;
    banners_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO news_count FROM public.news;
    SELECT COUNT(*) INTO banners_count FROM public.banners;
    
    RAISE NOTICE '================================================';
    RAISE NOTICE 'CONFIGURACIÓN COMPLETADA EXITOSAMENTE';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Tablas creadas: news, banners';
    RAISE NOTICE 'Noticias insertadas: %', news_count;
    RAISE NOTICE 'Banners insertados: %', banners_count;
    RAISE NOTICE 'Índices creados: ✓';
    RAISE NOTICE 'RLS habilitado: ✓';
    RAISE NOTICE 'Políticas de seguridad: ✓';
    RAISE NOTICE 'Funciones útiles: ✓';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Radio Cuenca Cañera 94.5FM - Base de datos lista!';
    RAISE NOTICE '================================================';
END $$;

-- ================================================================
-- FIN DEL SCRIPT
-- ================================================================ 