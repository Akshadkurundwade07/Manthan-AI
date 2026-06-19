/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg': '#0A0A0A',
        'surface': '#121212',
        'surface-elevated': '#1A1A1A',
        'primary': {
          DEFAULT: '#FFD600',
          dark: '#E5C000',
          50: '#FFFEF5',
          100: '#FFFCE0',
          200: '#FFF9C2',
          300: '#FFF394',
          400: '#FFEA5C',
          500: '#FFD600',
          600: '#E5C000',
          700: '#B39600',
          800: '#806B00',
          900: '#4D4000',
        },
        'accent': {
          DEFAULT: '#00F0FF',
          dark: '#00D4E6',
          50: '#E5FEFF',
          100: '#CCFDFF',
          200: '#99FCFF',
          300: '#66FAFF',
          400: '#33F6FF',
          500: '#00F0FF',
          600: '#00D4E6',
          700: '#00A8B3',
          800: '#007C80',
          900: '#00504D',
        },
        'text': '#FFFFFF',
        'text-muted': '#A0A0A0',
        'text-dim': '#606060',
        'success': '#00FF94',
        'warning': '#FF9500',
        'error': '#FF3B30',
        'border': '#2A2A2A',
      },
      fontFamily: {
        'display': ['Syne', 'sans-serif'],
        'body': ['Cabinet Grotesk', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '8px 8px 0px rgba(255, 214, 0, 1)',
        'brutal-hover': '12px 12px 0px rgba(255, 214, 0, 1)',
        'brutal-sm': '4px 4px 0px rgba(255, 214, 0, 1)',
        'brutal-accent': '8px 8px 0px rgba(0, 240, 255, 1)',
        'glow': '0 0 40px rgba(0, 240, 255, 0.3)',
        'glow-primary': '0 0 40px rgba(255, 214, 0, 0.3)',
        'elevation': '0 20px 60px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-in-up': 'slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.4)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

