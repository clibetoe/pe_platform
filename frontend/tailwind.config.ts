import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ECF8FF",
          100: "#DFF1FF",
          200: "#B9E2FF",
          300: "#83CBFF",
          400: "#4FAAFF",
          500: "#1D8BFF",
          600: "#0F6FE0",
          700: "#0E56B3",
          800: "#0F457E",
          900: "#103763",
          950: "#081F3A",
        },
        accent: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        sport: {
          green: "#16a34a",
          orange: "#ea580c",
          gold: "#d97706",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-hover": "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)",
        floating: "0 20px 60px -10px rgba(15,111,224,0.22)",
        glow: "0 0 0 3px rgba(79,170,255,0.25)",
        "glow-accent": "0 0 0 3px rgba(16,185,129,0.25)",
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #103763 0%, #0F6FE0 52%, #10B981 100%)",
        "gradient-sport": "linear-gradient(135deg, #10B981 0%, #1D8BFF 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
