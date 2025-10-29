@echo off
echo Creando archivo .env con las credenciales de Supabase...

(
echo # Variables de entorno para Supabase
echo VITE_SUPABASE_URL=https://cavbgwugqxevewthyjzx.supabase.co
echo VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhdmJnd3VncXhldmV3dGh5anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MTUwMDQsImV4cCI6MjA2MzA5MTAwNH0.eSK99f5dmkwOil9UGkIK4j2FPuVS2ijD-65DZ37_6U03fg
) > .env

echo ✅ Archivo .env creado exitosamente
echo 🚀 Ahora puedes ejecutar: npm run dev
pause 