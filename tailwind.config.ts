import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: "#FFFDF5",
          black: "#000000",
          accent: "#FF6B6B",
          secondary: "#FFD93D",
          muted: "#C4B5FD",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "neo-xs": "3px 3px 0px 0px var(--shadow-color, #000000)",
        "neo-sm": "4px 4px 0px 0px var(--shadow-color, #000000)",
        "neo": "6px 6px 0px 0px var(--shadow-color, #000000)",
        "neo-md": "8px 8px 0px 0px var(--shadow-color, #000000)",
        "neo-lg": "12px 12px 0px 0px var(--shadow-color, #000000)",
        "neo-xl": "16px 16px 0px 0px var(--shadow-color, #000000)",
        "neo-white": "8px 8px 0px 0px #FFFFFF",
        "neo-red": "6px 6px 0px 0px #FF6B6B",
        "neo-yellow": "6px 6px 0px 0px #FFD93D",
      },
      keyframes: {
        "stamp": {
          "0%": { transform: "scale(2.5) rotate(-8deg)", opacity: "0" },
          "65%": { transform: "scale(0.92) rotate(2deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "draw-line": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "scan-beam": {
          "0%": { top: "0px" },
          "100%": { top: "calc(100% - 4px)" },
        },
        "spin-slow": {
          "from": { transform: "rotate(0deg)" },
          "to": { transform: "rotate(360deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up-out": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        "progress": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "stamp": "stamp 0.38s cubic-bezier(0.36, 0.07, 0.19, 0.97) both",
        "draw-line": "draw-line 0.6s ease-out both",
        "scan-beam": "scan-beam 2.8s ease-in-out forwards",
        "spin-slow": "spin-slow 10s linear infinite",
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.5s ease-out both",
        "slide-up-out": "slide-up-out 0.55s cubic-bezier(0.7, 0, 0.3, 1) both",
        "progress": "progress 2.5s ease-in-out both",
        "marquee": "marquee 28s linear infinite",
        "blink": "blink 1.1s steps(2, start) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
