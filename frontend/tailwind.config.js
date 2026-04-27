/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#2E1F26',
        sidebar: '#2F2420',
        card: '#3A393F',
        primary: '#C87740',
        accentGreen: '#849753',
        error: '#EF4444',
        textPrimary: '#FFFFFF',
        textSecondary: '#A1A1AA',
        textMuted: '#6B7280',
        border: '#2F2420',
        surface: '#3A393F',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(200, 119, 64, 0.3)',
        'glow-sm': '0 0 10px rgba(200, 119, 64, 0.2)',
      },
    },
  },
  plugins: [],
}
