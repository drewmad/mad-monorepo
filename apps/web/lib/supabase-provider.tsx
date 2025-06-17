'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabaseBrowser } from './supabase-browser';
import type { User } from '@supabase/supabase-js';

type SupabaseContext = {
  user: User | null;
  loading: boolean;
};

const Context = createContext<SupabaseContext>({ user: null, loading: true });

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = supabaseBrowser();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <Context.Provider value={{ user, loading }}>
      {children}
    </Context.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }
  return context;
}; 