/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'citizen-primary': '#3B82F6',
        'citizen-secondary': '#60A5FA',
        'citizen-dark': '#1E3A8A',
        'emergency-primary': '#EF4444',
        'emergency-secondary': '#F97316',
        'emergency-dark': '#991B1B',
        'admin-primary': '#8B5CF6',
        'admin-secondary': '#A78BFA',
        'admin-dark': '#6D28D9',
      },
    },
  },
  plugins: [],
}