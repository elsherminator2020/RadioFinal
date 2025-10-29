# 🚨 SOLUCIÓN RÁPIDA: Errores de Supabase Storage

## 📋 Resumen del Problema

**Error actual**: `StorageApiError: new row violates row-level security policy`

**Causa**: Las políticas RLS de Supabase impiden la creación automática del bucket.

**Solución**: Configuración manual obligatoria desde Supabase Dashboard.

## ⚡ Solución Rápida (5 minutos)

### 1. Ir a Supabase Dashboard
👉 [https://supabase.com/dashboard](https://supabase.com/dashboard)

### 2. Crear Bucket
- **Storage** → **Create a new bucket**
- **Nombre**: `programming-images`
- **Público**: ✅ **ACTIVAR**

### 3. Configurar Políticas RLS
**Storage** → **Policies** → **New policy**

Copiar y pegar estos 3 comandos SQL:

```sql
-- 1. Política para subir imágenes
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'programming-images');

-- 2. Política para leer imágenes
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'programming-images');

-- 3. Política para eliminar imágenes
CREATE POLICY "Allow authenticated delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'programming-images');
```

### 4. Verificar
- Ir a `/admin` en la aplicación
- Debe aparecer: ✅ **Configurado**
- Probar subir una imagen en `/admin/programming/new`

## 🔍 Verificación Rápida

En consola del navegador (F12):
```javascript
checkStorageStatus()
```

## ❌ Errores Comunes y Soluciones

| Error | Solución |
|-------|----------|
| `row violates row-level security policy` | Configuración manual obligatoria |
| `Bucket not found` | Verificar nombre: `programming-images` |
| `Permission denied` | Verificar que el bucket esté marcado como público |
| `Invalid file type` | Solo JPG, PNG, GIF, WebP (máx. 5MB) |

## 📞 Contacto

Si persisten los problemas después de seguir estos pasos:
1. Verificar rol de administrador en Supabase
2. Contactar al administrador del sistema
3. Revisar logs en Supabase Dashboard

---

**⏰ Tiempo estimado**: 5 minutos  
**🔧 Dificultad**: Básica  
**📋 Requisitos**: Acceso de administrador a Supabase 