@echo off
title Radio Cuenca - Crear Administrador (Directo)
color 0F

echo.
echo ================================================
echo   RADIO CUENCA CANERA 94.5FM - CREAR ADMIN
echo ================================================
echo.
echo SOLUCION DIRECTA - Este script ejecuta directamente
echo el archivo .mjs para evitar problemas de cache.
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

echo Verificando que el archivo .mjs existe...
if not exist "scripts\crear-admin.mjs" (
    echo.
    echo ❌ ERROR: No se encuentra scripts\crear-admin.mjs
    echo.
    echo Archivos disponibles en scripts:
    dir scripts\*.mjs
    echo.
    pause
    exit /b 1
)

echo ✅ Archivo encontrado. Ejecutando...
echo.

REM Ejecutar directamente con ruta completa
node "scripts\crear-admin.mjs"

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   ✅ USUARIO ADMINISTRADOR CREADO
    echo ================================================
    echo.
    echo PROXIMOS PASOS:
    echo 1. Ejecuta "iniciar.bat"
    echo 2. Ve a http://localhost:5173/login
    echo 3. Usa las credenciales que te mostramos arriba
    echo.
) else (
    echo.
    echo ================================================
    echo   ❌ ERROR AL CREAR ADMINISTRADOR
    echo ================================================
    echo.
    echo ALTERNATIVA MANUAL:
    echo 1. Ve a https://supabase.com
    echo 2. Selecciona tu proyecto
    echo 3. Ve a Authentication ^> Users
    echo 4. Clic en "Add user"
    echo 5. Email: admin@radiocuenca.com
    echo 6. Password: RadioCuenca2024!
    echo 7. Marca "Confirm email"
    echo 8. Clic en "Create user"
    echo.
)

pause 