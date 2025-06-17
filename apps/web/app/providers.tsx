'use client';

import { ThemeProvider } from 'next-themes';
import { SidebarProvider } from '@/components/sidebar/context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseProvider } from '@/lib/supabase-provider';
import React from 'react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SupabaseProvider>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider>{children}</SidebarProvider>
        </QueryClientProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
} 