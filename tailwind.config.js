/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#2b3a42',
          soft: '#5a6b72',
          light: '#8a9ba2',
        },
        green: {
          DEFAULT: '#5b8c7e',
          deep: '#3f6f62',
          light: '#8ab5a8',
          pale: 'rgba(91, 140, 126, 0.12)',
        },
        blue: {
          DEFAULT: '#5a7d9a',
          pale: 'rgba(90, 125, 154, 0.28)',
          light: 'rgba(90, 125, 154, 0.45)',
        },
        paper: {
          DEFAULT: '#f7f3ea',
          2: '#fffdf8',
          card: 'rgba(255, 253, 248, 0.86)',
          entry: 'rgba(255, 253, 248, 0.92)',
        },
        accent: {
          DEFAULT: '#c2603f',
          pale: 'rgba(194, 96, 63, 0.12)',
          light: 'rgba(194, 96, 63, 0.16)',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Songti SC"', 'STSong', 'SimSun', '"Source Han Serif SC"', 'serif'],
      },
      borderRadius: {
        card: '16px',
        input: '10px',
        entry: '14px',
        mood: '12px',
        mini: '8px',
      },
      boxShadow: {
        card: '0 10px 30px rgba(43,58,66,0.12)',
        entry: '0 6px 18px rgba(43,58,66,0.06)',
        green: '0 8px 18px rgba(63,111,98,0.32)',
        focus: '0 0 0 3px rgba(91,140,126,0.18)',
      },
      backgroundImage: {
        'jiangnan': 'linear-gradient(180deg, #e7f0ec 0%, #eef2ea 38%, #f7f3ea 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
