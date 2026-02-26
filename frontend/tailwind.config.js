/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#789070',
          dark: '#5A6C54',
          light: '#A7B7A2'
        },
        hover: '#6C8265',
        active: '#667A5F',
        blackc: '#111111',
        'grey-light': '#F4F6F4',
        'grey-light-dark': '#E9EDE8',
        'grey-full-light': '#FAFBF9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
