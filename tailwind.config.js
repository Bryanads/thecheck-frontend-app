/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores do design system do TheCheck
        'cyan': {
          400: '#22d3ee', // Cor primária de ação
        },
        'slate': {
          900: '#0f172a', // Fundo principal
          800: '#1e293b', // Superfícies (cards)
          700: '#334155', // Superfícies mais claras
          400: '#94a3b8', // Texto secundário
          300: '#cbd5e1', // Texto mais claro
          200: '#e2e8f0', // Texto principal
        },
        'green': {
          500: '#22c55e', // Score alto
        },
        'yellow': {
          500: '#eab308', // Score médio
        },
        'red': {
          500: '#ef4444', // Score baixo
          600: '#dc2626', // Botão de sair
        },
      },
    },
  },
  plugins: [],
};