import type { News } from './newsService';

// Fechas de publicación ordenadas desde la más reciente a la más antigua
const dates = [
  new Date().toISOString(),
  new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
];

// Noticias ficticias
export const mockNews: News[] = [
  {
    id: 1,
    title: "Radio Cuenca Cañera celebra su 25º aniversario con un festival de música en vivo",
    content: "Este fin de semana, Radio Cuenca Cañera 94.5FM celebrará su 25º aniversario con un gran festival de música en vivo que reunirá a artistas locales y nacionales. El evento, que tendrá lugar en la Plaza Central, contará con más de 10 horas de música ininterrumpida, puestos de comida y actividades para toda la familia. Los asistentes podrán disfrutar de géneros que van desde el folclore tradicional hasta ritmos contemporáneos. La entrada es gratuita y toda la comunidad está invitada a celebrar este importante hito para la emisora que ha acompañado a varias generaciones.",
    image_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2370&auto=format&fit=crop",
    publish_date: dates[0],
    created_at: dates[0],
  },
  {
    id: 2,
    title: "Entrevista exclusiva con el reconocido cantante local Martín Suárez",
    content: "En una entrevista exclusiva para Radio Cuenca Cañera, el reconocido cantante local Martín Suárez habló sobre su próximo disco, inspirado en los sonidos tradicionales de nuestra región. 'Volver a las raíces es fundamental para crear música auténtica', nos comentó el artista. Además, anunció una serie de presentaciones en distintos puntos de la provincia. La entrevista completa se transmitirá este domingo a las 20:00hs en nuestro programa 'Voces de la Región'. No te pierdas la oportunidad de conocer más sobre el proceso creativo de uno de los músicos más queridos de la zona.",
    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2370&auto=format&fit=crop",
    publish_date: dates[1],
    created_at: dates[1],
  },
  {
    id: 3,
    title: "Nueva programación musical llega a Radio Cuenca Cañera para la temporada primavera-verano",
    content: "Radio Cuenca Cañera 94.5FM renueva su parrilla de programación musical para la temporada primavera-verano, incorporando nuevos segmentos y ampliando el horario de los programas más escuchados. Entre las novedades, destaca 'Amanecer Folklórico', que se emitirá de lunes a viernes de 6:00 a 8:00hs, y 'Noche de Clásicos', los viernes y sábados de 22:00 a 00:00hs. La nueva programación responde a las preferencias expresadas por los oyentes a través de nuestras redes sociales y busca ofrecer una mayor variedad de géneros musicales a lo largo del día.",
    image_url: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=2370&auto=format&fit=crop",
    publish_date: dates[2],
    created_at: dates[2],
  },
  {
    id: 4,
    title: "Radio Cuenca Cañera lanza su nueva aplicación móvil para escuchar la radio desde cualquier lugar",
    content: "Con el objetivo de adaptarse a las nuevas tecnologías y llegar a más oyentes, Radio Cuenca Cañera 94.5FM ha lanzado su nueva aplicación móvil, disponible de forma gratuita para dispositivos Android e iOS. La app permite escuchar la programación en directo, acceder a contenidos exclusivos, participar en concursos y recibir notificaciones sobre los programas favoritos. 'Queremos que nuestros oyentes puedan llevar la radio consigo a donde quieran', explicó el director de la emisora, quien destacó que la aplicación también incluirá podcasts y entrevistas que no se transmiten en la programación regular.",
    image_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2374&auto=format&fit=crop",
    publish_date: dates[3],
    created_at: dates[3],
  },
  {
    id: 5,
    title: "Exitoso concurso de talentos musicales organizado por Radio Cuenca Cañera",
    content: "El pasado fin de semana se llevó a cabo la final del concurso 'Nuevas Voces', organizado por Radio Cuenca Cañera 94.5FM, en el que participaron más de 30 talentos musicales de la región. La ganadora fue Laura Méndez, de 19 años, quien impresionó al jurado con su interpretación de clásicos del folklore. Como premio, Laura grabará un sencillo en un estudio profesional y tendrá la oportunidad de presentarse en eventos organizados por la radio durante todo el año. El segundo y tercer lugar fueron para Miguel Torres y el dúo 'Hermanas Flores', respectivamente. El concurso contó con una gran asistencia de público y se transmitió en vivo por nuestra señal.",
    image_url: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=2369&auto=format&fit=crop",
    publish_date: dates[4],
    created_at: dates[4],
  },
  {
    id: 6,
    title: "Radio Cuenca Cañera inaugura nueva campaña solidaria para ayudar a escuelas rurales",
    content: "Radio Cuenca Cañera 94.5FM ha lanzado la campaña 'Ondas de Solidaridad', una iniciativa que busca recolectar útiles escolares, libros y equipamiento informático para escuelas rurales de la zona. La campaña, que se extenderá durante todo el mes, invita a los oyentes a acercarse a la sede de la radio para realizar sus donaciones. 'Las escuelas rurales enfrentan muchos desafíos y queremos poner nuestro granito de arena para que los niños tengan mejores condiciones de aprendizaje', comentó la directora de contenidos de la emisora. Además, se realizarán jornadas especiales de recaudación con la participación de artistas locales.",
    image_url: "https://images.unsplash.com/photo-1503676382389-4809596d5290?q=80&w=2476&auto=format&fit=crop",
    publish_date: dates[5],
    created_at: dates[5],
  },
  {
    id: 7,
    title: "Reconocido locutor se incorpora al equipo de Radio Cuenca Cañera",
    content: "Radio Cuenca Cañera 94.5FM da la bienvenida a Carlos Rivas, reconocido locutor con más de 20 años de trayectoria en medios nacionales, quien se incorpora al equipo para conducir el nuevo programa matutino 'Buenos Días, Región'. Rivas, quien es oriundo de nuestra ciudad pero ha desarrollado su carrera en grandes emisoras del país, regresa a sus raíces con la intención de aportar su experiencia y conocimiento del medio. 'Volver a mi tierra y a una radio tan querida como Cuenca Cañera es un sueño hecho realidad', expresó el locutor, quien comenzará sus emisiones el próximo lunes de 8:00 a 10:00hs.",
    image_url: "https://images.unsplash.com/photo-1588497859490-85d1c17db96d?q=80&w=2370&auto=format&fit=crop",
    publish_date: dates[6],
    created_at: dates[6],
  },
  {
    id: 8,
    title: "Radio Cuenca Cañera inicia nuevo programa especializado en música folclórica",
    content: "A partir de este mes, Radio Cuenca Cañera 94.5FM incorpora a su programación 'Raíces Musicales', un espacio dedicado íntegramente a la difusión y preservación de la música folclórica de nuestra región y el país. El programa, que se emitirá los domingos de 16:00 a 18:00hs, estará conducido por el investigador musical Juan Fernández, quien compartirá anécdotas, historia y curiosidades sobre los artistas y las canciones emblemáticas de nuestro folklore. 'Queremos que las nuevas generaciones conozcan y valoren este patrimonio cultural tan importante', señaló Fernández, quien además adelantó que el programa contará con entrevistas a músicos legendarios y emergentes.",
    image_url: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=2374&auto=format&fit=crop",
    publish_date: dates[7],
    created_at: dates[7],
  },
  {
    id: 9,
    title: "Radio Cuenca Cañera recibe premio a la mejor emisora regional",
    content: "En una emotiva ceremonia celebrada anoche, Radio Cuenca Cañera 94.5FM recibió el premio a la 'Mejor Emisora Regional' en los Premios Nacionales de Radio 2023. El galardón reconoce la labor de la emisora en la difusión cultural, el compromiso con la comunidad y la calidad de su programación. 'Este premio pertenece a nuestros oyentes, quienes nos han acompañado durante tantos años', expresó el director de la radio al recibir el reconocimiento. La competencia fue reñida, con emisoras de todo el país participando en diferentes categorías. El jurado destacó especialmente los programas comunitarios y educativos de Radio Cuenca Cañera.",
    image_url: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=2374&auto=format&fit=crop",
    publish_date: dates[8],
    created_at: dates[8],
  },
  {
    id: 10,
    title: "Gran concierto benéfico organizado por Radio Cuenca Cañera reúne a miles de personas",
    content: "El concierto benéfico 'Música por la Vida', organizado por Radio Cuenca Cañera 94.5FM, superó todas las expectativas al reunir a más de 5,000 personas en el estadio municipal. El evento, que contó con la participación de artistas nacionales e internacionales, logró recaudar fondos para la renovación del ala pediátrica del hospital local. 'Estamos muy emocionados por la respuesta del público y la solidaridad mostrada', comentó la coordinadora del evento. Los asistentes disfrutaron de más de seis horas de música en vivo, con estilos que iban desde el folklore hasta el rock. Radio Cuenca Cañera agradeció a todos los artistas que participaron de forma gratuita y a los patrocinadores que hicieron posible el evento.",
    image_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2370&auto=format&fit=crop",
    publish_date: dates[9],
    created_at: dates[9],
  }
];

// Función mock para obtener todas las noticias
export const getMockNews = async (): Promise<News[]> => {
  // Simulamos un pequeño retraso como en una API real
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockNews);
    }, 800);
  });
};

// Función mock para obtener una noticia por ID
export const getMockNewsById = async (id: number): Promise<News> => {
  const news = mockNews.find(item => item.id === id);
  
  if (!news) {
    throw new Error(`No se encontró la noticia con ID ${id}`);
  }
  
  // Simulamos un pequeño retraso como en una API real
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(news);
    }, 500);
  });
}; 