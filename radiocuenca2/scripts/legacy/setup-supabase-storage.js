/**
 * Script para configurar Supabase Storage manualmente
 * 
 * ⚠️ IMPORTANTE: Si ves errores de RLS, la configuración manual es obligatoria
 * 
 * Instrucciones:
 * 1. Abrir la consola del navegador (F12)
 * 2. Copiar y pegar todo este código
 * 3. Presionar Enter para ejecutar
 * 
 * Este script intentará crear el bucket 'programming-images' automáticamente.
 * Si falla debido a políticas RLS, te dará instrucciones para configurar manualmente.
 */

(async function setupSupabaseStorage() {
  console.log('🚀 Iniciando configuración de Supabase Storage...');
  
  try {
    // Verificar si supabase está disponible
    if (typeof window.supabase === 'undefined') {
      console.error('❌ Supabase no está disponible. Asegúrese de estar en la página de administración.');
      return;
    }

    const supabase = window.supabase;

    // Verificar buckets existentes
    console.log('🔍 Verificando buckets existentes...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error al verificar buckets:', listError.message);
      return;
    }

    console.log('📦 Buckets encontrados:', buckets?.map(b => b.name) || []);

    // Verificar si el bucket ya existe
    const bucketExists = buckets?.some(bucket => bucket.name === 'programming-images');
    
    if (bucketExists) {
      console.log('✅ El bucket "programming-images" ya existe.');
      console.log('🔍 Verificando políticas RLS...');
      // Aquí podrías agregar verificación de políticas si es necesario
      return;
    }

    // Crear el bucket
    console.log('🏗️ Creando bucket "programming-images"...');
    const { error: createError } = await supabase.storage.createBucket('programming-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (createError) {
      console.error('❌ Error al crear bucket:', createError.message);
      
      // Manejar errores específicos de RLS
      if (createError.message.includes('row-level security') || createError.message.includes('RLS')) {
        console.log('\n🔒 ERROR DE POLÍTICAS RLS DETECTADO');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Las políticas de Row Level Security impiden la configuración automática.');
        console.log('\n⚠️ CONFIGURACIÓN MANUAL REQUERIDA:');
        console.log('1. Ir a https://supabase.com/dashboard');
        console.log('2. Seleccionar tu proyecto → Storage');
        console.log('3. Create bucket → Nombre: "programming-images" → Público: ✅');
        console.log('4. Storage → Policies → New policy');
        console.log('5. Copiar y pegar estos comandos SQL:');
        console.log('\n📝 CÓDIGO SQL PARA POLÍTICAS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`
-- Política para subir imágenes
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'programming-images');

-- Política para leer imágenes  
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'programming-images');

-- Política para eliminar imágenes
CREATE POLICY "Allow authenticated delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'programming-images');
        `);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n✅ Después de la configuración manual:');
        console.log('   - Recargar esta página');
        console.log('   - Ejecutar: checkStorageStatus()');
        console.log('   - Probar subir una imagen');
        
      } else {
        console.log('💡 Posibles soluciones:');
        console.log('   - Verificar que tenga permisos de administrador');
        console.log('   - Crear el bucket manualmente desde Supabase Dashboard');
        console.log('   - Contactar al administrador del sistema');
      }
      return;
    }

    console.log('✅ Bucket "programming-images" creado exitosamente!');
    console.log('🎉 Configuración completada. Ahora puede subir imágenes de programas.');
    
    // Verificar la configuración
    const { data: newBuckets } = await supabase.storage.listBuckets();
    console.log('📦 Buckets actuales:', newBuckets?.map(b => b.name) || []);

  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    console.log('\n🔧 CONFIGURACIÓN MANUAL REQUERIDA:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Ir a https://supabase.com/dashboard');
    console.log('2. Seleccionar su proyecto');
    console.log('3. Ir a Storage → Create bucket');
    console.log('4. Nombre: "programming-images" → Público: ✅');
    console.log('5. Configurar políticas RLS (ver código SQL arriba)');
  }
})();

// Función mejorada para verificar el estado
window.checkStorageStatus = async function() {
  try {
    console.log('🔍 Verificando estado de Supabase Storage...');
    
    const { data: buckets, error } = await window.supabase.storage.listBuckets();
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    const programmingBucket = buckets?.find(b => b.name === 'programming-images');
    
    if (programmingBucket) {
      console.log('✅ Almacenamiento configurado correctamente');
      console.log('📦 Bucket:', programmingBucket);
      console.log('🔧 Configuración:');
      console.log('   - Nombre:', programmingBucket.name);
      console.log('   - Público:', programmingBucket.public ? '✅' : '❌');
      console.log('   - Creado:', new Date(programmingBucket.created_at).toLocaleString());
    } else {
      console.log('❌ Bucket "programming-images" no encontrado');
      console.log('📦 Buckets disponibles:', buckets?.map(b => b.name) || []);
      console.log('⚠️ Ejecute la configuración manual desde Supabase Dashboard');
    }
  } catch (error) {
    console.error('❌ Error verificando estado:', error);
  }
};

// Función para probar la subida de imágenes
window.testImageUpload = async function() {
  try {
    console.log('🧪 Probando subida de imagen...');
    
    // Crear una imagen de prueba (1x1 pixel PNG)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 1, 1);
    
    canvas.toBlob(async (blob) => {
      const testFile = new File([blob], 'test.png', { type: 'image/png' });
      const testPath = `test-${Date.now()}.png`;
      
      const { data, error } = await window.supabase.storage
        .from('programming-images')
        .upload(testPath, testFile);
      
      if (error) {
        console.error('❌ Error en prueba de subida:', error.message);
        console.log('💡 Verificar políticas RLS');
      } else {
        console.log('✅ Prueba de subida exitosa');
        console.log('📁 Archivo:', testPath);
        
        // Limpiar archivo de prueba
        await window.supabase.storage
          .from('programming-images')
          .remove([testPath]);
        console.log('🧹 Archivo de prueba eliminado');
      }
    }, 'image/png');
    
  } catch (error) {
    console.error('❌ Error en prueba:', error);
  }
};

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🛠️ FUNCIONES DISPONIBLES:');
console.log('   checkStorageStatus() - Verificar configuración');
console.log('   testImageUpload() - Probar subida de imágenes');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'); 