import { createClient } from '@supabase/supabase-js';
import type { Database } from '@mad/db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only throw error at runtime, not during build
if (!supabaseUrl || !supabaseServiceRoleKey) {
    if (typeof window !== 'undefined' || process.env.VERCEL_ENV === 'production') {
        throw new Error('Missing required Supabase environment variables');
    }
    // During build time or development, create a placeholder client
    console.warn('Missing Supabase environment variables, using placeholder client');
}

export const supabaseAdmin = createClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseServiceRoleKey || 'placeholder-key',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
); 