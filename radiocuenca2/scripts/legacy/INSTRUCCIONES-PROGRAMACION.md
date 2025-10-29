# 📻 CONFIGURACIÓN DE TABLA DE PROGRAMACIÓN - RADIO CUENCA CAÑERA 94.5FM

## 🎯 INSTRUCCIONES PASO A PASO

### **PASO 1: EJECUTAR SCRIPT SQL EN SUPABASE**

1. **Accede a tu Dashboard de Supabase:**
   - Ve a: https://supabase.com
   - Inicia sesión en tu cuenta
   - Selecciona tu proyecto

2. **Abre el SQL Editor:**
   - En el menú lateral izquierdo, clic en **"SQL Editor"**
   - Clic en **"New query"** (botón verde)

3. **Ejecuta el script de programación:**
   - Abre el archivo `scripts/setup-programming-table.sql`
   - Copia **TODO** el contenido (desde la primera línea hasta el final)
   - Pégalo en el editor SQL de Supabase
   - Clic en **"Run"** (botón verde con ícono de play)

4. **Verifica el resultado:**
   - Deberías ver mensajes de éxito en la parte inferior
   - Ve a **"Table Editor"** y verifica que existe la tabla `programming`

---

## ✅ **QUÉ SE CREÓ EN LA BASE DE DATOS**

### 📊 **Nueva tabla:**
- ✅ `public.programming` - Para la programación de radio

### 🗂️ **Estructura de la tabla:**
- `id` - ID único del programa
- `program_name` - Nombre del programa
- `description` - Descripción del programa
- `day_of_week` - Día de la semana (lunes-viernes, sabados, domingos, etc.)
- `start_time` - Hora de inicio (HH:MM)
- `end_time` - Hora de finalización (HH:MM)
- `program_type` - Tipo (music, news, talk, sports, variety)
- `host_name` - Nombre del conductor (opcional)
- `image_url` - URL de imagen del programa (opcional)
- `active` - Estado del programa (activo/inactivo)
- `created_at` - Fecha de creación
- `updated_at` - Fecha de última actualización

### 🔒 **Configuración de seguridad:**
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas para lectura pública de programas activos
- ✅ Políticas para administradores autenticados

### 🚀 **Optimizaciones:**
- ✅ Índices para mejor rendimiento
- ✅ Búsqueda de texto completo en español
- ✅ Triggers para timestamps automáticos
- ✅ Funciones de búsqueda personalizadas

### 📝 **Datos de ejemplo:**
- ✅ 16 programas de ejemplo con horarios realistas
- ✅ Programación de lunes a viernes, sábados y domingos
- ✅ Diferentes tipos de programas (música, noticias, deportes, etc.)

---

## 📱 **FUNCIONALIDAD EN LA APLICACIÓN**

### ✅ **Ya disponible:**
- Servicio completo de programación (`programmingService.ts`)
- Rutas de administración configuradas
- Páginas básicas de gestión
- Integración en el panel de administración

### 🚧 **En desarrollo:**
- Formulario completo para crear/editar programas
- Vista completa de gestión con filtros y búsqueda
- Integración con la página pública de programación

---

## 🔗 **ACCESO A LA FUNCIONALIDAD**

1. **Panel de Administración:**
   - URL: http://localhost:5173/admin
   - Busca la nueva tarjeta "Programación"
   - Clic en "Gestionar" para ver la lista
   - Clic en "Crear" para nuevo programa

2. **Rutas disponibles:**
   - `/admin/programming` - Gestión de programación
   - `/admin/programming/new` - Crear programa
   - `/admin/programming/edit/:id` - Editar programa

---

## 🎯 **PRÓXIMOS PASOS**

1. **Ejecuta el script SQL** para crear la tabla
2. **Reinicia la aplicación** si está corriendo
3. **Accede al panel de administración** y verifica la nueva sección
4. **Los formularios completos** estarán disponibles en la próxima actualización

---

## 📊 **EJEMPLO DE PROGRAMACIÓN CREADA**

El script crea automáticamente una programación de ejemplo que incluye:

**Lunes a Viernes:**
- 06:00-08:00: Despertar Cañero (Música)
- 08:00-10:00: Noticiero Matutino (Noticias)
- 10:00-12:00: Música Variada
- 12:00-14:00: Mediodía Informativo (Noticias)
- 14:00-16:00: Tarde Musical
- 16:00-18:00: Conversa Cañera (Conversación)
- 18:00-20:00: Noticiero Vespertino (Noticias)
- 20:00-22:00: Noche Musical

**Sábados:**
- 08:00-10:00: Sábado Deportivo (Deportes)
- 10:00-12:00: Folklore y Tradición (Música)
- 12:00-14:00: Varieté Sabatino (Variedad)
- 14:00-17:00: Tarde de Sábado (Variedad)

**Domingos:**
- 09:00-11:00: Domingo Familiar (Variedad)
- 11:00-13:00: Música Clásica
- 13:00-15:00: Almuerzo Dominical
- 15:00-17:00: Recuerdos Musicales

---

## 🛠️ **SOPORTE**

Si tienes problemas:
1. Verifica que copiaste TODO el script SQL
2. Asegúrate de ejecutarlo en el SQL Editor de Supabase
3. Revisa los mensajes de éxito/error en la consola
4. La tabla se puede ejecutar múltiples veces de forma segura

---

## 🎉 **¡LISTO!**

Una vez ejecutado exitosamente, tendrás:
- ✅ Tabla de programación completamente configurada
- ✅ Datos de ejemplo listos para usar
- ✅ Funcionalidad básica en el panel de administración
- ✅ Base sólida para gestión completa de programación

**La gestión de programación está lista para usar junto con noticias y publicidades!** 📻🎵 