/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Charte graphique PNFC2025
        primary: '#0055A4',      // Bleu Francophonie
        accent: '#F58220',       // Orange vif
        'bg-light': '#f6f7f8',
        'bg-dark': '#101722',
        'gray-light': '#f3f4f6',   // slate-100
        'gray-medium': '#e2e8f0',  // slate-200
        'gray-dark': '#1e293b',    // slate-800
        'gray-xdark': '#0f172a',   // slate-900
        'blue-sky': '#0ea5e9',
        'green': '#10b981',
        'red': '#ef4444',
      },
      fontFamily: {
        sans: ['Lexend', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        inter: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      transitionDuration: {
        'default': '200ms',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        pnfc: {
          // Charte graphique PNFC2025 personnalisée
          primary: '#0055A4',      // Bleu Francophonie
          secondary: '#F58220',   // Orange vif (accent)
          accent: '#F58220',      // Orange vif
          neutral: '#1e293b',     // gray-dark
          'base-100': '#ffffff',  // white
          'base-200': '#f6f7f8',  // bg-light
          'base-300': '#f3f4f6',  // gray-light
          info: '#0ea5e9',        // blue-sky
          success: '#10b981',      // green
          warning: '#F58220',     // accent
          error: '#ef4444',       // red
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
  },
};
