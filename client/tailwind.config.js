/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "light-red": "#bf7671",
        "red": "#b82853",
        "pink": "#cc97d1",
        "yellow": "#ccbd39",
        "secondaryBG": "#c4c0c0",
        "primaryBG": "#e6e6e6",
        "pText": "#82807c",
        "blue": "#496ba6",
        "green": "#5fa361"
      },
    },
  },
  plugins: [require("daisyui")],
}

