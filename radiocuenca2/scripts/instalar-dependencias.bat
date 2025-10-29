@echo off
title Radio Cuenca - Instalar Dependencias
color 0E

echo.
echo ================================================
echo   RADIO CUENCA CANERA 94.5FM - INSTALACION
echo ================================================
echo.
echo Instalando dependencias del proyecto...
echo Este proceso puede tomar varios minutos
echo.

cd /d "%~dp0.."

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Node.js no está instalado
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verificar si npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: NPM no está instalado
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Node.js detectado: 
node --version
echo ✓ NPM detectado: 
npm --version
echo.

echo Instalando dependencias...
echo.
npm install

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   ✓ DEPENDENCIAS INSTALADAS CORRECTAMENTE
    echo ================================================
    echo.
    echo Ya puedes ejecutar:
    echo - iniciar.bat (para iniciar el servidor)
    echo - iniciar-con-navegador.bat (servidor + navegador)
    echo - detener.bat (para detener servicios)
    echo.
) else (
    echo.
    echo ================================================
    echo   ❌ ERROR AL INSTALAR DEPENDENCIAS
    echo ================================================
    echo.
    echo Por favor revisa los errores anteriores
    echo.
)

pause 