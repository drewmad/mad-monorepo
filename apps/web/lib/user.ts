import { createClient } from './supabase-server';
import { redirect } from 'next/navigation';

export async function getSession() {
  const supabase = createClient();

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error in getSession:', error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  return session;
} 