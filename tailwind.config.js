/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glowPulse: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "50%": { opacity: "0.3", transform: "scale(1.05)" },
          "100%": { opacity: "0.2", transform: "scale(1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-out forwards",
        slideDown: "slideDown 0.8s ease-out forwards",
        glowPulse: "glowPulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};