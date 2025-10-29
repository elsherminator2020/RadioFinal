import { supabase } from './supabaseClient';

export type Advertisement = {
  id?: number;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  position: 'header' | 'sidebar' | 'footer' | 'content' | 'popup';
  size: 'small' | 'medium' | 'large' | 'banner';
  priority: number; // 1-10, mayor número = mayor prioridad
  active: boolean;
  start_date?: string;
  end_date?: string;
  click_count: number;
  impression_count: number;
  advertiser_name?: string;
  advertiser_email?: string;
  advertiser_phone?: string;
  created_at?: string;
  updated_at?: string;
};

// Obtener todas las publicidades
export const getAdvertisements = async () => {
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching advertisements:', error);
    throw error;
  }

  return data as Advertisement[];
};

// Obtener publicidades activas
export const getActiveAdvertisements = async () => {
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .eq('active', true)
    .order('priority', { ascending: false });

  if (error) {
    console.error('Error fetching active advertisements:', error);
    throw error;
  }

  return data as Advertisement[];
};

// Obtener publicidades por posición
export const getAdvertisementsByPosition = async (position: string) => {
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .eq('position', position)
    .eq('active', true)
    .order('priority', { ascending: false });

  if (error) {
    console.error(`Error fetching advertisements for position ${position}:`, error);
    throw error;
  }

  return data as Advertisement[];
};

// Obtener publicidades con paginación
export const getAdvertisementsPaginated = async (page: number = 1, limit: number = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('advertisements')
    .select('*', { count: 'exact' })
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching paginated advertisements:', error);
    throw error;
  }

  return {
    data: data as Advertisement[],
    count: count || 0,
    totalPages: Math.ceil((count || 0) / limit)
  };
};

// Buscar publicidades por término
export const searchAdvertisements = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,advertiser_name.ilike.%${searchTerm}%`)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching advertisements:', error);
    throw error;
  }

  return data as Advertisement[];
};

// Obtener estadísticas de publicidades
export const getAdvertisementStats = async () => {
  try {
    const allAds = await getAdvertisements();
    
    const stats = {
      total: allAds.length,
      active: allAds.filter(ad => ad.active).length,
      inactive: allAds.filter(ad => !ad.active).length,
      byPosition: {
        header: allAds.filter(ad => ad.position === 'header').length,
        sidebar: allAds.filter(ad => ad.position === 'sidebar').length,
        footer: allAds.filter(ad => ad.position === 'footer').length,
        content: allAds.filter(ad => ad.position === 'content').length,
        popup: allAds.filter(ad => ad.position === 'popup').length,
      },
      bySize: {
        small: allAds.filter(ad => ad.size === 'small').length,
        medium: allAds.filter(ad => ad.size === 'medium').length,
        large: allAds.filter(ad => ad.size === 'large').length,
        banner: allAds.filter(ad => ad.size === 'banner').length,
      },
      totalClicks: allAds.reduce((sum, ad) => sum + ad.click_count, 0),
      totalImpressions: allAds.reduce((sum, ad) => sum + ad.impression_count, 0),
      thisWeek: allAds.filter(ad => {
        const createdDate = new Date(ad.created_at || '');
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate >= weekAgo;
      }).length,
      thisMonth: allAds.filter(ad => {
        const createdDate = new Date(ad.created_at || '');
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return createdDate >= monthAgo;
      }).length
    };

    return stats;
  } catch (error) {
    console.error('Error getting advertisement stats:', error);
    throw error;
  }
};

// Obtener una publicidad por ID
export const getAdvertisementById = async (id: number) => {
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching advertisement with id ${id}:`, error);
    throw error;
  }

  return data as Advertisement;
};

// Crear una nueva publicidad
export const createAdvertisement = async (advertisement: Advertisement) => {
  const { data, error } = await supabase
    .from('advertisements')
    .insert([advertisement])
    .select();

  if (error) {
    console.error('Error creating advertisement:', error);
    throw error;
  }

  return data[0] as Advertisement;
};

// Actualizar una publicidad existente
export const updateAdvertisement = async (id: number, advertisement: Partial<Advertisement>) => {
  const { data, error } = await supabase
    .from('advertisements')
    .update(advertisement)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating advertisement with id ${id}:`, error);
    throw error;
  }

  return data[0] as Advertisement;
};

// Eliminar una publicidad
export const deleteAdvertisement = async (id: number) => {
  const { error } = await supabase
    .from('advertisements')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting advertisement with id ${id}:`, error);
    throw error;
  }

  return true;
};

// Activar/desactivar una publicidad
export const toggleAdvertisementStatus = async (id: number, active: boolean) => {
  const { data, error } = await supabase
    .from('advertisements')
    .update({ active })
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error toggling advertisement status with id ${id}:`, error);
    throw error;
  }

  return data[0] as Advertisement;
};

// Subir una imagen para una publicidad
export const uploadAdvertisementImage = async (file: File, path: string) => {
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

    // Validar tamaño del archivo (máximo 10MB para publicidades)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. El tamaño máximo es 10MB.');
    }

    // Intentar subir directamente primero
    const { error } = await supabase.storage
      .from('images')
      .upload(`advertisements/${path}`, file);

    if (error) {
      console.error('Error uploading advertisement image:', error);
      
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
      .getPublicUrl(`advertisements/${path}`);

    if (!publicUrl.publicUrl) {
      throw new Error('No se pudo obtener la URL pública de la imagen');
    }

    return publicUrl.publicUrl;
  } catch (error: any) {
    console.error('Error uploading advertisement image:', error);
    throw error;
  }
};

// Eliminar imagen de una publicidad
export const deleteAdvertisementImage = async (path: string) => {
  const { error } = await supabase.storage
    .from('images')
    .remove([`advertisements/${path}`]);

  if (error) {
    console.error('Error deleting advertisement image:', error);
    throw error;
  }

  return true;
};

// Registrar un clic en una publicidad
export const recordAdvertisementClick = async (id: number) => {
  // Primero obtener el valor actual
  const { data: currentAd, error: fetchError } = await supabase
    .from('advertisements')
    .select('click_count')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error(`Error fetching advertisement ${id}:`, fetchError);
    throw fetchError;
  }

  // Incrementar el contador
  const { data, error } = await supabase
    .from('advertisements')
    .update({ click_count: (currentAd.click_count || 0) + 1 })
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error recording click for advertisement ${id}:`, error);
    throw error;
  }

  return data[0] as Advertisement;
};

// Registrar una impresión de una publicidad
export const recordAdvertisementImpression = async (id: number) => {
  // Primero obtener el valor actual
  const { data: currentAd, error: fetchError } = await supabase
    .from('advertisements')
    .select('impression_count')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error(`Error fetching advertisement ${id}:`, fetchError);
    throw fetchError;
  }

  // Incrementar el contador
  const { data, error } = await supabase
    .from('advertisements')
    .update({ impression_count: (currentAd.impression_count || 0) + 1 })
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error recording impression for advertisement ${id}:`, error);
    throw error;
  }

  return data[0] as Advertisement;
};

// Duplicar una publicidad
export const duplicateAdvertisement = async (id: number) => {
  try {
    const originalAd = await getAdvertisementById(id);
    
    const duplicatedAd: Advertisement = {
      ...originalAd,
      title: `Copia de ${originalAd.title}`,
      active: false, // Las copias empiezan desactivadas
      click_count: 0,
      impression_count: 0,
    };
    
    // Eliminar campos que no se deben duplicar
    delete duplicatedAd.id;
    delete duplicatedAd.created_at;
    delete duplicatedAd.updated_at;
    
    return await createAdvertisement(duplicatedAd);
  } catch (error) {
    console.error(`Error duplicating advertisement with id ${id}:`, error);
    throw error;
  }
};

// Obtener publicidades que están activas actualmente (dentro del rango de fechas)
export const getCurrentActiveAdvertisements = async () => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .eq('active', true)
    .or(`start_date.is.null,start_date.lte.${now}`)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .order('priority', { ascending: false });

  if (error) {
    console.error('Error fetching current active advertisements:', error);
    throw error;
  }

  return data as Advertisement[];
};

// Obtener publicidades que están próximas a expirar
export const getExpiringAdvertisements = async (daysAhead: number = 7) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .eq('active', true)
    .not('end_date', 'is', null)
    .lte('end_date', futureDate.toISOString())
    .order('end_date', { ascending: true });

  if (error) {
    console.error('Error fetching expiring advertisements:', error);
    throw error;
  }

  return data as Advertisement[];
};

