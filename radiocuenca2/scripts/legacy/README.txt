================================================
  RADIO CUENCA CAÑERA 94.5FM - SCRIPTS DE GESTIÓN
================================================

Este directorio contiene scripts para gestionar la aplicación web 
de Radio Cuenca Cañera 94.5FM de manera fácil y rápida.

================================================
📁 ARCHIVOS DISPONIBLES
================================================

🚀 INICIAR SERVICIOS:
   • iniciar.bat
     - Inicia el servidor de desarrollo
     - Muestra la URL del sitio web
     - Mantiene la ventana abierta para ver logs

   • iniciar-con-navegador.bat
     - Inicia el servidor de desarrollo
     - Abre automáticamente el navegador web
     - Abre tanto la página principal como el admin

⛔ DETENER SERVICIOS:
   • detener.bat
     - Detiene todos los procesos de Node.js
     - Libera el puerto 5173
     - Cierra la ventana automáticamente

🔧 GESTIÓN DEL PROYECTO:
   • instalar-dependencias.bat
     - Instala todas las dependencias necesarias
     - Verifica que Node.js esté instalado
     - Ejecutar PRIMERO antes de usar otros scripts

   • crear-admin.bat
     - Crea el usuario administrador en Supabase
     - Configura credenciales de acceso automáticamente
     - Ejecutar después de instalar dependencias

   • compilar-produccion.bat
     - Compila la aplicación para producción
     - Genera archivos optimizados en carpeta 'dist'
     - Listo para subir a servidor web

================================================
📖 INSTRUCCIONES DE USO
================================================

1. PRIMERA VEZ:
   - Ejecuta "instalar-dependencias.bat"
   - Ejecuta "crear-admin.bat" para configurar administrador
   - Espera a que termine la configuración

2. DESARROLLO DIARIO:
   - Doble clic en "iniciar.bat" para trabajar
   - O usa "iniciar-con-navegador.bat" para comodidad
   - Ve a http://localhost:5173/login para administrar
   - Cuando termines, ejecuta "detener.bat"

3. PARA PRODUCCIÓN:
   - Ejecuta "compilar-produccion.bat"
   - Sube la carpeta 'dist' a tu servidor web

================================================
🌐 URLs IMPORTANTES
================================================

Sitio Web:     http://localhost:5173
Administración: http://localhost:5173/admin
Noticias:      http://localhost:5173/noticias

================================================
⚠️  SOLUCIÓN DE PROBLEMAS
================================================

PROBLEMA: "Node.js no está instalado"
SOLUCIÓN: Descarga e instala desde https://nodejs.org/

PROBLEMA: "Puerto en uso"
SOLUCIÓN: Ejecuta "detener.bat" y vuelve a intentar

PROBLEMA: "Error al instalar dependencias"
SOLUCIÓN: Verifica conexión a internet y permisos

PROBLEMA: "No se puede ejecutar scripts"
SOLUCIÓN: Botón derecho → "Ejecutar como administrador"

================================================
📞 SOPORTE
================================================

Para soporte técnico o dudas sobre estos scripts,
contacta al equipo de desarrollo de Radio Cuenca.

¡Gracias por usar Radio Cuenca Cañera 94.5FM!
================================================ 