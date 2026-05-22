/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#212842',
          dark: '#141829',
          card: '#1b2138',
          light: '#2c3658',
          hover: '#384570',
          text: '#f1f5f9',
          border: '#334155',
        },
        vanilla: {
          DEFAULT: '#F0E7D5',
          dark: '#dcd0b8',
          light: '#f7f4ee',
          text: '#1e293b',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
