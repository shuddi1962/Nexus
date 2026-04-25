import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      colors: {
        nexus: {
          bg: '#FAFAF8',
          'bg-secondary': '#F4F3F0',
          'bg-tertiary': '#EEECEA',
          surface: '#FFFFFF',
          border: 'rgba(0,0,0,0.08)',
          'border-strong': 'rgba(0,0,0,0.15)',
          accent: '#1A1A2E',
          'accent-2': '#16213E',
          blue: '#0652DD',
          'blue-light': '#EFF4FF',
          violet: '#6C47FF',
          'violet-light': '#F3EFFF',
          green: '#12A150',
          amber: '#D97706',
          red: '#DC2626',
          'text-primary': '#0A0A0A',
          'text-secondary': '#525252',
          'text-tertiary': '#8A8A8A',
        }
      }
    }
  }
}
export default config