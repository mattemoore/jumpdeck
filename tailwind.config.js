const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.tsx'],
  darkMode: 'class',
  corePlugins: {
    container: false,
  },
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
      },
    },
    fontFamily: {
      serif: ['Bitter', 'serif'],
      sans: [
        'SF Pro Text',
        'Inter',
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
          600: '#040404',
          700: '#000',
        },
      },
    },
  },
  plugins: [customContainerPlugin, plugin(ellipisfyPlugin)],
};

function ellipisfyPlugin({ addUtilities }) {
  const styles = {
    '.ellipsify': {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'pre',
    },
  };

  addUtilities(styles);
}

function customContainerPlugin({ addComponents }) {
  addComponents({
    '.container': {
      '@screen lg': {
        maxWidth: '1024px',
      },
      '@screen xl': {
        maxWidth: '1166px',
      },
    },
  });
}
