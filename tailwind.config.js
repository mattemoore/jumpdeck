const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      serif: ['serif'],
      sans: [
        'var(--font-family-sans)',
        'system-ui',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Ubuntu',
      ],
      monospace: [`SF Mono`, `ui-monospace`, `Monaco`, 'Monospace'],
    },
    extend: {
      colors: {
        primary: {
          ...colors.blue,
          contrast: '#fff',
        },
        black: {
          50: '#525252',
          100: '#363636',
          200: '#282828',
          300: '#222',
          400: '#121212',
          500: '#0a0a0a',
          600: '#050505',
          700: '#000',
        },
      },
    },
  },
};
