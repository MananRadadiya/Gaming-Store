// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class", // Required for your Redux dark mode toggle

  theme: {
    extend: {
      colors: {
        nexus: {
          dark: "#050505",      // Deep background
          card: "#0A0A0A",      // Card background
          surface: "#121212",   // Section background
          accent: "#00FF88",    // Neon green
          cyan: "#00E0FF",
          purple: "#BD00FF",
        },
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      backgroundImage: {
        "premium-gradient":
          "linear-gradient(to right, #00FF88, #00E0FF)",
        "radial-fade":
          "radial-gradient(circle at center, rgba(0,255,136,0.15), transparent 70%)",
      },

      boxShadow: {
        glow: "0 0 25px rgba(0,255,136,0.4)",
        "glow-lg": "0 0 60px rgba(0,255,136,0.5)",
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSlow: "pulse 4s ease-in-out infinite",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },

  plugins: [],
};
