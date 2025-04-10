/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'applied': '#60a5fa',
        'interview': '#fbbf24',
        'offer': '#34d399',
        'rejected': '#ef4444'
      },
    },
  },
  plugins: [],
}
