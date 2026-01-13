interface OklchColor {
    l: number;
    c: number;
    h: number;
}
interface ThemeConfig {
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
type ThemeKey = keyof ThemeConfig;

declare class Convergence {
    private config;
    constructor(initialConfig: ThemeConfig);
    /**
     * Updates a specific color and injects it into the DOM
     */
    setOklch(key: ThemeKey, color: Partial<OklchColor>): void;
    applyFullTheme(config: ThemeConfig): void;
    getConfig(): ThemeConfig;
}

export { Convergence, type OklchColor, type ThemeConfig, type ThemeKey };
