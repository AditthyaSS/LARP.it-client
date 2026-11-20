/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clarity: {
          bg: '#F9F8F5',
          sidebar: '#F2EFE9',
          card: '#FFFFFF',
          border: '#E8E5DF',
          muted: '#8E8B85',
          text: '#22201D',
          hover: '#ECE9E2',
        },
        pastel: {
          purple: '#E9E1FF',
          purpleDark: '#5E3FA2',
          peach: '#FFE2D5',
          peachDark: '#A84C23',
          blue: '#D9EEFF',
          blueDark: '#2065A8',
          green: '#DCF5E7',
          greenDark: '#1E6F43',
          yellow: '#FEF3D6',
          yellowDark: '#8F6612',
          rose: '#FCE4EC',
          roseDark: '#9C27B0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(34, 32, 29, 0.05), 0 1px 3px -1px rgba(34, 32, 29, 0.03)',
        'card': '0 4px 16px -4px rgba(34, 32, 29, 0.06), 0 1px 4px -1px rgba(34, 32, 29, 0.03)',
        'modal': '0 20px 40px -8px rgba(34, 32, 29, 0.16)'
      }
    },
  },
  plugins: [],
}
