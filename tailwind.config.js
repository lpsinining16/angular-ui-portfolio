/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Define 'light' and 'dark' as nested objects
        light: {
          bg: '#FFFBFE',
          surface: '#FFFFFF',
          primary: '#6750A4',
          'primary-container': '#EADDFF',
          text: '#1C1B1F',
        },
        dark: {
          bg: '#1C1B1F',
          surface: '#2A292E',
          primary: '#D0BCFF',
          'primary-container': '#4F378B',
          text: '#E6E1E5',
        },
      },
    },
  },
  plugins: [],
};
