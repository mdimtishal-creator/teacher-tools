/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Purane tokens (WAISE HI) ---
        primary: {
          DEFAULT: '#2563eb',
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
        },
        secondary: '#f8fafc',
        dark: '#1e293b',

        // --- Naye tokens (sirf add) ---
        surface: {
          DEFAULT: '#ffffff',
          muted:   '#f8fafc',
          hover:   '#f1f5f9',
        },
        border: {
          DEFAULT: '#e2e8f0',
          strong:  '#cbd5e1',
        },
        'text-base': '#1e293b',   // 'text' Tailwind mein reserved hai, isliye 'text-base'
        'text-muted': '#64748b',
        'text-subtle': '#94a3b8',
        success: { DEFAULT: '#16a34a', bg: '#f0fdf4' },
        warning: { DEFAULT: '#d97706', bg: '#fffbeb' },
        danger:  { DEFAULT: '#dc2626', bg: '#fef2f2' },
        info:    { DEFAULT: '#0891b2', bg: '#ecfeff' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        card: '0.75rem',
        modal: '1rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.07)',
        modal: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}
