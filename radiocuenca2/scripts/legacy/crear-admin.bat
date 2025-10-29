@echo off
title Radio Cuenca - Crear Administrador
color 0F

echo.
echo ================================================
echo   RADIO CUENCA CANERA 94.5FM - CREAR ADMIN
echo ================================================
echo.
echo Este script creara un usuario administrador en Supabase
echo para tu aplicacion de Radio Cuenca.
echo.
echo NECESITARAS:
echo 1. URL de tu proyecto Supabase
echo 2. Service Role Key de Supabase
echo.
echo La Service Role Key la encuentras en:
echo Supabase Dashboard ^> Settings ^> API ^> Service Role
echo.
echo ================================================
echo.

cd /d "%~dp0.."

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Node.js no esta instalado
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo.
    echo ⚠️  Las dependencias no estan instaladas
    echo.
    echo Ejecutando npm install...
    echo.
    npm install
    
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Error al instalar dependencias
        echo.
        pause
        exit /b 1
    )
)

echo Ejecutando script de creacion de administrador...
echo.

REM Ejecutar el script de creación
node scripts/crear-admin.mjs

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   ✅ PROCESO COMPLETADO
    echo ================================================
    echo.
    echo Ahora puedes:
    echo 1. Ejecutar "iniciar.bat" para iniciar el servidor
    echo 2. Ir a http://localhost:5173/login
    echo 3. Usar las credenciales mostradas arriba
    echo.
) else (
    echo.
    echo ================================================
    echo   ❌ OCURRIO UN ERROR
    echo ================================================
    echo.
    echo Revisa los mensajes anteriores para mas detalles
    echo o usa la opcion manual explicada en el script.
    echo.
)

pause 