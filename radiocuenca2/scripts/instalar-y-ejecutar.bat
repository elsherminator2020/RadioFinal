@echo off
echo ===================================
echo  Instalación de Radio Cuenca
echo ===================================

:: Verificar si Node.js está instalado
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js no está instalado o no está en el PATH.
    echo Por favor, instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo 1. Limpiando cache de npm...
call npm cache clean --force

:: Eliminar node_modules si existe
if exist node_modules (
    echo.
    echo 2. Eliminando node_modules existente...
    rmdir /s /q node_modules
)

:: Eliminar package-lock.json si existe
if exist package-lock.json (
    echo.
    echo 3. Eliminando package-lock.json...
    del package-lock.json
)

echo.
echo 4. Instalando dependencias...
call npm install

if %ERRORLEVEL% neq 0 (
    echo.
    echo Error al instalar las dependencias. Revisa los mensajes de error.
    pause
    exit /b 1
)

echo.
echo ===================================
echo Instalación completada exitosamente!
echo ===================================
echo.
echo Iniciando la aplicación...
call npm run dev

pause
