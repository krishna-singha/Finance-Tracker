/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#008080",   //Background Color: Teal 
        seconday: "#FF6F61", //Active Link/Highlight Color: Coral
        tertiary: "#333333"
      }
    },
  },
  plugins: [],
}

