/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6255E7',
          light: '#F0EDFF',
          hover: '#5144D3',
        },
        background: '#F8F9FC',
        card: '#FFFFFF',
        'main-text': '#191A23',
        'secondary-text': '#777B89',
        border: '#E9EAF0',
        success: '#16A36A',
        warning: '#E9A23B',
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'dropdown': '0 8px 24px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
