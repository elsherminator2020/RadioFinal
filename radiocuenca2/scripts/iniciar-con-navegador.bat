@echo off
title Radio Cuenca - Servidor + Navegador
color 0B

echo.
echo ================================================
echo   RADIO CUENCA CANERA 94.5FM - INICIO COMPLETO
echo ================================================
echo.
echo Iniciando servidor de desarrollo...
echo El navegador se abrirá automáticamente en 5 segundos
echo.
echo URL Local: http://localhost:5173
echo URL Admin: http://localhost:5173/admin
echo.
echo Presiona Ctrl+C para detener el servidor
echo ================================================
echo.

cd /d "%~dp0.."

REM Iniciar el servidor en segundo plano
start /b npm run dev

REM Esperar 5 segundos para que el servidor inicie
timeout /t 5 /nobreak >nul

REM Abrir el navegador
start http://localhost:5173

REM Abrir también la página de admin en otra pestaña
timeout /t 2 /nobreak >nul
start http://localhost:5173/admin

echo.
echo ✓ Servidor iniciado
echo ✓ Navegador abierto
echo.
echo Presiona cualquier tecla para cerrar esta ventana (el servidor seguirá funcionando)
pause >nul 