'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseProvider } from '@/lib/supabase-provider';
import { AppProvider } from '@/contexts/AppContext';
import { TimerProvider } from '@/contexts/TimerContext';
import { ModalManager } from '@/components/ModalManager';
import React from 'react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light"
      themes={['light', 'dark', 'glass', 'system']}
    >
      <SupabaseProvider>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <TimerProvider>
              {children}
              <ModalManager />
            </TimerProvider>
          </AppProvider>
        </QueryClientProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
} 