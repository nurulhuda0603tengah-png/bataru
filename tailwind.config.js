/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glass: "0 20px 80px rgba(15, 23, 42, 0.12)",
      },
      colors: {
        bataru: {
          50: "#eff7ef",
          100: "#d7edda",
          200: "#baddbe",
          300: "#95c8a0",
          400: "#5fa370",
          500: "#2f7f4f",
          600: "#246a42",
          700: "#1b5439",
          800: "#153f2d",
          900: "#0d2c21",
        },
      },
    },
  },
  plugins: [],
};
