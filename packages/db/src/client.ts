import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

export const createSupabaseClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false }
    }
  );

export let supabaseClient = createSupabaseClient();

export const setSupabaseClient = (
  client: typeof supabaseClient
) => {
  supabaseClient = client;
};

