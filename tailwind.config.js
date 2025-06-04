/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
             'primary': '#27262B', // Example of adding a new color
           },
    },
  },
  plugins: [],

}

