import { createClient } from './supabase-server';
import { redirect } from 'next/navigation';

export async function getSession() {
  const supabase = createClient();

  try {
    // First get the session to check if user is logged in
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return null;
    }

    // Then verify the user with the auth server
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    // Return the verified session with the authenticated user
    return {
      ...session,
      user
    };
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
