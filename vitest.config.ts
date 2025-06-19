import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    environment: 'jsdom'
  },
  resolve: {
    alias: {
      '@db': resolve(__dirname, 'packages/db/src/index.ts'),
      '@db/*': resolve(__dirname, 'packages/db/src') + '/*',
      '@ui': resolve(__dirname, 'packages/ui/src/index.ts'),
      '@ui/*': resolve(__dirname, 'packages/ui/src') + '/*',
      '@supabase/supabase-js': resolve(__dirname, 'packages/db/node_modules/@supabase/supabase-js'),
      react: resolve(__dirname, 'apps/web/node_modules/react'),
      'react/jsx-dev-runtime': resolve(__dirname, 'apps/web/node_modules/react/jsx-dev-runtime')
    }
  }
});
