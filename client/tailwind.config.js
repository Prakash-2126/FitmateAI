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
          50: '#ecfdf5',
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
        surface: {
          light: '#f8fafc',
          card: '#ffffff',
          dark: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeLeft: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeRight: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleInBounce: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '70%': { opacity: '1', transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4)' },
          '50%': { boxShadow: '0 0 0 14px rgba(16, 185, 129, 0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        gradientPan: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(48px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(48px) rotate(-360deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        slideInOverlay: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        revealWidth: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        rotateIn: {
          '0%': { opacity: '0', transform: 'rotate(-10deg) scale(0.9)' },
          '100%': { opacity: '1', transform: 'rotate(0deg) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.55s ease-out both',
        'fade-up-slow': 'fadeUp 0.8s ease-out both',
        'fade-down': 'fadeDown 0.55s ease-out both',
        'fade-left': 'fadeLeft 0.55s ease-out both',
        'fade-right': 'fadeRight 0.55s ease-out both',
        'scale-in': 'scaleIn 0.45s ease-out both',
        'scale-in-bounce': 'scaleInBounce 0.5s ease-out both',
        'float-y': 'floatY 4s ease-in-out infinite',
        'float-y-slow': 'floatY 6s ease-in-out infinite',
        'float-y-delay': 'floatY 5s ease-in-out 1s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2.5s ease-in-out infinite',
        'gradient-pan': 'gradientPan 4s ease infinite',
        'orbit': 'orbit 8s linear infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'slide-in-overlay': 'slideInOverlay 0.35s ease-out both',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out both',
        'reveal-width': 'revealWidth 1s ease-out both',
        'rotate-in': 'rotateIn 0.5s ease-out both',
        // Delay variants
        'fade-up-d1': 'fadeUp 0.55s 0.1s ease-out both',
        'fade-up-d2': 'fadeUp 0.55s 0.2s ease-out both',
        'fade-up-d3': 'fadeUp 0.55s 0.3s ease-out both',
        'fade-up-d4': 'fadeUp 0.55s 0.4s ease-out both',
        'fade-up-d5': 'fadeUp 0.55s 0.5s ease-out both',
        'scale-in-d1': 'scaleIn 0.45s 0.1s ease-out both',
        'scale-in-d2': 'scaleIn 0.45s 0.2s ease-out both',
        'scale-in-d3': 'scaleIn 0.45s 0.3s ease-out both',
      },
      backgroundSize: {
        '200%': '200%',
        '300%': '300%',
      },
    },
  },
  plugins: [],
}
