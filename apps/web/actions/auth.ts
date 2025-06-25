'use server';

import { createClient } from '@/lib/supabase-server';

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { user: null, error: error.message };
    }
    return { user: data.user, error: null };
  } catch (err) {
    console.error('Sign in error:', err);
    return { user: null, error: 'Failed to sign in' };
  }
}

export async function signUp(email: string, password: string, name: string) {
  const supabase = createClient();
  const redirectTo = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/auth/callback`
    : 'http://localhost:3000/auth/callback';
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: redirectTo,
      },
    });
    if (error) {
      return { user: null, error: error.message };
    }
    return { user: data.user, error: null };
  } catch (err) {
    console.error('Sign up error:', err);
    return { user: null, error: 'Failed to sign up' };
  }
}

export async function signOut() {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    console.error('Sign out error:', err);
    return { error: 'Failed to sign out' };
  }
}
