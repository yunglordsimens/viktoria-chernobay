/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Kontener rośnie razem z ekranem — bez martwych pasów na dużych monitorach.
      maxWidth: {
        site: 'min(92vw, 1680px)',
        'site-narrow': 'min(92vw, 1100px)',
      },
      fontSize: {
        // Płynna skala — skaluje się z viewportem zamiast skakać na breakpointach.
        hero: ['clamp(2.75rem, 9.5vw, 11rem)', { lineHeight: '1.02', letterSpacing: '-0.04em' }],
        display: ['clamp(1.875rem, 4.2vw, 4.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}
