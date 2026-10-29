// Surmetric Core v0.1.0 — generado desde tokens/tokens.json por scripts/build.mjs. No editar a mano.

export const themes = ["light","dark"] as const;

export const colors = {
  "brand-teal": "#00968E",
  "brand-teal-dark": "#00766F",
  "brand-teal-light": "#E6F5F3",
  "brand-teal-bright": "#00B2AC",
  "brand-dark": "#1B1F2A",
  "brand-dark-soft": "#2D3140",
  "brand-gray-50": "#F4F7FA",
  "brand-gray-100": "#E1E8F0",
  "brand-gray-300": "#B8C2CC",
  "brand-gray-500": "#5D6978",
  "brand-gray-500-legacy": "#8E9AA8",
  "brand-white": "#FFFFFF",
  "danger": "#DC2626",
  "warning": "#D97706",
  "info": "#2563EB",
} as const;

export const semanticColors = {
  "canvas": { light: "#FFFFFF", dark: "#1B1F2A" },
  "surface": { light: "#F4F7FA", dark: "#2D3140" },
  "border": { light: "#E1E8F0", dark: "#2D3140" },
  "ink": { light: "#1B1F2A", dark: "#F4F7FA" },
  "ink-muted": { light: "#5D6978", dark: "#8E9AA8" },
  "accent": { light: "#00968E", dark: "#00968E" },
  "accent-strong": { light: "#00766F", dark: "#00B2AC" },
  "accent-soft": { light: "#E6F5F3", dark: "#17323A" },
  "on-accent": { light: "#FFFFFF", dark: "#FFFFFF" },
  "danger-soft": { light: "#FDECEC", dark: "#3A2029" },
  "warning-soft": { light: "#FEF3E2", dark: "#392D24" },
} as const;

export const cssVar = {
  "brand-teal": "var(--sm-color-brand-teal)",
  "brand-teal-dark": "var(--sm-color-brand-teal-dark)",
  "brand-teal-light": "var(--sm-color-brand-teal-light)",
  "brand-teal-bright": "var(--sm-color-brand-teal-bright)",
  "brand-dark": "var(--sm-color-brand-dark)",
  "brand-dark-soft": "var(--sm-color-brand-dark-soft)",
  "brand-gray-50": "var(--sm-color-brand-gray-50)",
  "brand-gray-100": "var(--sm-color-brand-gray-100)",
  "brand-gray-300": "var(--sm-color-brand-gray-300)",
  "brand-gray-500": "var(--sm-color-brand-gray-500)",
  "brand-gray-500-legacy": "var(--sm-color-brand-gray-500-legacy)",
  "brand-white": "var(--sm-color-brand-white)",
  "canvas": "var(--sm-color-canvas)",
  "surface": "var(--sm-color-surface)",
  "border": "var(--sm-color-border)",
  "ink": "var(--sm-color-ink)",
  "ink-muted": "var(--sm-color-ink-muted)",
  "accent": "var(--sm-color-accent)",
  "accent-strong": "var(--sm-color-accent-strong)",
  "accent-soft": "var(--sm-color-accent-soft)",
  "on-accent": "var(--sm-color-on-accent)",
  "danger": "var(--sm-color-danger)",
  "danger-soft": "var(--sm-color-danger-soft)",
  "warning": "var(--sm-color-warning)",
  "warning-soft": "var(--sm-color-warning-soft)",
  "info": "var(--sm-color-info)",
} as const;

export const fontFamily = {
  "sans": "\"Montserrat\", \"Helvetica Neue\", Arial, sans-serif",
  "display": "\"Montserrat\", \"Helvetica Neue\", Arial, sans-serif",
  "mono": "\"Geist Mono\", ui-monospace, monospace",
} as const;

export const fontSize = {
  "micro-11": "11px",
  "micro-10": "10px",
} as const;

export const radius = {
  "radius-card": "14px",
} as const;

export const shadow = {
  "shadow-card-hover": "0 8px 24px -12px rgba(27, 31, 42, 0.25)",
} as const;

export const easing = {
  "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export type Theme = (typeof themes)[number];
export type ColorToken = keyof typeof colors;
export type SemanticColorToken = keyof typeof semanticColors;
