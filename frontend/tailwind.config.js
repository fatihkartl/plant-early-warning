/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // dark mode class tabanlı
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Inter font fallback’lı
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Arial'],
      },
      // Hafif pastel ve akıcı bir palet
      colors: {
        brand: {
          50:  "#eefcf7",
          100: "#d6f7ec",
          200: "#b0efd9",
          300: "#84e6c5",
          400: "#56d8ae",
          500: "#2ccf9b",  // primary
          600: "#1eb384",
          700: "#188d69",
          800: "#136e54",
          900: "#0e5441"
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.06)",
      },
      backgroundImage: {
        'soft-gradient': 'linear-gradient(135deg, #f5f9ff 0%, #f8fffb 100%)',
        'soft-gradient-dark': 'linear-gradient(135deg, #0b1220 0%, #0f1a2b 100%)',
      }
    },
  },
  plugins: [],
}
