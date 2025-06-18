import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        glass: {
          50: 'rgba(255, 255, 255, 0.9)',
          100: 'rgba(255, 255, 255, 0.8)',
          200: 'rgba(255, 255, 255, 0.7)',
          300: 'rgba(255, 255, 255, 0.6)',
          400: 'rgba(255, 255, 255, 0.5)',
          500: 'rgba(255, 255, 255, 0.4)',
          600: 'rgba(255, 255, 255, 0.3)',
          700: 'rgba(255, 255, 255, 0.2)',
          800: 'rgba(255, 255, 255, 0.1)',
          900: 'rgba(255, 255, 255, 0.05)',
          dark: {
            50: 'rgba(17, 24, 39, 0.9)',
            100: 'rgba(17, 24, 39, 0.8)',
            200: 'rgba(17, 24, 39, 0.7)',
            300: 'rgba(17, 24, 39, 0.6)',
            400: 'rgba(17, 24, 39, 0.5)',
            500: 'rgba(17, 24, 39, 0.4)',
            600: 'rgba(17, 24, 39, 0.3)',
            700: 'rgba(17, 24, 39, 0.2)',
            800: 'rgba(17, 24, 39, 0.1)',
            900: 'rgba(17, 24, 39, 0.05)',
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};

export default config; 