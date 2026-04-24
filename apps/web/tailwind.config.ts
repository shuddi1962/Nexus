import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        nexus: {
          blue: '#0652DD',
          accent: '#1A1A2E',
        }
      }
    }
  }
}
export default config