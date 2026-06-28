import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-content)',
          card: 'var(--bg-card)',
          hover: '#E2D9CE',
          hero: 'var(--bg-content)',
          sidebar: 'var(--bg-primary)',
          'dark-primary': 'var(--bg-primary)',
          'dark-card': '#0D1526',
          'dark-hover': '#101C30',
        },
        border: {
          default: 'var(--border-color)',
          strong: '#CBD5E0',
          'dark-default': '#1A2840',
        },
        accent: {
          green: '#00E87A',
          gold: '#B8860B', // Darkened gold for light bg
          'gold-light': '#F5A623', // Original gold
          ai: '#6B9EFF',
          red: '#FF5555',
          yellow: '#FFCC00',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          dim: '#718096',
          ai: '#6B9EFF',
          'dark-primary': '#FFFFFF',
          'dark-secondary': '#8899BB',
          'dark-dim': '#3A4E6E',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
