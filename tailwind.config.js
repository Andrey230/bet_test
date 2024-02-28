/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      agora: {
        "primary": "#2a75a5",
        "secondary": "#df301b",
        "accent": "#e19110",
        //"warning": "#e19110",
        "neutral": "#16181e",
        "base-100": "#ffffff",
        "base-300": "#efe4d0",
        "secondary-content" : "#f5b027",
        "info" : "#f5b027"
      },
    }],
  },
}

