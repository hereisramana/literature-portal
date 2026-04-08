/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        lit: {
          dark: '#1C2621',
          medium: '#3A403B',
          grey: '#8C8C87',
          muted: '#BFBCB4',
          bg: '#F2EDE4'
        }
      }
    }
  },
  plugins: []
};
