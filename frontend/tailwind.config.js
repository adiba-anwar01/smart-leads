/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        sidebar: {
          bg:         '#0f172a',
          hover:      '#1e293b',
          active:     '#10b981',
          text:       '#94a3b8',
          textActive: '#ffffff',
          border:     '#1e293b',
        },
        surface: {
          DEFAULT:   '#ffffff',
          secondary: '#f8fafc',
        },
        border: {
          DEFAULT: '#e2e8f0',
          light:   '#f1f5f9',
        },
        status: {
          new:       { bg: '#dbeafe', text: '#1d4ed8' },
          contacted: { bg: '#fef3c7', text: '#b45309' },
          qualified: { bg: '#dcfce7', text: '#15803d' },
          lost:      { bg: '#fee2e2', text: '#b91c1c' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'page-title':    ['1.5rem',   { lineHeight: '2rem',    fontWeight: '700' }],
        'section-title': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'card-title':    ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
        'body':          ['0.875rem', { lineHeight: '1.5rem',  fontWeight: '400' }],
        'label':         ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        'muted':         ['0.75rem',  { lineHeight: '1rem',    fontWeight: '400' }],
      },
      borderRadius: {
        sm:    '0.375rem',
        DEFAULT: '0.5rem',
        lg:    '0.75rem',
        xl:    '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card:       '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        modal:      '0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)',
        dropdown:   '0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        sidebar:    '4px 0 24px rgba(0,0,0,0.12)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      animation: {
        'fade-in':   'fadeIn 0.2s ease-out',
        'slide-in':  'slideIn 0.2s ease-out',
        'spin-slow': 'spin 0.8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
