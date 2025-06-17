import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
};

export default config; 