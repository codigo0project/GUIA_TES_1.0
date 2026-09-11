/**
 * Design tokens for the Guía TES web layer.
 * Dark-first palette matching Linear / shadcn/ui v3 values.
 * The CSS variables are applied to `:root` from `layout.tsx`.
 */

export interface Tokens {
  background: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  radius: number;
  headerHeight: number;
  sidebarWidth: number;
  sidebarCollapsed: number;
  fontScale: readonly number[];
}

export const tokens: Tokens = {
  background: "#0f0f0f",
  surface: "#181818",
  border: "#2a2a2a",
  textPrimary: "#fafafa",
  textSecondary: "#9ca3af",
  accent: "#4f46e5",
  radius: 12,
  headerHeight: 56,
  sidebarWidth: 280,
  sidebarCollapsed: 64,
  fontScale: [12, 14, 16, 20, 24, 32, 40],
} as const;

export const fontScaleVars: Record<string, string> = {
  "--text-xs": `${tokens.fontScale[0]}px`,
  "--text-sm": `${tokens.fontScale[1]}px`,
  "--text-md": `${tokens.fontScale[2]}px`,
  "--text-lg": `${tokens.fontScale[3]}px`,
  "--text-xl": `${tokens.fontScale[4]}px`,
  "--text-2xl": `${tokens.fontScale[5]}px`,
  "--text-3xl": `${tokens.fontScale[6]}px`,
};

/**
 * Returns a CSS `:root` block applying all design tokens as CSS variables.
 * Used by `layout.tsx` through an inline `<style>` tag so variables are on
 * the document root without blocking the server-rendered payload.
 */
export function cssVars(): string {
  const vars: Record<string, string> = {
    "--background": tokens.background,
    "--surface": tokens.surface,
    "--border": tokens.border,
    "--text-primary": tokens.textPrimary,
    "--text-secondary": tokens.textSecondary,
    "--accent": tokens.accent,
    "--radius": `${tokens.radius}px`,
    "--header-height": `${tokens.headerHeight}px`,
    "--sidebar-width": `${tokens.sidebarWidth}px`,
    "--sidebar-collapsed": `${tokens.sidebarCollapsed}px`,
    ...fontScaleVars,
  };

  const declarations = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  return `:root {\n${declarations}\n}`;
}
