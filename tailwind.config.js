/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#070a12",
        cyanGlow: "#22d3ee",
        limeGlow: "#a3e635",
        roseGlow: "#fb7185"
      },
      boxShadow: {
        neon: "0 0 34px rgba(34, 211, 238, 0.18)",
        "neon-lime": "0 0 34px rgba(163, 230, 53, 0.14)",
        "neon-rose": "0 0 34px rgba(251, 113, 133, 0.14)"
      }
    }
  },
  plugins: []
};
