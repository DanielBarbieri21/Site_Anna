/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f5f5f4',
          dark: '#020617',
        },
        surface: {
          light: '#ffffff',
          dark: '#020617',
        },
        olive: {
          DEFAULT: '#6b8f71',
          soft: '#a3b18a',
        },
        text: {
          soft: '#111827',
          muted: '#4b5563',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

