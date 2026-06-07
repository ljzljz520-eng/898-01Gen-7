/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#FFF5EB',
          100: '#FFE6CC',
          200: '#FFCC99',
          300: '#FFB366',
          400: '#FF9933',
          500: '#E67E22',
          600: '#D35400',
          700: '#A04000',
          800: '#6E2C00',
          900: '#3E2723',
        },
        secondary: {
          50: '#FDF6E3',
          100: '#FAEBD7',
          200: '#F5DEB3',
          300: '#F4D03F',
          400: '#F1C40F',
          500: '#52BE80',
          600: '#27AE60',
          700: '#1E8449',
          800: '#145A32',
          900: '#0B5345',
        },
        warm: {
          50: '#FFFEF9',
          100: '#FFF8E7',
          200: '#FFEFC1',
          300: '#FFE499',
          400: '#FFD966',
        },
        brown: {
          50: '#FDF5E6',
          100: '#F5E6D3',
          200: '#E8D5B7',
          300: '#D4B896',
          400: '#B8956E',
          500: '#8B5A2B',
          600: '#5D3A1A',
          700: '#3E2723',
        },
      },
      fontFamily: {
        display: ['Lora', 'Georgia', 'serif'],
        body: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(139, 90, 43, 0.1)',
        'card-hover': '0 12px 40px -4px rgba(139, 90, 43, 0.2)',
        'inner-warm': 'inset 0 2px 4px 0 rgba(255, 248, 231, 0.5)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        'gradient-primary': 'linear-gradient(135deg, #E67E22 0%, #D35400 100%)',
        'gradient-warm': 'linear-gradient(180deg, #FFFEF9 0%, #FFF8E7 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'bounce-soft': 'bounceSoft 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
};
