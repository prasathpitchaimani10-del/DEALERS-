/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(24, 75%, 48%)',
          hover: 'hsl(24, 75%, 40%)',
          light: 'hsl(24, 75%, 95%)',
        },
        surface: 'hsl(0, 0%, 100%)',
        background: {
          DEFAULT: 'hsl(0, 0%, 98%)',
          secondary: 'hsl(0, 0%, 95%)',
        },
        text: {
          primary: 'hsl(0, 0%, 8%)',
          secondary: 'hsl(0, 0%, 40%)',
          tertiary: 'hsl(0, 0%, 60%)',
        },
        border: 'hsl(0, 0%, 90%)',
        success: 'hsl(152, 56%, 40%)',
        warning: 'hsl(38, 92%, 50%)',
        error: 'hsl(0, 72%, 51%)',
        admin: {
          sidebar: 'hsl(220, 20%, 12%)',
          'sidebar-text': 'hsl(220, 10%, 75%)',
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'tight-heading': '-0.02em',
        'wide-label': '0.08em',
      },
      maxWidth: {
        'content': '1280px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
