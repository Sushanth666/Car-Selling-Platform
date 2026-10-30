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
        luxury: {
          950: '#060709',
          900: '#0B0D12',
          850: '#11141C',
          800: '#171B26',
          700: '#23293A',
          600: '#343E56',
        },
        gold: {
          400: '#F5D061',
          500: '#E5B83A',
          600: '#C99D24',
        },
        amber: {
          450: '#FF9E2C',
        },
        crimson: {
          500: '#E63946',
          600: '#D90429',
        },
        electric: {
          400: '#00F0FF',
          500: '#00C8D6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'Cabinet Grotesk', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 35px -5px rgba(229, 184, 58, 0.35)',
        'glow-crimson': '0 0 35px -5px rgba(230, 57, 70, 0.35)',
        'glow-electric': '0 0 35px -5px rgba(0, 240, 255, 0.35)',
        'card-luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'carbon-pattern': "radial-gradient(#1e2536 1px, transparent 1px), radial-gradient(#1e2536 1px, #0b0d12 1px)",
        'gold-gradient': "linear-gradient(135deg, #FFF1BE 0%, #E5B83A 50%, #B38612 100%)",
        'crimson-gradient': "linear-gradient(135deg, #FF6B6B 0%, #E63946 50%, #9B0014 100%)",
        'glass-gradient': "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
