/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rift: {
          darkest: "#070a11",
          dark: "#0d131f",
          card: "#121b2b",
          border: "#1e2c45",
          accent: "#f59e0b",
        },
        domain: {
          void: "#a855f7",
          astral: "#06b6d4",
          inferno: "#ef4444",
          abyssal: "#10b981",
        },
        rarity: {
          common: "#94a3b8",
          rare: "#38bdf8",
          epic: "#c084fc",
          legendary: "#fbbf24",
          mythic: "#f43f5e",
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
