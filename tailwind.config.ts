import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#722F37',
          light: '#8B3A44',
          dark: '#5C2530',
          darker: '#4D1A22',
          50: '#F9F0F1',
        },
        mustard: {
          DEFAULT: '#C89B3C',
          light: '#D4A84B',
          dark: '#A67D2E',
          50: '#FBF5E6',
        },
      },
      fontFamily: {
        mael: ['Mael', 'Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
