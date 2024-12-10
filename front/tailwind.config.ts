import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "arena": "#EAE2B7",
        "primario": "#003049",
        "secundario": "#FCBF49",
        "accion": "#D62828"
      },
    },
  },
  plugins: [],
} satisfies Config;
