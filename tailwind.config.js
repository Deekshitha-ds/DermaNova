/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Core palette — named tokens, not raw hex scattered through components
        canvas: "#FBF9FF",       // near-white with a lavender whisper — page background
        ink: "#2B2440",          // deep plum-grey — body text, never pure black
        lavender: {
          50: "#F5F2FD",
          100: "#EAE3FB",
          300: "#C9B6F2",
          500: "#9B7FE0",         // primary brand accent
          700: "#6E4FC2",
          900: "#432E85"
        },
        petal: {
          100: "#FDEAF0",
          300: "#F8C2D4",
          500: "#F0709B",         // soft pink accent — CTAs, scan reticle
          700: "#D14A78"
        },
        mint: {
          400: "#6FD6B8"          // healthy/positive score accent (sparingly)
        },
        amber: {
          400: "#F0B056"          // moderate severity accent
        },
        coral: {
          500: "#EC6A5E"          // severe/alert accent
        }
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],       // editorial, beauty-magazine serif for headings
        body: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"]   // readouts: confidence %, scores
      },
      borderRadius: {
        glass: "1.75rem"
      },
      backdropBlur: {
        glass: "18px"
      },
      boxShadow: {
        glass: "0 8px 32px rgba(111, 79, 194, 0.12)",
        glow: "0 0 0 1px rgba(155,127,224,0.25), 0 0 24px rgba(240,112,155,0.25)"
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "100%": { transform: "scale(1.3)", opacity: "0" }
        }
      },
      animation: {
        scanline: "scanline 2.2s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.4,0,0.6,1) infinite"
      }
    }
  },
  plugins: []
};
