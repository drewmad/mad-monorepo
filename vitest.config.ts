import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'apps/web/node_modules/react'),
      'react-dom': path.resolve(__dirname, 'apps/web/node_modules/react-dom'),
      '@': path.resolve(__dirname, 'apps/web'),
      '@/*': path.resolve(__dirname, 'apps/web/*'),
      'next/link': path.resolve(__dirname, 'apps/web/node_modules/next/dist/client/link.js'),
      'next/navigation': path.resolve(
        __dirname,
        'apps/web/node_modules/next/dist/client/components/navigation.js'
      ),
      '@ui': path.resolve(__dirname, 'packages/ui/src/index.ts'),
      '@ui/*': path.resolve(__dirname, 'packages/ui/src/*'),
      '@mad/db': path.resolve(__dirname, 'packages/db/src/index.ts'),
      '@mad/db/*': path.resolve(__dirname, 'packages/db/src/*'),
      '@mad/db/src/*': path.resolve(__dirname, 'packages/db/src/*'),
      '@mad/db/src': path.resolve(__dirname, 'packages/db/src')
    }
  },
  test: {
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    environment: 'jsdom',
    include: ['tests/**/*.ts?(x)'],
    exclude: ['tests/e2e/**', 'tests/setup.ts']
  }
});
