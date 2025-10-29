import { createClient } from '@supabase/supabase-js';

// Usar las variables de entorno para Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Las variables de entorno de Supabase no están configuradas correctamente.');
}

// Creación del cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos de autenticación
export type AuthSignInData = {
  email: string;
  password: string;
};

// Función para iniciar sesión
export const signIn = async ({ email, password }: AuthSignInData) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

// Función para cerrar sesión
export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Función para verificar el estado de autenticación
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
}; 