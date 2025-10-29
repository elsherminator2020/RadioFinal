@echo off
title Radio Cuenca - Servidor de Desarrollo
color 0A

echo.
echo ================================================
echo   RADIO CUENCA CANERA 94.5FM - SERVIDOR WEB
echo ================================================
echo.
echo Iniciando servidor de desarrollo...
echo.
echo URL Local: http://localhost:5173
echo URL Admin: http://localhost:5173/admin
echo.
echo Presiona Ctrl+C para detener el servidor
echo ================================================
echo.

cd /d "%~dp0.."
npm run dev

pause 