@echo off
title Radio Cuenca - Detener Servicios
color 0C

echo.
echo ================================================
echo   RADIO CUENCA CANERA 94.5FM - DETENER SERVICIOS
echo ================================================
echo.
echo Deteniendo todos los procesos de Node.js y Vite...
echo.

REM Terminar procesos de Node.js
taskkill /f /im node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ Procesos de Node.js detenidos
) else (
    echo - No se encontraron procesos de Node.js activos
)

REM Terminar procesos de npm
taskkill /f /im npm.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ Procesos de NPM detenidos
) else (
    echo - No se encontraron procesos de NPM activos
)

REM Liberar puerto 5173 (Vite default)
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo.
    echo Liberando puerto 5173...
    for /f "tokens=5" %%p in ('netstat -ano ^| findstr :5173') do (
        taskkill /f /pid %%p 2>nul
    )
    echo ✓ Puerto 5173 liberado
)

echo.
echo ================================================
echo   TODOS LOS SERVICIOS HAN SIDO DETENIDOS
echo ================================================
echo.

timeout /t 3 /nobreak >nul
exit 