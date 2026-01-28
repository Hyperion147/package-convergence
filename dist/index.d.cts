import * as react_jsx_runtime from 'react/jsx-runtime';

interface OklchColor {
    l: number;
    c: number;
    h: number;
}
interface ThemeConfig {
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
type ThemeKey = keyof ThemeConfig;

declare const LIGHT_THEME: ThemeConfig;
declare const DARK_THEME: ThemeConfig;
declare const COLD_THEME: ThemeConfig;
declare const WARM_THEME: ThemeConfig;
declare const PRESETS: Record<string, ThemeConfig>;

interface ConvergenceProps {
    initialConfig?: ThemeConfig;
    className?: string;
    syncStart?: boolean;
}
declare function Convergence({ initialConfig, className, syncStart, }: ConvergenceProps): react_jsx_runtime.JSX.Element;

declare class ConvergenceEngine {
    private config;
    constructor(initialConfig: ThemeConfig, options?: {
        autoApply?: boolean;
    });
    syncFromDom(): ThemeConfig;
    /**
     * Updates a specific color and injects it into the DOM
     */
    setOklch(key: ThemeKey, color: Partial<OklchColor>): void;
    applyFullTheme(config: ThemeConfig): void;
    getConfig(): ThemeConfig;
}

export { COLD_THEME, Convergence, ConvergenceEngine, DARK_THEME, LIGHT_THEME, type OklchColor, PRESETS, type ThemeConfig, type ThemeKey, WARM_THEME };
