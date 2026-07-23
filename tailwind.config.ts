import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // These are the WARM TONES from your mockup
        "primary": "#715a48",
        "background": "#fbfae6",
        "surface": "#fbfae6",
        "on-surface": "#1b1d10",
        "outline-variant": "#d2c4bb",
        "surface-container": "#f0efda",
        "surface-container-low": "#f5f5e0",
        "surface-container-high": "#eae9d5",
        "surface-container-lowest": "#ffffff",
        "on-surface-variant": "#4f453e",
        "tertiary": "#5c614d",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#c1c6af",
        "secondary-container": "#e2e1c7",
        "on-secondary-container": "#63644f",
      },
    },
  },
  plugins: [],
};
export default config;