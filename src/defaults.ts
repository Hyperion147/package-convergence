import { ThemeConfig, ShadowConfig, ShadowColor } from './types';

// ---------------------------------------------------------------------------
// Shadow helpers
// ---------------------------------------------------------------------------

/** Build a single shadow layer string using an oklch color with alpha */
const s = (l: number, c: number, h: number, a: number) =>
  `oklch(${l.toFixed(2)} ${c.toFixed(2)} ${h.toFixed(2)} / ${a})`;

/** Standard neutral-dark shadow set (light themes) */
const neutralDarkShadows = (sc: ShadowColor): ShadowConfig => ({
  'shadow-color': sc,
  'shadow-2xs': `0 1px 3px 0px ${s(sc.l, sc.c, sc.h, 0.05)}`,
  'shadow-xs':  `0 1px 3px 0px ${s(sc.l, sc.c, sc.h, 0.05)}`,
  'shadow-sm':  `0 1px 3px 0px ${s(sc.l, sc.c, sc.h, 0.10)}, 0 1px 2px -1px ${s(sc.l, sc.c, sc.h, 0.10)}`,
  'shadow':     `0 1px 3px 0px ${s(sc.l, sc.c, sc.h, 0.10)}, 0 1px 2px -1px ${s(sc.l, sc.c, sc.h, 0.10)}`,
  'shadow-md':  `0 1px 3px 0px ${s(sc.l, sc.c, sc.h, 0.10)}, 0 2px 4px -1px ${s(sc.l, sc.c, sc.h, 0.10)}`,
  'shadow-lg':  `0 1px 3px 0px ${s(sc.l, sc.c, sc.h, 0.10)}, 0 4px 6px -1px ${s(sc.l, sc.c, sc.h, 0.10)}`,
  'shadow-xl':  `0 1px 3px 0px ${s(sc.l, sc.c, sc.h, 0.10)}, 0 8px 10px -1px ${s(sc.l, sc.c, sc.h, 0.10)}`,
  'shadow-2xl': `0 1px 3px 0px ${s(sc.l, sc.c, sc.h, 0.25)}`,
});

// ---------------------------------------------------------------------------
// Color presets
// ---------------------------------------------------------------------------

export const LIGHT_THEME: ThemeConfig = {
    background: { l: 0.99, c: 0, h: 0 },
    foreground: { l: 0.1, c: 0.01, h: 260 },
    card: { l: 1.0, c: 0, h: 0 },
    'card-foreground': { l: 0.1, c: 0.01, h: 260 },
    popover: { l: 1.0, c: 0, h: 0 },
    'popover-foreground': { l: 0.1, c: 0.01, h: 260 },
    primary: { l: 0.2, c: 0.0, h: 0 },
    'primary-foreground': { l: 0.99, c: 0, h: 0 },
    secondary: { l: 0.96, c: 0.0, h: 0 },
    'secondary-foreground': { l: 0.2, c: 0, h: 0 },
    muted: { l: 0.96, c: 0.0, h: 0 },
    'muted-foreground': { l: 0.45, c: 0.01, h: 260 },
    accent: { l: 0.96, c: 0.0, h: 0 },
    'accent-foreground': { l: 0.2, c: 0, h: 0 },
    destructive: { l: 0.5, c: 0.2, h: 25 },
    'destructive-foreground': { l: 0.99, c: 0, h: 0 },
    border: { l: 0.92, c: 0.0, h: 0 },
    input: { l: 0.92, c: 0.0, h: 0 },
    ring: { l: 0.2, c: 0.0, h: 0 },
    'chart-1': { l: 0.6, c: 0.15, h: 25 },
    'chart-2': { l: 0.55, c: 0.12, h: 170 },
    'chart-3': { l: 0.35, c: 0.15, h: 270 },
    'chart-4': { l: 0.7, c: 0.15, h: 80 },
    'chart-5': { l: 0.55, c: 0.15, h: 320 },
    sidebar: { l: 0.98, c: 0.0, h: 0 },
    'sidebar-foreground': { l: 0.2, c: 0.01, h: 260 },
    'sidebar-primary': { l: 0.2, c: 0.0, h: 0 },
    'sidebar-primary-foreground': { l: 0.99, c: 0.0, h: 0 },
    'sidebar-accent': { l: 0.95, c: 0.0, h: 0 },
    'sidebar-accent-foreground': { l: 0.2, c: 0.0, h: 0 },
    'sidebar-border': { l: 0.92, c: 0.0, h: 0 },
    'sidebar-ring': { l: 0.8, c: 0.0, h: 0 },
} as ThemeConfig;

export const LIGHT_SHADOWS: ShadowConfig = neutralDarkShadows({ l: 0.00, c: 0, h: 0, a: 1 });

// ---------------------------------------------------------------------------

export const DARK_THEME: ThemeConfig = {
    background: { l: 0.09, c: 0.0, h: 0 },
    foreground: { l: 0.98, c: 0.0, h: 0 },
    card: { l: 0.12, c: 0.0, h: 0 },
    'card-foreground': { l: 0.98, c: 0.0, h: 0 },
    popover: { l: 0.12, c: 0.0, h: 0 },
    'popover-foreground': { l: 0.98, c: 0.0, h: 0 },
    primary: { l: 0.98, c: 0.0, h: 0 },
    'primary-foreground': { l: 0.09, c: 0.0, h: 0 },
    secondary: { l: 0.15, c: 0.02, h: 260 },
    'secondary-foreground': { l: 0.98, c: 0.0, h: 0 },
    muted: { l: 0.15, c: 0.02, h: 260 },
    'muted-foreground': { l: 0.65, c: 0.01, h: 260 },
    accent: { l: 0.15, c: 0.02, h: 260 },
    'accent-foreground': { l: 0.98, c: 0.0, h: 0 },
    destructive: { l: 0.3, c: 0.1, h: 25 },
    'destructive-foreground': { l: 0.98, c: 0.0, h: 0 },
    border: { l: 0.15, c: 0.02, h: 260 },
    input: { l: 0.15, c: 0.02, h: 260 },
    ring: { l: 0.8, c: 0.0, h: 0 },
    'chart-1': { l: 0.4, c: 0.15, h: 220 },
    'chart-2': { l: 0.4, c: 0.15, h: 180 },
    'chart-3': { l: 0.4, c: 0.15, h: 30 },
    'chart-4': { l: 0.4, c: 0.15, h: 280 },
    'chart-5': { l: 0.4, c: 0.15, h: 340 },
    sidebar: { l: 0.1, c: 0.0, h: 0 },
    'sidebar-foreground': { l: 0.98, c: 0.0, h: 0 },
    'sidebar-primary': { l: 0.4, c: 0.15, h: 220 },
    'sidebar-primary-foreground': { l: 0.98, c: 0.0, h: 0 },
    'sidebar-accent': { l: 0.15, c: 0.02, h: 260 },
    'sidebar-accent-foreground': { l: 0.98, c: 0.0, h: 0 },
    'sidebar-border': { l: 0.15, c: 0.02, h: 260 },
    'sidebar-ring': { l: 0.8, c: 0.0, h: 0 },
} as ThemeConfig;

export const DARK_SHADOWS: ShadowConfig = neutralDarkShadows({ l: 0.00, c: 0, h: 0, a: 1 });

// ---------------------------------------------------------------------------

export const COLD_THEME: ThemeConfig = {
    background: { l: 0.2854, c: 0.0860, h: 260.7630 },
    foreground: { l: 0.9048, c: 0.0479, h: 218.1013 },
    card: { l: 0.4235, c: 0.1184, h: 256.5936 },
    'card-foreground': { l: 0.9048, c: 0.0479, h: 218.1013 },
    popover: { l: 0.2854, c: 0.0860, h: 260.7630 },
    'popover-foreground': { l: 0.9048, c: 0.0479, h: 218.1013 },
    primary: { l: 0.6114, c: 0.1125, h: 249.1011 },
    'primary-foreground': { l: 0.2854, c: 0.0860, h: 260.7630 },
    secondary: { l: 0.4235, c: 0.1184, h: 256.5936 },
    'secondary-foreground': { l: 0.9048, c: 0.0479, h: 218.1013 },
    muted: { l: 0.4235, c: 0.1184, h: 256.5936 },
    'muted-foreground': { l: 0.6114, c: 0.1125, h: 249.1011 },
    accent: { l: 0.6114, c: 0.1125, h: 249.1011 },
    'accent-foreground': { l: 0.2854, c: 0.0860, h: 260.7630 },
    destructive: { l: 0.3, c: 0.1, h: 25 },
    'destructive-foreground': { l: 0.98, c: 0.0, h: 0 },
    border: { l: 0.4235, c: 0.1184, h: 256.5936 },
    input: { l: 0.4235, c: 0.1184, h: 256.5936 },
    ring: { l: 0.6114, c: 0.1125, h: 249.1011 },
    'chart-1': { l: 0.6114, c: 0.1125, h: 249.1011 },
    'chart-2': { l: 0.4235, c: 0.1184, h: 256.5936 },
    'chart-3': { l: 0.9048, c: 0.0479, h: 218.1013 },
    'chart-4': { l: 0.7, c: 0.15, h: 80 },
    'chart-5': { l: 0.55, c: 0.15, h: 320 },
    sidebar: { l: 0.2854, c: 0.0860, h: 260.7630 },
    'sidebar-foreground': { l: 0.9048, c: 0.0479, h: 218.1013 },
    'sidebar-primary': { l: 0.6114, c: 0.1125, h: 249.1011 },
    'sidebar-primary-foreground': { l: 0.2854, c: 0.0860, h: 260.7630 },
    'sidebar-accent': { l: 0.4235, c: 0.1184, h: 256.5936 },
    'sidebar-accent-foreground': { l: 0.9048, c: 0.0479, h: 218.1013 },
    'sidebar-border': { l: 0.4235, c: 0.1184, h: 256.5936 },
    'sidebar-ring': { l: 0.6114, c: 0.1125, h: 249.1011 },
} as ThemeConfig;

// Cold theme: deep blue-tinted shadows
export const COLD_SHADOWS: ShadowConfig = neutralDarkShadows({ l: 0.20, c: 0.08, h: 260, a: 1 });

// ---------------------------------------------------------------------------

export const WARM_THEME: ThemeConfig = {
    background: { l: 0.9479, c: 0.0381, h: 69.8797 },
    foreground: { l: 0.4908, c: 0.1324, h: 23.3148 },
    card: { l: 0.7080, c: 0.1373, h: 21.1270 },
    'card-foreground': { l: 0.9479, c: 0.0381, h: 69.8797 },
    popover: { l: 0.9479, c: 0.0381, h: 69.8797 },
    'popover-foreground': { l: 0.4908, c: 0.1324, h: 23.3148 },
    primary: { l: 0.6091, c: 0.1612, h: 23.1514 },
    'primary-foreground': { l: 0.9479, c: 0.0381, h: 69.8797 },
    secondary: { l: 0.7080, c: 0.1373, h: 21.1270 },
    'secondary-foreground': { l: 0.4908, c: 0.1324, h: 23.3148 },
    muted: { l: 0.7080, c: 0.1373, h: 21.1270 },
    'muted-foreground': { l: 0.4908, c: 0.1324, h: 23.3148 },
    accent: { l: 0.7080, c: 0.1373, h: 21.1270 },
    'accent-foreground': { l: 0.4908, c: 0.1324, h: 23.3148 },
    destructive: { l: 0.4908, c: 0.1324, h: 23.3148 },
    'destructive-foreground': { l: 0.9479, c: 0.0381, h: 69.8797 },
    border: { l: 0.6091, c: 0.1612, h: 23.1514 },
    input: { l: 0.6091, c: 0.1612, h: 23.1514 },
    ring: { l: 0.4908, c: 0.1324, h: 23.3148 },
    'chart-1': { l: 0.6091, c: 0.1612, h: 23.1514 },
    'chart-2': { l: 0.7080, c: 0.1373, h: 21.1270 },
    'chart-3': { l: 0.4908, c: 0.1324, h: 23.3148 },
    'chart-4': { l: 0.8, c: 0.1, h: 50 },
    'chart-5': { l: 0.6, c: 0.1, h: 10 },
    sidebar: { l: 0.9479, c: 0.0381, h: 69.8797 },
    'sidebar-foreground': { l: 0.4908, c: 0.1324, h: 23.3148 },
    'sidebar-primary': { l: 0.6091, c: 0.1612, h: 23.1514 },
    'sidebar-primary-foreground': { l: 0.9479, c: 0.0381, h: 69.8797 },
    'sidebar-accent': { l: 0.7080, c: 0.1373, h: 21.1270 },
    'sidebar-accent-foreground': { l: 0.4908, c: 0.1324, h: 23.3148 },
    'sidebar-border': { l: 0.6091, c: 0.1612, h: 23.1514 },
    'sidebar-ring': { l: 0.4908, c: 0.1324, h: 23.3148 },
} as ThemeConfig;

// Warm theme: amber-tinted shadows
export const WARM_SHADOWS: ShadowConfig = neutralDarkShadows({ l: 0.30, c: 0.10, h: 30, a: 1 });

// ---------------------------------------------------------------------------

export const PRESET_SHADOWS: Record<string, ShadowConfig> = {
    "Light": LIGHT_SHADOWS,
    "Dark":  DARK_SHADOWS,
    "Cold":  COLD_SHADOWS,
    "Warm":  WARM_SHADOWS,
};

export const PRESETS: Record<string, ThemeConfig> = {
    "Light": LIGHT_THEME,
    "Dark":  DARK_THEME,
    "Cold":  COLD_THEME,
    "Warm":  WARM_THEME,
};
