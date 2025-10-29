-- Script para crear la tabla de publicidades en Supabase
-- Ejecutar en Supabase Dashboard > SQL Editor

-- Crear la tabla de publicidades
CREATE TABLE IF NOT EXISTS advertisements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position VARCHAR(50) NOT NULL CHECK (position IN ('header', 'sidebar', 'footer', 'content', 'popup')),
  size VARCHAR(50) NOT NULL CHECK (size IN ('small', 'medium', 'large', 'banner')),
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  click_count INTEGER NOT NULL DEFAULT 0,
  impression_count INTEGER NOT NULL DEFAULT 0,
  advertiser_name VARCHAR(255),
  advertiser_email VARCHAR(255),
  advertiser_phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_advertisements_position ON advertisements(position);
CREATE INDEX IF NOT EXISTS idx_advertisements_active ON advertisements(active);
CREATE INDEX IF NOT EXISTS idx_advertisements_priority ON advertisements(priority DESC);
CREATE INDEX IF NOT EXISTS idx_advertisements_dates ON advertisements(start_date, end_date);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_advertisements_updated_at ON advertisements;
CREATE TRIGGER update_advertisements_updated_at
    BEFORE UPDATE ON advertisements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS para permitir acceso público de lectura
CREATE POLICY "Allow public read access to active advertisements" ON advertisements
    FOR SELECT USING (active = true);

-- Crear políticas RLS para usuarios autenticados
CREATE POLICY "Allow authenticated users to manage advertisements" ON advertisements
    FOR ALL USING (auth.role() = 'authenticated');

-- Crear políticas RLS para administradores (si tienes un sistema de roles)
-- CREATE POLICY "Allow admin full access to advertisements" ON advertisements
--     FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insertar datos de ejemplo (opcional)
INSERT INTO advertisements (
  title, 
  description, 
  image_url, 
  link_url, 
  position, 
  size, 
  priority, 
  active,
  advertiser_name,
  advertiser_email
) VALUES 
(
  'Publicidad de Ejemplo',
  'Esta es una publicidad de ejemplo para mostrar cómo funciona el sistema',
  'https://via.placeholder.com/300x200/8B5A2B/FFFFFF?text=Publicidad+Ejemplo',
  'https://example.com',
  'sidebar',
  'medium',
  7,
  true,
  'Empresa Ejemplo',
  'contacto@ejemplo.com'
),
(
  'Banner Principal',
  'Banner promocional para la página principal',
  'https://via.placeholder.com/800x120/667eea/FFFFFF?text=Banner+Principal',
  'https://radiocuenca.com',
  'header',
  'banner',
  9,
  true,
  'Radio Cuenca',
  'info@radiocuenca.com'
),
(
  'Publicidad Lateral',
  'Anuncio para la barra lateral',
  'https://via.placeholder.com/250x300/764ba2/FFFFFF?text=Lateral',
  'https://sponsor.com',
  'sidebar',
  'small',
  5,
  true,
  'Patrocinador',
  'sponsor@example.com'
);

-- Verificar que la tabla se creó correctamente
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'advertisements' 
ORDER BY ordinal_position;

-- Verificar las políticas RLS
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'advertisements';

-- Mostrar los datos de ejemplo insertados
SELECT * FROM advertisements ORDER BY priority DESC, created_at DESC;


