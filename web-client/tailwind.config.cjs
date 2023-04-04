/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    fontFamily: {
      merriweather: ["Merriweather", "serif"],
      lato: ["Lato", "san-serif"],
    },
    screens: {
      md: "1024px",
      lg: "1440px",
    },
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
