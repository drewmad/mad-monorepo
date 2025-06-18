import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@mad/db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only throw error at runtime, not during build
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined' || process.env.VERCEL_ENV === 'production') {
    throw new Error('Missing required Supabase environment variables')
  }
  // During build time or development, create a placeholder client
  console.warn('Missing Supabase environment variables, using placeholder client')
}

export const createClient = () =>
  createBrowserClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
  );

// Legacy export for backward compatibility
export const supabaseBrowser = createClient; 