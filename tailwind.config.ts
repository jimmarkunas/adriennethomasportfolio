import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        "secondary-dark": "var(--color-secondary-dark)",
        muted: "var(--color-muted)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        pill: "var(--radius-pill)",
        chip: "var(--radius-chip)",
        circle: "var(--radius-circle)",
      },
      spacing: {
        2: "var(--space-8)",
        3: "var(--space-12)",
        4: "var(--space-16)",
        5: "var(--space-20)",
        6: "var(--space-24)",
        7: "var(--space-28)",
        8: "var(--space-32)",
        10: "var(--space-40)",
        13: "var(--space-52)",
        20: "var(--space-80)",
        30: "var(--space-120)",
      },
      fontFamily: {
        display: [
          "Inter Display",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "Inter Display",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        h1: ["15rem", { lineHeight: "1", letterSpacing: "-0.1em" }],
        h2: ["7.5rem", { lineHeight: "1.05", letterSpacing: "-0.04em" }],
        h3: ["3rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h4: ["2.25rem", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
        h5: ["2rem", { lineHeight: "1.35", letterSpacing: "-0.02em" }],
        h6: ["1.75rem", { lineHeight: "1.4", letterSpacing: "-0.02em" }],
        p1: ["1.5rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        p2: ["1.25rem", { lineHeight: "1.45", letterSpacing: "-0.01em" }],
        p3: ["1.125rem", { lineHeight: "1.5", letterSpacing: "0" }],
        p4: ["1rem", { lineHeight: "1.5", letterSpacing: "0" }],
        p5: ["0.875rem", { lineHeight: "1.6", letterSpacing: "0" }],
      },
    },
  },
  plugins: [],
}

export default config
