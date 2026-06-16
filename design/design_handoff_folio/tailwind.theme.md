# Tailwind Theme — Folio

Drop these into your `tailwind.config.js` (`theme.extend`). Tailwind v3 shown; for v4 translate to `@theme` CSS variables.

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app:        '#FAFAF9',
        surface: {
          DEFAULT: '#FFFFFF',
          hover:   '#FCFCFB',
          muted:   '#F4F4F2',
        },
        border: {
          DEFAULT: '#EEEEEC',
          strong:  '#E4E4E7',
          faint:   '#F7F7F5',
        },
        ink: {
          DEFAULT:   '#18181B', // primary text
          secondary: '#3F3F46',
          muted:     '#52525B',
          subtle:    '#71717A',
          faint:     '#A1A1AA',
        },
        primary: {
          DEFAULT: '#059669',
          hover:   '#047857',
          tint:    '#ECFDF5',
          text:    '#065F46',
        },
        success: { DEFAULT: '#10B981', bg: '#ECFDF5', text: '#047857' },
        warning: { DEFAULT: '#F59E0B', bg: '#FFFBEB', text: '#B45309' },
        danger:  { DEFAULT: '#DC2626', hover: '#B91C1C', tint: '#FEF2F2' },
      },
      // Category palette (use as data, not utilities):
      // ['#10B981','#F59E0B','#3B82F6','#8B5CF6','#06B6D4','#F43F5E','#EC4899','#F97316','#14B8A6','#6366F1']
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
        card:        '0 1px 2px rgba(16,24,40,.04)',
        'primary-btn':'0 1px 2px rgba(5,150,105,.25)',
        logo:        '0 3px 9px rgba(5,150,105,.3)',
        auth:        '0 1px 2px rgba(16,24,40,.04), 0 8px 28px -12px rgba(16,24,40,.10)',
        modal:       '0 20px 50px -16px rgba(16,24,40,.32)',
        toast:       '0 10px 30px -8px rgba(0,0,0,.4)',
        segment:     '0 1px 2px rgba(16,24,40,.10)',
      },
      keyframes: {
        folioFade:    { '0%': { opacity: 0, transform: 'translateY(8px)' },             '100%': { opacity: 1, transform: 'none' } },
        folioPop:     { '0%': { opacity: 0, transform: 'translateY(10px) scale(.98)' },  '100%': { opacity: 1, transform: 'none' } },
        folioOverlay: { '0%': { opacity: 0 },                                            '100%': { opacity: 1 } },
        folioShimmer: { '0%': { backgroundPosition: '-450px 0' },                        '100%': { backgroundPosition: '450px 0' } },
      },
      animation: {
        folioFade:    'folioFade .5s ease both',
        folioPop:     'folioPop .2s ease both',
        folioOverlay: 'folioOverlay .15s ease both',
        folioShimmer: 'folioShimmer 1.4s infinite linear',
      },
    },
  },
  plugins: [],
};
```

## Fonts
Add to `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```
Or install `geist` from npm and import `geist/font`.

## Global resets
```css
body { margin: 0; background: #FAFAF9; color: #18181B; }
* { box-sizing: border-box; }
html { -webkit-font-smoothing: antialiased; }
/* currency / numeric cells */
.tnum { font-variant-numeric: tabular-nums; }
```

## Recurring utility recipes
- **Card:** `bg-surface border border-border rounded-card shadow-card p-6`
- **Primary button:** `h-11 px-5 inline-flex items-center gap-2 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-primary-btn active:translate-y-px transition-colors`
- **Secondary button:** `h-11 px-4 rounded-md bg-surface border border-border-strong text-ink-secondary text-sm font-medium hover:bg-app transition-colors`
- **Input:** `h-11 px-3.5 rounded-md bg-surface border border-border-strong text-sm text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/[.12] transition`
- **Active nav pill:** `bg-primary-tint text-primary-text font-semibold`
- **Progress track / fill:** track `h-[9px] bg-surface-muted rounded-full overflow-hidden`; fill `h-full rounded-full transition-[width] duration-[400ms]` with inline `style={{ width, background }}` (red `#DC2626` when over budget).
- **Currency value:** `font-mono tabular-nums font-semibold`
```
