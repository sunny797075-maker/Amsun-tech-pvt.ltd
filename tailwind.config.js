/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Poppins", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        navy: {
          950: "#06111f",
          900: "#071a33",
          800: "#0b2547",
          700: "#123966",
        },
        cyanbrand: {
          500: "#09d3f2",
          400: "#39e4ff",
          300: "#8cf3ff",
        },
        steel: "#111827",
      },
      boxShadow: {
        glow: "0 24px 70px rgba(9, 211, 242, 0.22)",
        enterprise: "0 20px 60px rgba(2, 10, 24, 0.14)",
      },
      backgroundImage: {
        "mesh-dark":
          "radial-gradient(circle at 10% 20%, rgba(9,211,242,.22), transparent 32%), radial-gradient(circle at 85% 12%, rgba(37,99,235,.22), transparent 28%), linear-gradient(135deg, #06111f 0%, #071a33 50%, #0b2547 100%)",
      },
    },
  },
  plugins: [],
};
