-- ================================================
-- CONFIGURACIÓN DE BASE DE DATOS - RADIO CUENCA
-- ================================================

-- Crear tabla de noticias
CREATE TABLE IF NOT EXISTS public.news (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de banners
CREATE TABLE IF NOT EXISTS public.banners (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    link TEXT,
    position TEXT NOT NULL DEFAULT 'main',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir lectura pública
CREATE POLICY "Permitir lectura pública de noticias" ON public.news
    FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de banners activos" ON public.banners
    FOR SELECT USING (active = true);

-- Crear políticas para administradores (usuarios autenticados)
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en noticias" ON public.news
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en banners" ON public.banners
    FOR ALL USING (auth.role() = 'authenticated');

-- Crear función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para actualizar timestamp automáticamente
CREATE TRIGGER handle_updated_at_news
    BEFORE UPDATE ON public.news
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_banners
    BEFORE UPDATE ON public.banners
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Insertar datos de ejemplo para noticias
INSERT INTO public.news (title, content, publish_date, image_url) VALUES
('Bienvenidos a Radio Cuenca Cañera 94.5FM', 
 'Nos complace anunciar el lanzamiento oficial de nuestro sitio web. Aquí podrás encontrar todas las noticias más importantes de nuestra región, así como acceder a nuestra programación en vivo las 24 horas del día. Estamos comprometidos con brindar la mejor información y entretenimiento para toda la familia.',
 CURRENT_DATE,
 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1000&auto=format&fit=crop'
),
('Nueva programación musical', 
 'A partir de este mes, incorporamos nuevos espacios musicales para todos los gustos. Desde las últimas tendencias hasta los clásicos que nunca pasan de moda. Sintonízanos de lunes a viernes a partir de las 8:00 AM y descubre toda la variedad musical que tenemos preparada para ti.',
 CURRENT_DATE - INTERVAL '1 day',
 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000&auto=format&fit=crop'
),
('Entrevista con artistas locales', 
 'Este sábado tendremos una entrevista especial con los artistas más destacados de nuestra región. No te pierdas esta oportunidad única de conocer más sobre su música, sus proyectos y sus historias de vida. Una cita imperdible para todos los amantes de la música local.',
 CURRENT_DATE - INTERVAL '2 days',
 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000&auto=format&fit=crop'
);

-- Insertar datos de ejemplo para banners
INSERT INTO public.banners (name, description, image_url, link, position, active) VALUES
('Radio Cuenca Cañera 94.5FM', 
 'Tu estación de radio favorita con la mejor programación musical y informativa de la región',
 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1920&auto=format&fit=crop',
 null,
 'main',
 true
),
('Programación en Vivo', 
 'Escúchanos las 24 horas del día con la mejor música y entretenimiento',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&auto=format&fit=crop',
 null,
 'main',
 true
);

-- Verificar que las tablas se crearon correctamente
SELECT 'Tabla news creada: ' || COUNT(*) || ' registros' FROM public.news;
SELECT 'Tabla banners creada: ' || COUNT(*) || ' registros' FROM public.banners; 