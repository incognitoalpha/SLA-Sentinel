import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#171717',
        'on-primary': '#ffffff',
        'body-text': '#4d4d4d',
        'muted-text': '#8f8f8f',
        'faint-text': '#a1a1a1',
        'hairline-border': '#ebebeb',
        canvas: '#fafafa',
        'canvas-elevated': '#ffffff',
        link: '#0070f3',
        error: '#ee0000',
        warning: '#f5a623',
        success: '#17c964',
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
