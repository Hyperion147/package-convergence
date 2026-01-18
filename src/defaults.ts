import { ThemeConfig } from './types';

export const DARK_THEME: ThemeConfig = {
    background: { l: 0.99, c: 0, h: 0 },
    foreground: { l: 0.1, c: 0.01, h: 260 }, // deep zinc
    card: { l: 1.0, c: 0, h: 0 },
    'card-foreground': { l: 0.1, c: 0.01, h: 260 },
    popover: { l: 1.0, c: 0, h: 0 },
    'popover-foreground': { l: 0.1, c: 0.01, h: 260 },
    primary: { l: 0.2, c: 0.0, h: 0 }, // neutral black primary
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
    ring: { l: 0.2, c: 0.0, h: 0 }, // matches primary
    'chart-1': { l: 0.6, c: 0.15, h: 25 },  // Orange
    'chart-2': { l: 0.55, c: 0.12, h: 170 }, // Teal
    'chart-3': { l: 0.35, c: 0.15, h: 270 }, // Navy/Blue
    'chart-4': { l: 0.7, c: 0.15, h: 80 },   // Yellow/Lime
    'chart-5': { l: 0.55, c: 0.15, h: 320 }, // Pink
    sidebar: { l: 0.98, c: 0.0, h: 0 },
    'sidebar-foreground': { l: 0.2, c: 0.01, h: 260 },
    'sidebar-primary': { l: 0.2, c: 0.0, h: 0 },
    'sidebar-primary-foreground': { l: 0.99, c: 0.0, h: 0 },
    'sidebar-accent': { l: 0.95, c: 0.0, h: 0 },
    'sidebar-accent-foreground': { l: 0.2, c: 0.0, h: 0 },
    'sidebar-border': { l: 0.92, c: 0.0, h: 0 },
    'sidebar-ring': { l: 0.8, c: 0.0, h: 0 }
} as ThemeConfig;

export const LIGHT_THEME: ThemeConfig = {
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
    'sidebar-ring': { l: 0.8, c: 0.0, h: 0 }
} as ThemeConfig;

export const PRESETS: Record<string, ThemeConfig> = {
    "Light": LIGHT_THEME,
    "Dark": DARK_THEME
};
