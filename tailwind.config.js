/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        // Folio reflows the sidebar/grids at 860px; `folio:` ≈ this breakpoint.
        folio: '860px',
      },
      colors: {
        app: '#FAFAF9',
        surface: { DEFAULT: '#FFFFFF', hover: '#FCFCFB', muted: '#F4F4F2' },
        border: { DEFAULT: '#EEEEEC', strong: '#E4E4E7', faint: '#F7F7F5' },
        ink: {
          DEFAULT: '#18181B',
          secondary: '#3F3F46',
          muted: '#52525B',
          subtle: '#71717A',
          faint: '#A1A1AA',
        },
        primary: { DEFAULT: '#059669', hover: '#047857', tint: '#ECFDF5', text: '#065F46' },
        success: { DEFAULT: '#10B981', bg: '#ECFDF5', text: '#047857' },
        warning: { DEFAULT: '#F59E0B', bg: '#FFFBEB', text: '#B45309' },
        danger: { DEFAULT: '#DC2626', hover: '#B91C1C', tint: '#FEF2F2' },
      },
      fontFamily: {
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        md: '10px',
        card: '16px',
        'card-sm': '14px',
        'card-lg': '18px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04)',
        'primary-btn': '0 1px 2px rgba(5,150,105,.25)',
        logo: '0 3px 9px rgba(5,150,105,.3)',
        auth: '0 1px 2px rgba(16,24,40,.04), 0 8px 28px -12px rgba(16,24,40,.10)',
        modal: '0 20px 50px -16px rgba(16,24,40,.32)',
        toast: '0 10px 30px -8px rgba(0,0,0,.4)',
        segment: '0 1px 2px rgba(16,24,40,.10)',
      },
      keyframes: {
        folioFade: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        folioPop: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(.98)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        folioOverlay: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        folioShimmer: {
          '0%': { backgroundPosition: '-450px 0' },
          '100%': { backgroundPosition: '450px 0' },
        },
      },
      animation: {
        folioFade: 'folioFade .5s ease both',
        folioPop: 'folioPop .2s ease both',
        folioOverlay: 'folioOverlay .15s ease both',
        folioShimmer: 'folioShimmer 1.4s infinite linear',
      },
    },
  },
  plugins: [],
};
