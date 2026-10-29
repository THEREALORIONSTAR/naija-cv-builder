/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#ffffff",
        "canvas-soft": "#f6f5f4",
        ink: "#111111",
        "ink-secondary": "#31302e",
        "ink-muted": "#615d59",
        "ink-faint": "#8a8580",
        hairline: "#e6e6e6",
        accent: "#0075de",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
