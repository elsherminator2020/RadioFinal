@echo off
title Radio Cuenca - Compilar para Producción
color 0D

echo.
echo ================================================
echo   RADIO CUENCA CANERA 94.5FM - PRODUCCION
echo ================================================
echo.
echo Compilando aplicación para producción...
echo.

cd /d "%~dp0.."

REM Limpiar carpeta dist si existe
if exist "dist" (
    echo Limpiando archivos anteriores...
    rmdir /s /q "dist"
    echo ✓ Archivos anteriores eliminados
    echo.
)

echo Ejecutando build de producción...
echo.
npm run build

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   ✓ COMPILACION EXITOSA
    echo ================================================
    echo.
    echo La aplicación ha sido compilada en la carpeta 'dist'
    echo.
    echo Para probar la versión de producción ejecuta:
    echo   npm run preview
    echo.
    echo O despliega los archivos de la carpeta 'dist' 
    echo en tu servidor web.
    echo.
    
    REM Mostrar tamaño de los archivos generados
    echo Archivos generados:
    dir /s "dist" | findstr /i ".js .css .html"
    echo.
    
) else (
    echo.
    echo ================================================
    echo   ❌ ERROR EN LA COMPILACION
    echo ================================================
    echo.
    echo Por favor revisa los errores anteriores
    echo y corrige los problemas antes de intentar nuevamente.
    echo.
)

pause 