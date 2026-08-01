/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14213D",
          50: "#EEF1F7",
          100: "#D6DCEA",
          200: "#AEB9D5",
          300: "#8696C0",
          400: "#5E73AB",
          500: "#3B5290",
          600: "#233A6E",
          700: "#14213D",
          800: "#0E1730",
          900: "#080E1E",
        },
        paper: {
          DEFAULT: "#FAF7F0",
          dim: "#F1ECE0",
        },
        amber: {
          DEFAULT: "#FCA311",
          50: "#FFF6E5",
          100: "#FFE9BF",
          400: "#FDB737",
          500: "#FCA311",
          600: "#DA8A05",
        },
        teal: {
          DEFAULT: "#2A9D8F",
          50: "#E8F6F4",
          500: "#2A9D8F",
          600: "#1F796E",
        },
        coral: {
          DEFAULT: "#E63946",
          50: "#FDECED",
          500: "#E63946",
          600: "#C22733",
        },
        slate: {
          DEFAULT: "#64748B",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "dotted-ticket":
          "radial-gradient(circle, #D6DCEA 1.5px, transparent 1.5px)",
      },
    },
  },
  plugins: [],
};
