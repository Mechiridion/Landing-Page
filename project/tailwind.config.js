/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'rgba(var(--color-primary-light), <alpha-value>)',
          DEFAULT: 'rgba(var(--color-primary), <alpha-value>)',
          dark: 'rgba(var(--color-primary-dark), <alpha-value>)',
        },
        secondary: {
          light: 'rgba(var(--color-secondary-light), <alpha-value>)',
          DEFAULT: 'rgba(var(--color-secondary), <alpha-value>)',
          dark: 'rgba(var(--color-secondary-dark), <alpha-value>)',
        },
        success: 'rgba(var(--color-success), <alpha-value>)',
        warning: 'rgba(var(--color-warning), <alpha-value>)',
        error: 'rgba(var(--color-error), <alpha-value>)',
      },
      spacing: {
        '128': '32rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulse: 'pulse 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}