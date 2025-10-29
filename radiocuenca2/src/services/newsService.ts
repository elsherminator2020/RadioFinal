import { supabase } from './supabaseClient';

export type News = {
  id?: number;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  publish_date: string;
  created_at?: string;
};

// Obtener todas las noticias
export const getNews = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    throw error;
  }

  return data as News[];
};

// Obtener noticias con paginación
export const getNewsPaginated = async (page: number = 1, limit: number = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('news')
    .select('*', { count: 'exact' })
    .order('publish_date', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching paginated news:', error);
    throw error;
  }

  return {
    data: data as News[],
    count: count || 0,
    totalPages: Math.ceil((count || 0) / limit)
  };
};

// Buscar noticias por término
export const searchNews = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error searching news:', error);
    throw error;
  }

  return data as News[];
};

// Obtener noticias por rango de fechas
export const getNewsByDateRange = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .gte('publish_date', startDate)
    .lte('publish_date', endDate)
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching news by date range:', error);
    throw error;
  }

  return data as News[];
};

// Obtener noticias con imágenes
export const getNewsWithImages = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .not('image_url', 'is', null)
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching news with images:', error);
    throw error;
  }

  return data as News[];
};

// Obtener noticias con videos
export const getNewsWithVideos = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .not('video_url', 'is', null)
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching news with videos:', error);
    throw error;
  }

  return data as News[];
};

// Obtener estadísticas de noticias
export const getNewsStats = async () => {
  try {
    // Obtener todas las noticias para calcular estadísticas
    const allNews = await getNews();
    
    const stats = {
      total: allNews.length,
      withImages: allNews.filter(n => n.image_url).length,
      withVideos: allNews.filter(n => n.video_url).length,
      onlyText: allNews.filter(n => !n.image_url && !n.video_url).length,
      thisWeek: allNews.filter(n => {
        const publishDate = new Date(n.publish_date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return publishDate >= weekAgo;
      }).length,
      thisMonth: allNews.filter(n => {
        const publishDate = new Date(n.publish_date);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return publishDate >= monthAgo;
      }).length
    };

    return stats;
  } catch (error) {
    console.error('Error getting news stats:', error);
    throw error;
  }
};

// Obtener una noticia por ID
export const getNewsById = async (id: number) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching news with id ${id}:`, error);
    throw error;
  }

  return data as News;
};

// Crear una nueva noticia
export const createNews = async (news: News) => {
  const { data, error } = await supabase
    .from('news')
    .insert([news])
    .select();

  if (error) {
    console.error('Error en Crear la Noticia(news):', error);
    throw error;
  }

  return data[0] as News;
};

// Actualizar una noticia existente
export const updateNews = async (id: number, news: Partial<News>) => {
  const { data, error } = await supabase
    .from('news')
    .update(news)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating news with id ${id}:`, error);
    throw error;
  }

  return data[0] as News;
};

// Eliminar una noticia
export const deleteNews = async (id: number) => {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting news with id ${id}:`, error);
    throw error;
  }

  return true;
};

// Subir una imagen para una noticia
export const uploadNewsImage = async (file: File, path: string) => {
  const { error } = await supabase.storage
    .from('images')
    .upload(`noticias/${path}`, file);

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Obtener URL pública de la imagen
  const { data: publicUrl } = supabase.storage
    .from('images')
    .getPublicUrl(`noticias/${path}`);

  return publicUrl.publicUrl;
};

// Eliminar imagen de una noticia
export const deleteNewsImage = async (path: string) => {
  const { error } = await supabase.storage
    .from('images')
    .remove([`noticias/${path}`]);

  if (error) {
    console.error('Error deleting image:', error);
    throw error;
  }

  return true;
};

// Obtener noticias recientes (últimas N noticias)
export const getRecentNews = async (limit: number = 5) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('publish_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent news:', error);
    throw error;
  }

  return data as News[];
};

// Duplicar una noticia (útil para crear noticias similares)
export const duplicateNews = async (id: number) => {
  try {
    const originalNews = await getNewsById(id);
    
    // Crear una copia con título modificado
    const duplicatedNews: News = {
      title: `Copia de ${originalNews.title}`,
      content: originalNews.content,
      image_url: originalNews.image_url,
      video_url: originalNews.video_url,
      publish_date: new Date().toISOString().split('T')[0], // Fecha actual
    };

    return await createNews(duplicatedNews);
  } catch (error) {
    console.error('Error duplicating news:', error);
    throw error;
  }
}; 