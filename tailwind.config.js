/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
            colors: {
        // Paleta z portretu Viktorii: kremowa marynarka, ciepłe tło, karmelowe włosy.
        ink: { DEFAULT: '#3A302A', line: '#5A4C42' },
        plaster: '#EFE9E1',
        paper: '#F8F5F0',
        stone: '#DCD1C4',
        graphite: '#4A3F37',
        mist: '#8C7B70',
        brass: { DEFAULT: '#A87A52', light: '#D2A884' },
      },
      fontFamily: {
        display: ['"Unbounded Variable"', 'Unbounded', 'system-ui', 'sans-serif'],
        sans: ['"Onest Variable"', 'Onest', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site: 'min(92vw, 1600px)',
        prose: '62ch',
      },
      fontSize: {
        hero: ['clamp(2.5rem, 6.4vw, 7rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        display: ['clamp(2rem, 4vw, 3.75rem)', { lineHeight: '1.06', letterSpacing: '-0.025em' }],
        lead: ['clamp(1.375rem, 2.3vw, 2.25rem)', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
      },
      keyframes: {
        'draw-x': { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        'draw-y': { '0%': { transform: 'scaleY(0)' }, '100%': { transform: 'scaleY(1)' } },
        rise: { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'none' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        'draw-x': 'draw-x 1.1s cubic-bezier(.65,0,.35,1) both',
        'draw-y': 'draw-y 1.1s cubic-bezier(.65,0,.35,1) both',
        rise: 'rise .9s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fade-in .3s ease-out both',
      },
    },
  },
  plugins: [],
};
