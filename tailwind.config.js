/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          bg: '#FFF9DB',
          text: '#F08C00',
        },
        green: {
          bg: '#EBFBEE',
          text: '#40C057',
        },
        blue: {
          bg: '#E7F5FF',
          text: '#228BE6',
          border: '#D0EBFF',
        },
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      },
      animation: {
        shake: 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
      },
    },
  },
  plugins: [],
}
