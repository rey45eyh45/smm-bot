/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        telegram: {
          bg: 'var(--tg-theme-bg-color, #1a1a2e)',
          secondary: 'var(--tg-theme-secondary-bg-color, #16213e)',
          text: 'var(--tg-theme-text-color, #ffffff)',
          hint: 'var(--tg-theme-hint-color, #8b8b8b)',
          link: 'var(--tg-theme-link-color, #6c63ff)',
          button: 'var(--tg-theme-button-color, #6c63ff)',
          buttonText: 'var(--tg-theme-button-text-color, #ffffff)',
        },
        primary: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          200: '#c7c7ff',
          300: '#a3a3ff',
          400: '#8080ff',
          500: '#6c63ff',
          600: '#5a4fff',
          700: '#4d3feb',
          800: '#3f33c4',
          900: '#352f9c',
        },
        dark: {
          100: '#1e1e2f',
          200: '#1a1a2e',
          300: '#16213e',
          400: '#0f0f23',
          500: '#0a0a1a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(108, 99, 255, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
