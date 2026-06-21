import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'on-primary': 'rgb(var(--on-primary) / <alpha-value>)',
        'body-text': 'rgb(var(--body-text) / <alpha-value>)',
        'muted-text': 'rgb(var(--muted-text) / <alpha-value>)',
        'faint-text': 'rgb(var(--faint-text) / <alpha-value>)',
        'hairline-border': 'rgb(var(--hairline-border) / <alpha-value>)',
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        'canvas-elevated': 'rgb(var(--canvas-elevated) / <alpha-value>)',
        link: 'rgb(var(--link) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        card: '12px',
        panel: '16px',
        pill: '100px',
      },
      spacing: {
        4: '4px',
        8: '8px',
        12: '12px',
        16: '16px',
        24: '24px',
        32: '32px',
        40: '40px',
        64: '64px',
        96: '96px',
        128: '128px',
      },
    },
  },
  plugins: [],
}
export default config
