@echo off
title Radio Cuenca - Configurar Variables de Entorno
color 0A

echo.
echo ================================================
echo   RADIO CUENCA CANERA 94.5FM - CONFIGURAR ENV
echo ================================================
echo.
echo Este script te ayudara a configurar las variables
echo de entorno necesarias para conectar con Supabase.
echo.
echo NECESITARAS:
echo 1. URL de tu proyecto Supabase
echo 2. Clave publica (anon key) de Supabase
echo.
echo Donde encontrar estos datos:
echo 1. Ve a https://supabase.com
echo 2. Inicia sesion y selecciona tu proyecto
echo 3. Ve a Settings ^> API
echo 4. Copia la URL y la anon public key
echo.
echo ================================================
echo.

cd /d "%~dp0.."

REM Verificar si ya existe .env
if exist ".env" (
    echo ⚠️  Ya existe un archivo .env
    echo.
    set /p respuesta="¿Quieres reemplazarlo? (s/n): "
    if /i not "%respuesta%"=="s" (
        echo.
        echo Operacion cancelada.
        pause
        exit /b 0
    )
    echo.
)

echo Creando archivo .env...
echo.

REM Solicitar datos al usuario
set /p SUPABASE_URL="🔗 Ingresa la URL de tu proyecto Supabase: "
set /p SUPABASE_KEY="🔑 Ingresa la clave publica (anon key): "

REM Validar que se ingresaron los datos
if "%SUPABASE_URL%"=="" (
    echo.
    echo ❌ Error: La URL es requerida
    pause
    exit /b 1
)

if "%SUPABASE_KEY%"=="" (
    echo.
    echo ❌ Error: La clave es requerida
    pause
    exit /b 1
)

REM Crear archivo .env
echo # Variables de entorno para Radio Cuenca - Supabase > .env
echo # Configurado automaticamente el %date% a las %time% >> .env
echo. >> .env
echo # URL de tu proyecto Supabase >> .env
echo VITE_SUPABASE_URL=%SUPABASE_URL% >> .env
echo. >> .env
echo # Clave publica de tu proyecto Supabase ^(anon key^) >> .env
echo VITE_SUPABASE_KEY=%SUPABASE_KEY% >> .env

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   ✅ ARCHIVO .ENV CREADO CORRECTAMENTE
    echo ================================================
    echo.
    echo Variables configuradas:
    echo 📧 URL: %SUPABASE_URL%
    echo 🔑 Key: %SUPABASE_KEY:~0,20%...
    echo.
    echo SIGUIENTE PASO:
    echo Ejecuta "crear-admin.bat" para crear el usuario administrador
    echo.
) else (
    echo.
    echo ❌ Error al crear el archivo .env
    echo.
)

pause 