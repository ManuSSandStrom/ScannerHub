/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 18px 60px rgba(15, 23, 42, 0.15)',
        card: '0 10px 35px rgba(15, 23, 42, 0.1)',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        pulseSoft: 'pulse-soft 2.4s ease-in-out infinite',
        slideUp: 'slide-up 0.45s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
