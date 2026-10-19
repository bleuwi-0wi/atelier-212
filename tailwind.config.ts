import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--brand-bg)',
          text: 'var(--brand-text)',
          accent: 'var(--brand-accent)',
          'accent-hover': 'var(--brand-accent-hover)',
          muted: 'var(--brand-muted)',
          border: 'var(--brand-border)',
          surface: 'var(--brand-surface)',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        brand: '12px',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        lift: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
        modal: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
