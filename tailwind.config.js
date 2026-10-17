/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/src/**/*.{js,jsx}", "./client/dist/index.html"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#FFD700",
          50: "#FFFBE6",
          100: "#FFF4B8",
          200: "#FFEC80",
          300: "#FFE44D",
          400: "#FFDD26",
          500: "#FFD700",
          600: "#E6C200",
          700: "#BFA000",
        },
        ink: "#000000",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)",
        "card-hover": "0 2px 4px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
