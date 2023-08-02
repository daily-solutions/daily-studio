const { fontFamily } = require('tailwindcss/defaultTheme');
const {
  config: { theme },
} = require('./config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'ui/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: theme.border,
        input: theme.input,
        ring: theme.ring,
        background: theme.background,
        foreground: theme.foreground,
        primary: {
          DEFAULT: theme.primary.default,
          foreground: theme.primary.foreground,
        },
        secondary: {
          DEFAULT: theme.secondary.default,
          foreground: theme.secondary.foreground,
        },
        destructive: {
          DEFAULT: theme.destructive.default,
          foreground: theme.destructive.foreground,
        },
        muted: {
          DEFAULT: theme.muted.default,
          foreground: theme.muted.foreground,
        },
        accent: {
          DEFAULT: theme.accent.default,
          foreground: theme.accent.foreground,
        },
        popover: {
          DEFAULT: theme.popover.default,
          foreground: theme.popover.foreground,
        },
        card: {
          DEFAULT: theme.card.default,
          foreground: theme.card.foreground,
        },
        selected: {
          DEFAULT: theme.selected.default,
          foreground: theme.selected.foreground,
        },
      },
      borderRadius: {
        lg: theme.radius,
        md: `calc(${theme.radius} - 2px)`,
        sm: `calc(${theme.radius} - 4px)`,
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
