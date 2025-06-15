import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: [
          '"Apple SD Gothic Neo"',
          '"Malgun Gothic"',
          '"맑은 고딕"',
          "sans-serif",
        ],
        apple: [
          '"Apple SD Gothic Neo"',
          '"Malgun Gothic"',
          '"맑은 고딕"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
