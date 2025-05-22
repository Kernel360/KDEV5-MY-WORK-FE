// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Vite 기본 진입점
    "./src/**/*.{js,jsx}", // js, jsx 파일 전부 포함
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D2261F",
          light: "#EA4A44",
          lighter: "#F7C1BE",
          lightest: "#FEF2F2",
          dark: "#B01E18",
          darker: "#8A1813",
        },
        mint: "#D4E9CA",
        beige: "#F5F5F0",
        yellow: "#FFDE69",
        sky: "#E6F4FF",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#991B15",
        info: "#3B82F6",
        surface: {
          page: "#F9FAFB",
          card: "#FFFFFF",
          input: "#F5F5F0",
          divider: "#E5E7EB",
        },
      },
    },
  },
  plugins: [],
};
