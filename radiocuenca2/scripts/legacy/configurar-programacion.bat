@echo off
title Radio Cuenca Cañera 94.5FM - Configurar Programación
color 0A

echo.
echo ================================================================
echo RADIO CUENCA CAÑERA 94.5FM - CONFIGURACIÓN DE PROGRAMACIÓN
echo ================================================================
echo.
echo Este script te ayudará a configurar la tabla de programación
echo en tu base de datos de Supabase.
echo.
echo PASOS A SEGUIR:
echo.
echo 1. Se abrirá el archivo SQL en el Bloc de notas
echo 2. Copia TODO el contenido del archivo (Ctrl+A, Ctrl+C)
echo 3. Ve a https://supabase.com y accede a tu proyecto
echo 4. Navega a "SQL Editor" 
echo 5. Crea una "New query"
echo 6. Pega el contenido (Ctrl+V)
echo 7. Presiona "Run" para ejecutar
echo.
pause

echo.
echo Abriendo archivo SQL...
notepad.exe "setup-programming-table.sql"

echo.
echo ================================================================
echo DESPUÉS DE EJECUTAR EL SCRIPT EN SUPABASE:
echo ================================================================
echo.
echo ✅ Ve al panel de administración: http://localhost:5173/admin
echo ✅ Busca la nueva tarjeta "Programación"
echo ✅ Haz clic en "Gestionar" para ver la programación
echo ✅ Haz clic en "Crear" para agregar nuevos programas
echo.
echo La programación de ejemplo incluye:
echo - Programas de lunes a viernes
echo - Programas de sábados y domingos  
echo - Diferentes tipos: música, noticias, deportes, etc.
echo - 16 programas de muestra listos para usar
echo.
echo ================================================================
echo ¡LISTO! La gestión de programación está configurada.
echo ================================================================
echo.
pause 