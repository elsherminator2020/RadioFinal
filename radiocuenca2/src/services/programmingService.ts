import { supabase } from './supabaseClient';

export type Program = {
  id?: number;
  program_name: string;
  description: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  program_type: 'music' | 'news' | 'talk' | 'sports' | 'variety';
  host_name?: string;
  image_url?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};

// Obtener toda la programación
export const getProgramming = async () => {
  const { data, error } = await supabase
    .from('programming')
    .select('*')
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching programming:', error);
    throw error;
  }

  return data as Program[];
};

// Obtener programación activa
export const getActiveProgramming = async () => {
  const { data, error } = await supabase
    .from('programming')
    .select('*')
    .eq('active', true)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching active programming:', error);
    throw error;
  }

  return data as Program[];
};

// Obtener programación con paginación
export const getProgrammingPaginated = async (page: number = 1, limit: number = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('programming')
    .select('*', { count: 'exact' })
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })
    .range(from, to);

  if (error) {
    console.error('Error fetching paginated programming:', error);
    throw error;
  }

  return {
    data: data as Program[],
    count: count || 0,
    totalPages: Math.ceil((count || 0) / limit)
  };
};

// Buscar programas por término
export const searchProgramming = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('programming')
    .select('*')
    .or(`program_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,host_name.ilike.%${searchTerm}%`)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error searching programming:', error);
    throw error;
  }

  return data as Program[];
};

// Obtener programación por día de la semana
export const getProgrammingByDay = async (dayOfWeek: string) => {
  const { data, error } = await supabase
    .from('programming')
    .select('*')
    .eq('day_of_week', dayOfWeek)
    .eq('active', true)
    .order('start_time', { ascending: true });

  if (error) {
    console.error(`Error fetching programming for ${dayOfWeek}:`, error);
    throw error;
  }

  return data as Program[];
};

// Obtener programación por tipo
export const getProgrammingByType = async (programType: string) => {
  const { data, error } = await supabase
    .from('programming')
    .select('*')
    .eq('program_type', programType)
    .eq('active', true)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error(`Error fetching programming by type ${programType}:`, error);
    throw error;
  }

  return data as Program[];
};

// Obtener estadísticas de programación
export const getProgrammingStats = async () => {
  try {
    // Obtener toda la programación para calcular estadísticas
    const allPrograms = await getProgramming();
    
    const stats = {
      total: allPrograms.length,
      active: allPrograms.filter(p => p.active).length,
      inactive: allPrograms.filter(p => !p.active).length,
      withImages: allPrograms.filter(p => p.image_url).length,
      withHosts: allPrograms.filter(p => p.host_name).length,
      byType: {
        music: allPrograms.filter(p => p.program_type === 'music').length,
        news: allPrograms.filter(p => p.program_type === 'news').length,
        talk: allPrograms.filter(p => p.program_type === 'talk').length,
        sports: allPrograms.filter(p => p.program_type === 'sports').length,
        variety: allPrograms.filter(p => p.program_type === 'variety').length,
      },
      byDay: {
        'lunes-viernes': allPrograms.filter(p => p.day_of_week === 'lunes-viernes').length,
        'sabados': allPrograms.filter(p => p.day_of_week === 'sabados').length,
        'domingos': allPrograms.filter(p => p.day_of_week === 'domingos').length,
      }
    };

    return stats;
  } catch (error) {
    console.error('Error getting programming stats:', error);
    throw error;
  }
};

// Obtener un programa por ID
export const getProgramById = async (id: number) => {
  const { data, error } = await supabase
    .from('programming')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching program with id ${id}:`, error);
    throw error;
  }

  return data as Program;
};

// Crear un nuevo programa
export const createProgram = async (program: Program) => {
  const { data, error } = await supabase
    .from('programming')
    .insert([program])
    .select();

  if (error) {
    console.error('Error creating program:', error);
    throw error;
  }

  return data[0] as Program;
};

// Actualizar un programa existente
export const updateProgram = async (id: number, program: Partial<Program>) => {
  const { data, error } = await supabase
    .from('programming')
    .update(program)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating program with id ${id}:`, error);
    throw error;
  }

  return data[0] as Program;
};

// Eliminar un programa
export const deleteProgram = async (id: number) => {
  const { error } = await supabase
    .from('programming')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting program with id ${id}:`, error);
    throw error;
  }

  return true;
};

// Activar/desactivar un programa
export const toggleProgramStatus = async (id: number, active: boolean) => {
  const { data, error } = await supabase
    .from('programming')
    .update({ active })
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error toggling program status with id ${id}:`, error);
    throw error;
  }

  return data[0] as Program;
};

// Subir una imagen para un programa
export const uploadProgramImage = async (file: File, path: string) => {
  try {
    // Validar el archivo primero
    if (!file) {
      throw new Error('No se ha seleccionado ningún archivo');
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Use JPG, PNG, GIF o WebP.');
    }

    // Validar tamaño del archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. El tamaño máximo es 5MB.');
    }

    // Intentar subir directamente primero
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`programs/${path}`, file);

    if (error) {
      console.error('Error uploading program image:', error);
      
      // Manejar errores específicos
      if (error.message.includes('Bucket not found') || error.message.includes('Invalid bucket')) {
        throw new Error('El almacenamiento no está configurado. Por favor, configure Supabase Storage manualmente o contacte al administrador.');
      } else if (error.message.includes('row-level security') || error.message.includes('RLS')) {
        throw new Error('Error de permisos. El bucket existe pero no tiene las políticas RLS configuradas correctamente.');
      } else if (error.message.includes('Duplicate')) {
        throw new Error('Ya existe una imagen con ese nombre. Intente con un nombre diferente.');
      } else if (error.message.includes('size')) {
        throw new Error('El archivo es demasiado grande.');
      } else if (error.message.includes('format') || error.message.includes('type')) {
        throw new Error('Formato de imagen no válido.');
      } else if (error.message.includes('permission')) {
        throw new Error('No tiene permisos para subir imágenes.');
      } else {
        throw new Error(`Error al subir la imagen: ${error.message}`);
      }
    }

    // Obtener URL pública de la imagen
    const { data: publicUrl } = supabase.storage
      .from('images')
      .getPublicUrl(`programs/${path}`);

    if (!publicUrl.publicUrl) {
      throw new Error('No se pudo obtener la URL pública de la imagen');
    }

    return publicUrl.publicUrl;
  } catch (error: any) {
    console.error('Error uploading program image:', error);
    throw error;
  }
};

// Función alternativa para usar un bucket existente o carpeta local
export const uploadProgramImageFallback = async (file: File, path: string) => {
  try {
    // Intentar subir a un bucket general o público
    const { data, error } = await supabase.storage
      .from('uploads') // Bucket genérico que podría existir
      .upload(`programming/${path}`, file);

    if (error) {
      console.error('Error uploading to fallback bucket:', error);
      // Como último recurso, devolver una URL base64 temporal
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = () => reject(new Error('Error al procesar la imagen'));
        reader.readAsDataURL(file);
      });
    }

    const { data: publicUrl } = supabase.storage
      .from('uploads')
      .getPublicUrl(`programming/${path}`);

    return publicUrl.publicUrl;
  } catch (error: any) {
    console.error('Error in fallback upload:', error);
    throw new Error('No se pudo subir la imagen. Intente más tarde.');
  }
};

// Eliminar imagen de un programa
export const deleteProgramImage = async (path: string) => {
  const { error } = await supabase.storage
    .from('images')
    .remove([`programs/${path}`]);

  if (error) {
    console.error('Error deleting program image:', error);
    throw error;
  }

  return true;
};

// Duplicar un programa
export const duplicateProgram = async (id: number) => {
  try {
    const originalProgram = await getProgramById(id);
    
    const newProgram: Program = {
      ...originalProgram,
      program_name: `${originalProgram.program_name} (Copia)`,
      active: false, // Las copias empiezan desactivadas
    };
    
    // Eliminar campos que no se deben duplicar
    delete newProgram.id;
    delete newProgram.created_at;
    delete newProgram.updated_at;
    
    return await createProgram(newProgram);
  } catch (error) {
    console.error(`Error duplicating program with id ${id}:`, error);
    throw error;
  }
};

// Obtener programación actual (programa que debería estar al aire ahora)
export const getCurrentProgram = async () => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  let dayFilter = currentDay;
  
  // Mapear días del español al formato de la BD
  const dayMapping: { [key: string]: string } = {
    'lunes': 'lunes-viernes',
    'martes': 'lunes-viernes', 
    'miércoles': 'lunes-viernes',
    'jueves': 'lunes-viernes',
    'viernes': 'lunes-viernes',
    'sábado': 'sabados',
    'domingo': 'domingos'
  };
  
  dayFilter = dayMapping[currentDay] || currentDay;

  const { data, error } = await supabase
    .from('programming')
    .select('*')
    .eq('day_of_week', dayFilter)
    .eq('active', true)
    .gte('end_time', currentTime)
    .lte('start_time', currentTime)
    .limit(1);

  if (error) {
    console.error('Error fetching current program:', error);
    throw error;
  }

  return data.length > 0 ? data[0] as Program : null;
};

// Obtener próximo programa
export const getNextProgram = async () => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  let dayFilter = currentDay;
  
  // Mapear días del español al formato de la BD
  const dayMapping: { [key: string]: string } = {
    'lunes': 'lunes-viernes',
    'martes': 'lunes-viernes', 
    'miércoles': 'lunes-viernes',
    'jueves': 'lunes-viernes',
    'viernes': 'lunes-viernes',
    'sábado': 'sabados',
    'domingo': 'domingos'
  };
  
  dayFilter = dayMapping[currentDay] || currentDay;

  const { data, error } = await supabase
    .from('programming')
    .select('*')
    .eq('day_of_week', dayFilter)
    .eq('active', true)
    .gt('start_time', currentTime)
    .order('start_time', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching next program:', error);
    throw error;
  }

  return data.length > 0 ? data[0] as Program : null;
};

// Función mejorada para verificar y configurar Supabase Storage
export const setupSupabaseStorage = async () => {
  try {
    // Verificar si el bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw new Error(`Error al verificar buckets: ${listError.message}`);
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'programming-images');
    
    if (!bucketExists) {
      // Intentar crear el bucket, pero manejar errores RLS
      try {
        const { error: createError } = await supabase.storage.createBucket('programming-images', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (createError) {
          if (createError.message.includes('row-level security') || createError.message.includes('RLS')) {
            throw new Error('No se puede crear el bucket automáticamente debido a políticas RLS. Debe configurarse manualmente desde Supabase Dashboard.');
          } else if (createError.message.includes('permission')) {
            throw new Error('No tiene permisos para crear buckets. Contacte al administrador o configure manualmente.');
          } else {
            throw new Error(`Error al crear bucket: ${createError.message}`);
          }
        }
      } catch (createError: any) {
        throw createError;
      }
    }

    return {
      success: true,
      message: bucketExists ? 'Bucket ya existe' : 'Bucket creado exitosamente',
      bucketExists: bucketExists ? 'exists' : 'created'
    };

  } catch (error: any) {
    console.error('Error setting up Supabase Storage:', error);
    return {
      success: false,
      message: error.message || 'Error al configurar almacenamiento',
      error: error,
      requiresManualSetup: error.message?.includes('RLS') || error.message?.includes('permission')
    };
  }
};

// Función para verificar el estado del almacenamiento
export const checkStorageStatus = async () => {
  try {
    // Verificar existencia del bucket 'images' listando la carpeta 'programs'
    const { error } = await supabase.storage.from('images').list('programs', { limit: 1 });
    if (!error) {
      return { configured: true };
    }
    const msg = (error as any)?.message?.toLowerCase() || '';
    if (msg.includes('not found') || msg.includes('no such')) {
      return { configured: false, error: 'El bucket images no existe' };
    }
    if (msg.includes('row level') || msg.includes('rls')) {
      // El bucket existe pero falta SELECT público; para el dashboard lo consideramos presente
      return { configured: true };
    }
    return { configured: false, error: (error as any)?.message || 'Error verificando almacenamiento' };
  } catch (error: any) {
    return { configured: false, error: error.message };
  }
};