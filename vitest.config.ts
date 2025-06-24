import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, 'packages/ui/src'),
      '@mad/db': path.resolve(__dirname, 'packages/db/src'),
      '@': path.resolve(__dirname, 'apps/web')
    }
  },
  test: {
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    environment: 'jsdom'
  }
});
