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
        // Vercel-inspired dark mode colors
        'dark-bg': '#000',
        'dark-fg': '#fff',
        'dark-accent': '#333',
        'dark-hover': '#222',
        // Macro colors
        'macro-carbs': '#dc2626', // red-600
        'macro-fat': '#92400e',   // amber-800
        'macro-protein': '#15803d' // green-700
      }
    },
  },
  plugins: [],
} 