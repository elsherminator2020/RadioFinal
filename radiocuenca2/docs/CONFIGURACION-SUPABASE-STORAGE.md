# Configuración de Supabase Storage para Radio Cuenca

## Problema
Si estás viendo errores como:
- "Failed to load resource: the server responded with a status of 400"
- "Error uploading program image: Object"
- "Error saving program: Object"
- **"StorageApiError: new row violates row-level security policy"** ⚠️

Es probable que **Supabase Storage** no esté configurado correctamente o tenga problemas de políticas RLS.

## 🔒 Error Específico de RLS (Row Level Security)

Si ves el error:
```
Error creating bucket: StorageApiError: new row violates row-level security policy
```

Esto significa que las **políticas de seguridad de Supabase** están bloqueando la creación automática del bucket. **LA CONFIGURACIÓN MANUAL ES OBLIGATORIA**.

## Solución OBLIGATORIA (Manual)

### ⚠️ Importante: La configuración automática NO funciona
Debido a las políticas RLS de Supabase, el bucket debe crearse manualmente desde el Dashboard.

### Paso 1: Acceder a Supabase Dashboard
1. Ir a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Iniciar sesión con tu cuenta de administrador
3. Seleccionar tu proyecto de Radio Cuenca

### Paso 2: Crear los Buckets
1. En el menú lateral, hacer clic en **Storage**
2. Hacer clic en **Create a new bucket**
3. Configurar los buckets:

#### Bucket Principal: `images`
   - **Nombre**: `images` (exactamente así)
   - **Público**: ✅ **OBLIGATORIO activar**
   - **Tipos de archivo**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
   - **Tamaño máximo**: `5MB`

#### Bucket de Programas: `programming-images`
   - **Nombre**: `programming-images` (exactamente así)
   - **Público**: ✅ **OBLIGATORIO activar**
   - **Tipos de archivo**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
   - **Tamaño máximo**: `5MB`

### Paso 3: Configurar Políticas RLS (CRÍTICO)
1. En Storage, hacer clic en **Policies**
2. Crear políticas para ambos buckets:

#### Políticas para bucket `images`:
```sql
-- Política para SUBIR imágenes
CREATE POLICY "Allow authenticated uploads to images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- Política para LEER imágenes
CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

-- Política para ELIMINAR imágenes
CREATE POLICY "Allow authenticated delete from images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');
```

#### Políticas para bucket `programming-images`:
```sql
-- Política para SUBIR imágenes de programas
CREATE POLICY "Allow authenticated uploads to programming" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'programming-images');

-- Política para LEER imágenes de programas
CREATE POLICY "Allow public access to programming" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'programming-images');

-- Política para ELIMINAR imágenes de programas
CREATE POLICY "Allow authenticated delete from programming" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'programming-images');
```

### Paso 4: Estructura de Carpetas
Las imágenes se organizan automáticamente en la siguiente estructura:

```
📁 images/
├── 📁 noticias/
│   ├── 1703123456789_imagen_noticia.jpg
│   ├── 1703123456890_foto_evento.png
│   └── ...
└── 📁 (otras carpetas futuras)

📁 programming-images/
├── imagen_programa1.jpg
├── imagen_programa2.png
└── ...
```

### Paso 5: Verificar la Configuración
1. Ir a `/admin` en tu aplicación
2. Revisar la sección "Configuración de Almacenamiento"
3. Debe aparecer: ✅ **Configurado**
4. Intentar subir una imagen en:
   - `/admin/news/new` (para noticias)
   - `/admin/programming/new` (para programas)

## URLs Públicas Resultantes

### Para Noticias:
```
https://[tu-proyecto].supabase.co/storage/v1/object/public/images/noticias/[timestamp]_[archivo]
```

### Para Programas:
```
https://[tu-proyecto].supabase.co/storage/v1/object/public/programming-images/[archivo]
```

## Soluciones Alternativas (Si las anteriores fallan)

### Opción 1: Script de Consola (Verificación)
1. Abrir consola del navegador (F12)
2. Ejecutar: `checkStorageStatus()`
3. Debe mostrar el estado actual del almacenamiento

### Opción 2: Configuración desde SQL Editor
1. En Supabase Dashboard → SQL Editor
2. Crear una nueva consulta
3. Copiar y pegar:

```sql
-- Verificar buckets existentes
SELECT name, public FROM storage.buckets;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';
```

## Troubleshooting Específico

### Error: "StorageApiError: new row violates row-level security policy"
✅ **Solución**: Configuración manual obligatoria
- No intentar configuración automática
- Seguir los pasos manuales exactamente como se indica

### Error: "Bucket not found" después de crear el bucket
✅ **Solución**: Verificar nombre del bucket
- Debe ser exactamente `images` y `programming-images`
- Verificar que estén marcados como públicos

### Error: "Permission denied" al subir imágenes
✅ **Solución**: Verificar políticas RLS
- Asegurarse de que las políticas estén creadas para ambos buckets
- Verificar que el usuario esté autenticado

### Error: "Invalid file type"
✅ **Solución**: Verificar el archivo
- Solo JPG, PNG, GIF, WebP
- Máximo 5MB de tamaño

## Verificación Final

### ✅ Lista de Verificación:
- [ ] Bucket `images` creado y público
- [ ] Bucket `programming-images` creado y público
- [ ] Políticas RLS configuradas para ambos buckets
- [ ] Dashboard muestra "Configurado"
- [ ] Subida de imagen de noticias funciona
- [ ] Subida de imagen de programas funciona

### 🔍 Comandos de Verificación:
```javascript
// En consola del navegador
checkStorageStatus()
```

## Variables de Entorno

Verificar que estén configuradas:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_KEY=tu-clave-publica
```

## Contacto

Si después de seguir TODOS los pasos manuales sigues teniendo problemas:
1. Verificar que tienes rol de administrador en Supabase
2. Contactar al administrador del sistema
3. Revisar los logs en Supabase Dashboard → Logs

---

**⚠️ IMPORTANTE**: La configuración manual es la única opción viable debido a las políticas RLS de Supabase. 