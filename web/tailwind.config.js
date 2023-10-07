/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'mango': {
          '50': '#fffbea',
          '100': '#fff4c5',
          '200': '#ffe887',
          '300': '#ffd648',
          '400': '#ffc21e',
          '500': '#fca004',
          '600': '#e07800',
          '700': '#b95204',
          '800': '#963f0a',
          '900': '#7b340c',
          '950': '#471901',
        },
      }
    },
  },
  plugins: [],
}

