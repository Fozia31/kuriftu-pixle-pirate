/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#FBF8F1',
          100: '#F7F1E3',
          200: '#EEDFB9',
          300: '#E4CD8F',
          400: '#DAB965',
          500: '#C19A5B', // Core Revfine Gold
          600: '#AE8B52',
          700: '#876B3F',
          800: '#604C2D',
          900: '#392E1B',
        }
      }
    },
  },
  plugins: [],
}
