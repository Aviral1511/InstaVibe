/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: '0.5rem', // Default value
        md: '0.375rem',
        sm: '0.25rem'
      },
      colors: {}
    }
  },
  // eslint-disable-next-line no-undef
  plugins: [require("tailwindcss-animate")],
}
