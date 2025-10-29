# 🗄️ CONFIGURACIÓN DE BASE DE DATOS - RADIO CUENCA CAÑERA 94.5FM

## 📋 INSTRUCCIONES PASO A PASO

### 🎯 **OPCIÓN 1: EJECUCIÓN DIRECTA EN SUPABASE (RECOMENDADO)**

1. **Accede a tu Dashboard de Supabase:**
   - Ve a: https://supabase.com
   - Inicia sesión en tu cuenta
   - Selecciona tu proyecto: `cavbgwugqxevewthyjzx`

2. **Abre el SQL Editor:**
   - En el menú lateral izquierdo, clic en **"SQL Editor"**
   - Clic en **"New query"** (botón verde)

3. **Ejecuta el script:**
   - Abre el archivo `scripts/setup-database.sql`
   - Copia **TODO** el contenido (desde la primera línea hasta el final)
   - Pégalo en el editor SQL de Supabase
   - Clic en **"Run"** (botón verde con ícono de play)

4. **Verifica el resultado:**
   - Deberías ver mensajes de éxito en la parte inferior
   - Ve a **"Table Editor"** y verifica que existe la tabla `news`

---

### 🔧 **OPCIÓN 2: VERIFICACIÓN MANUAL DE TABLAS**

Si quieres verificar que todo está correcto, puedes ejecutar estas consultas por separado:

```sql
-- Verificar que las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('news', 'programming', 'advertisements');

-- Contar registros en cada tabla
SELECT 'news' as tabla, COUNT(*) as registros FROM public.news
UNION ALL
SELECT 'programming' as tabla, COUNT(*) as registros FROM public.programming
UNION ALL
SELECT 'advertisements' as tabla, COUNT(*) as registros FROM public.advertisements;

-- Verificar políticas de seguridad
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('news', 'programming', 'advertisements');
```

---

## ✅ **QUÉ INCLUYE EL SCRIPT**

### 📊 **Tablas creadas:**
- ✅ `public.news` - Para noticias del sitio
- ✅ `public.programming` - Para programación de radio
- ✅ `public.advertisements` - Para publicidades

### 🔒 **Configuración de seguridad:**
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas para lectura pública
- ✅ Políticas para administradores autenticados

### 🚀 **Optimizaciones:**
- ✅ Índices para mejor rendimiento
- ✅ Búsqueda de texto completo en español
- ✅ Triggers para timestamps automáticos

### 📝 **Datos de ejemplo:**
- ✅ 5 noticias de ejemplo con imágenes
- ✅ Programación de ejemplo
- ✅ Publicidades de ejemplo
- ✅ Funciones útiles para búsquedas

---

## 🛠️ **TROUBLESHOOTING**

### ❌ **Error: "permission denied"**
- Asegúrate de estar usando la **Service Role Key**, no la anon key
- Ve a Settings > API y usa la clave de "service_role"

### ❌ **Error: "table already exists"**
- Normal si ya ejecutaste el script antes
- Las tablas no se duplicarán gracias a `IF NOT EXISTS`

### ❌ **Error: "function does not exist"**
- Ejecuta todo el script completo de una vez
- No ejecutes comandos por separado

---

## 🎯 **DESPUÉS DE LA CONFIGURACIÓN**

1. **Refresca tu aplicación:**
   - Ve a: http://localhost:5173
   - Los errores 404 deberían desaparecer

2. **Accede al panel de administración:**
   - URL: http://localhost:5173/login
   - Email: `admin@radiocuenca.com`
   - Contraseña: `RadioCuenca2024!`

3. **Verifica que todo funciona:**
   - ✅ Las noticias aparecen en la página principal
   - ✅ La programación se muestra correctamente
   - ✅ Las publicidades funcionan
   - ✅ El panel de administración carga sin errores

---

## 📞 **SOPORTE**

Si tienes problemas:
1. Verifica que copiaste TODO el script
2. Asegúrate de ejecutarlo en el SQL Editor de Supabase
3. Revisa los mensajes de error en la consola
4. Los datos de ejemplo son seguros de ejecutar múltiples veces

---

## 🎉 **¡LISTO!**

Una vez ejecutado exitosamente, tu base de datos estará completamente configurada y lista para usar con Radio Cuenca Cañera 94.5FM.

**Credenciales de acceso:**
- 📧 Email: `admin@radiocuenca.com`
- 🔒 Contraseña: `RadioCuenca2024!`
- 🌐 Panel admin: http://localhost:5173/admin 