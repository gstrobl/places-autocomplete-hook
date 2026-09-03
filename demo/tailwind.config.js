/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        'bg-elev': 'var(--color-bg-elev)',
        'bg-tint': 'var(--color-bg-tint)',
        ink: 'var(--color-ink)',
        'ink-soft': 'var(--color-ink-soft)',
        'ink-mute': 'var(--color-ink-mute)',
        accent: 'var(--color-accent)',
        'accent-soft': 'var(--color-accent-soft)',
        cream: 'var(--color-cream)',
        'cta-bg': 'var(--color-cta-bg)',
        'cta-bg-hover': 'var(--color-cta-bg-hover)',
        'cta-fg': 'var(--color-cta-fg)',
        line: 'var(--line)',
        'line-soft': 'var(--line-soft)',
        'thunder-900': 'var(--color-thunder-900)',
        'thunder-950': 'var(--color-thunder-950)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      maxWidth: {
        site: '1320px',
      },
    },
  },
  plugins: [],
};
