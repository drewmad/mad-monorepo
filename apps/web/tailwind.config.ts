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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backdropBlur: {
        xs: '2px',
      },
    }
  },
  plugins: [require('@tailwindcss/forms')]
};

export default config;
