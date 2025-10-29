import { supabase } from './supabaseClient';

export type StorageStatus = {
  bucketExists: boolean;
};

const PROGRAMMING_BUCKET_NAME = 'images';

export async function checkProgrammingBucket(): Promise<StorageStatus> {
  // Verificar existencia intentando listar contenidos (no requiere clave de servicio)
  const { data, error } = await supabase.storage.from(PROGRAMMING_BUCKET_NAME).list('programs', { limit: 1 });
  if (!error) {
    return { bucketExists: true };
  }
  const msg = (error as any)?.message || '';
  if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no such')) {
    return { bucketExists: false };
  }
  // Si es error RLS, el bucket existe pero falta política de SELECT
  if (msg.toLowerCase().includes('row level') || msg.toLowerCase().includes('rls')) {
    return { bucketExists: true };
  }
  throw new Error(msg || 'Error verificando bucket');
}

export async function createProgrammingBucket(): Promise<void> {
  // La creación de buckets requiere Service Role Key (lado servidor o Dashboard)
  throw new Error('La creación automática del bucket requiere Service Role. Cree el bucket en Supabase Dashboard y aplique las políticas SQL indicadas.');
}

export function getManualPolicySql(): string {
  return `-- Políticas para bucket 'images' (uso general)\nCREATE POLICY "images select public" ON storage.objects FOR SELECT TO public USING (bucket_id = 'images');\nCREATE POLICY "images insert authenticated" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');\nCREATE POLICY "images update authenticated" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');\nCREATE POLICY "images delete authenticated" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'images');`;
}

export const STORAGE_DASHBOARD_URL = 'https://supabase.com/dashboard';


