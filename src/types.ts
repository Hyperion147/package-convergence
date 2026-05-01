export interface OklchColor {
  l: number;
  c: number;
  h: number;
}

export interface ThemeConfig {
    background: OklchColor;
    foreground: OklchColor;
    card: OklchColor;
    'card-foreground': OklchColor;
    popover: OklchColor;
    'popover-foreground': OklchColor;
    primary: OklchColor;
    'primary-foreground': OklchColor;
    secondary: OklchColor;
    'secondary-foreground': OklchColor;
    muted: OklchColor;
    'muted-foreground': OklchColor;
    accent: OklchColor;
    'accent-foreground': OklchColor;
    destructive: OklchColor;
    'destructive-foreground': OklchColor;
    border: OklchColor;
    input: OklchColor;
    ring: OklchColor;
    'chart-1': OklchColor;
    'chart-2': OklchColor;
    'chart-3': OklchColor;
    'chart-4': OklchColor;
    'chart-5': OklchColor;
    sidebar: OklchColor;
    'sidebar-foreground': OklchColor;
    'sidebar-primary': OklchColor;
    'sidebar-primary-foreground': OklchColor;
    'sidebar-accent': OklchColor;
    'sidebar-accent-foreground': OklchColor;
    'sidebar-border': OklchColor;
    'sidebar-ring': OklchColor;
}

export type ThemeKey = keyof ThemeConfig;

/**
 * Shadow color is expressed as an OKLCH color (the shadow tint).
 * Opacity is a 0–1 number. The actual shadow string is assembled at export time.
 */
export interface ShadowColor {
  l: number;
  c: number;
  h: number;
  /** 0–1 */
  a: number;
}

export interface ShadowConfig {
  'shadow-color': ShadowColor;
  /** blur/spread tokens — stored as raw CSS strings */
  'shadow-2xs': string;
  'shadow-xs': string;
  'shadow-sm': string;
  'shadow': string;
  'shadow-md': string;
  'shadow-lg': string;
  'shadow-xl': string;
  'shadow-2xl': string;
}
