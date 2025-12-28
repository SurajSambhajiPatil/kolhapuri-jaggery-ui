/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        leaf: "#2E7D32",
        jaggery: "#A05A2C",
        cream: "#FFF7ED"
      }
    }
  },
  plugins: []
};
