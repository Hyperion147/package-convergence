export interface OklchColor {
  l: number;
  c: number;
  h: number;
}
export interface ThemeConfig {
    background: OklchColor;
    foreground: OklchColor;
    primary: OklchColor;
    'primary-foreground': OklchColor;
    secondary: OklchColor;
    'secondary-foreground': OklchColor;
    muted: OklchColor;
    'muted-foreground': OklchColor;
    accent: OklchColor;
    'accent-foreground': OklchColor;
    destructive: OklchColor;
    border: OklchColor;
}

export type ThemeKey = keyof ThemeConfig;