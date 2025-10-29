import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// Configuración de colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdminUser() {
  log('\n================================================', colors.cyan);
  log('   RADIO CUENCA CAÑERA 94.5FM - CREAR ADMIN', colors.cyan);
  log('================================================\n', colors.cyan);

  try {
    // Solicitar credenciales de Supabase
    log('📋 CONFIGURACIÓN DE SUPABASE', colors.yellow);
    log('Necesitamos tus credenciales de Supabase para crear el usuario administrador.\n');
    
    const supabaseUrl = await question('🔗 URL de tu proyecto Supabase: ');
    const supabaseServiceKey = await question('🔑 Service Role Key (clave de servicio): ');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('URL y Service Key son requeridos');
    }

    // Crear cliente de Supabase con privilegios de administrador
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    log('\n📝 DATOS DEL ADMINISTRADOR', colors.yellow);
    
    // Solicitar datos del administrador
    const adminEmail = await question('📧 Email del administrador [admin@radiocuenca.com]: ') || 'admin@radiocuenca.com';
    const adminPassword = await question('🔒 Contraseña del administrador [RadioCuenca2024!]: ') || 'RadioCuenca2024!';
    
    log(`\n🚀 Creando usuario administrador...`, colors.blue);
    
    // Crear usuario con privilegios de administrador
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        role: 'admin',
        full_name: 'Administrador Radio Cuenca',
        created_by: 'setup_script'
      }
    });

    if (error) {
      throw error;
    }

    log('\n✅ ¡USUARIO ADMINISTRADOR CREADO EXITOSAMENTE!', colors.green);
    log('================================================', colors.green);
    log(`📧 Email: ${adminEmail}`, colors.bright);
    log(`🔒 Contraseña: ${adminPassword}`, colors.bright);
    log('================================================', colors.green);
    
    log('\n🌐 ACCESO AL SISTEMA:', colors.cyan);
    log('1. Ejecuta: npm run dev (o usa iniciar.bat)');
    log('2. Ve a: http://localhost:5173/login');
    log('3. Usa las credenciales mostradas arriba');
    log('4. Serás redirigido al panel de administración');
    
    log('\n💡 CONSEJOS DE SEGURIDAD:', colors.yellow);
    log('• Cambia la contraseña después del primer login');
    log('• No compartas estas credenciales');
    log('• Considera habilitar 2FA en Supabase');
    
    log('\n🎉 ¡Radio Cuenca Cañera 94.5FM listo para usar!', colors.magenta);

  } catch (error) {
    log('\n❌ ERROR AL CREAR ADMINISTRADOR:', colors.red);
    log(`${error.message}`, colors.red);
    
    log('\n🔧 SOLUCIONES POSIBLES:', colors.yellow);
    log('• Verifica que la URL de Supabase sea correcta');
    log('• Asegúrate de usar la Service Role Key, no la anon key');
    log('• La Service Role Key debe tener permisos de administrador');
    log('• Revisa que el proyecto de Supabase esté activo');
    
    log('\n📖 ALTERNATIVA MANUAL:', colors.cyan);
    log('1. Ve a tu dashboard de Supabase');
    log('2. Navega a Authentication > Users');
    log('3. Clic en "Add user"');
    log('4. Email: admin@radiocuenca.com');
    log('5. Password: RadioCuenca2024!');
    log('6. Confirma la creación');
  } finally {
    rl.close();
  }
}

// Ejecutar la función
createAdminUser(); 