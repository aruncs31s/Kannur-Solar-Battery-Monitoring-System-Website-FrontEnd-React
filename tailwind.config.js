/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Nord color palette
        nord: {
          0: '#2E3440', // Darkest
          1: '#3B4252', // Dark
          2: '#434C5E', // Dark gray
          3: '#4C566A', // Gray
          4: '#D8DEE9', // Light gray
          5: '#E5E9F0', // Lighter gray
          6: '#ECEFF4', // Lightest
          7: '#8FBCBB', // Frost cyan
          8: '#88C0D0', // Cyan
          9: '#81A1C1', // Blue
          10: '#5E81AC', // Dark blue
          11: '#BF616A', // Red
          12: '#D08770', // Orange
          13: '#EBCB8B', // Yellow
          14: '#A3BE8C', // Green
          15: '#B48EAD', // Purple
        },
        // Semantic colors using Nord
        primary: {
          50: '#ECEFF4',
          100: '#D8DEE9',
          200: '#88C0D0',
          300: '#81A1C1',
          400: '#5E81AC',
          500: '#5E81AC',
          600: '#4C566A',
          700: '#434C5E',
          800: '#3B4252',
          900: '#2E3440',
        },
        secondary: {
          50: '#ECEFF4',
          100: '#E5E9F0',
          200: '#8FBCBB',
          300: '#88C0D0',
          400: '#81A1C1',
          500: '#81A1C1',
          600: '#5E81AC',
          700: '#4C566A',
          800: '#434C5E',
          900: '#3B4252',
        },
        success: '#A3BE8C',
        warning: '#EBCB8B',
        error: '#BF616A',
        info: '#88C0D0',
      },
    },
  },
  plugins: [],
}
