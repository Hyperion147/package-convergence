import { ThemeConfig } from './types';

export const LIGHT_THEME: ThemeConfig = {
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
    'sidebar-ring': { l: 0.8, c: 0.0, h: 0 }
} as ThemeConfig;

export const COLD_THEME: ThemeConfig = {
    background: { l: 0.2854, c: 0.0860, h: 260.7630 }, // #0F2854
    foreground: { l: 0.9048, c: 0.0479, h: 218.1013 }, // #BDE8F5
    card: { l: 0.4235, c: 0.1184, h: 256.5936 }, // #1C4D8D
    'card-foreground': { l: 0.9048, c: 0.0479, h: 218.1013 },
    popover: { l: 0.2854, c: 0.0860, h: 260.7630 },
    'popover-foreground': { l: 0.9048, c: 0.0479, h: 218.1013 },
    primary: { l: 0.6114, c: 0.1125, h: 249.1011 }, // #4988C4
    'primary-foreground': { l: 0.2854, c: 0.0860, h: 260.7630 },
    secondary: { l: 0.4235, c: 0.1184, h: 256.5936 }, // #1C4D8D
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
    'sidebar-ring': { l: 0.6114, c: 0.1125, h: 249.1011 }
} as ThemeConfig;

export const WARM_THEME: ThemeConfig = {
    background: { l: 0.9479, c: 0.0381, h: 69.8797 }, // #FFEAD3
    foreground: { l: 0.4908, c: 0.1324, h: 23.3148 }, // #9E3B3B
    card: { l: 0.7080, c: 0.1373, h: 21.1270 }, // #EA7B7B
    'card-foreground': { l: 0.9479, c: 0.0381, h: 69.8797 },
    popover: { l: 0.9479, c: 0.0381, h: 69.8797 },
    'popover-foreground': { l: 0.4908, c: 0.1324, h: 23.3148 },
    primary: { l: 0.6091, c: 0.1612, h: 23.1514 }, // #D25353
    'primary-foreground': { l: 0.9479, c: 0.0381, h: 69.8797 },
    secondary: { l: 0.7080, c: 0.1373, h: 21.1270 }, // #EA7B7B
    'secondary-foreground': { l: 0.4908, c: 0.1324, h: 23.3148 },
    muted: { l: 0.7080, c: 0.1373, h: 21.1270 }, // #EA7B7B - using lighter shade for muted might be better, but sticking to palette
    'muted-foreground': { l: 0.4908, c: 0.1324, h: 23.3148 },
    accent: { l: 0.7080, c: 0.1373, h: 21.1270 },
    'accent-foreground': { l: 0.4908, c: 0.1324, h: 23.3148 },
    destructive: { l: 0.4908, c: 0.1324, h: 23.3148 }, // #9E3B3B
    'destructive-foreground': { l: 0.9479, c: 0.0381, h: 69.8797 },
    border: { l: 0.6091, c: 0.1612, h: 23.1514 }, // #D25353
    input: { l: 0.6091, c: 0.1612, h: 23.1514 },
    ring: { l: 0.4908, c: 0.1324, h: 23.3148 },
    'chart-1': { l: 0.6091, c: 0.1612, h: 23.1514 },
    'chart-2': { l: 0.7080, c: 0.1373, h: 21.1270 },
    'chart-3': { l: 0.4908, c: 0.1324, h: 23.3148 },
    'chart-4': { l: 0.8, c: 0.1, h: 50 }, // Generic warm
    'chart-5': { l: 0.6, c: 0.1, h: 10 }, // Generic warm
    sidebar: { l: 0.9479, c: 0.0381, h: 69.8797 },
    'sidebar-foreground': { l: 0.4908, c: 0.1324, h: 23.3148 },
    'sidebar-primary': { l: 0.6091, c: 0.1612, h: 23.1514 },
    'sidebar-primary-foreground': { l: 0.9479, c: 0.0381, h: 69.8797 },
    'sidebar-accent': { l: 0.7080, c: 0.1373, h: 21.1270 },
    'sidebar-accent-foreground': { l: 0.4908, c: 0.1324, h: 23.3148 },
    'sidebar-border': { l: 0.6091, c: 0.1612, h: 23.1514 },
    'sidebar-ring': { l: 0.4908, c: 0.1324, h: 23.3148 }
} as ThemeConfig;

export const PRESETS: Record<string, ThemeConfig> = {
    "Light": LIGHT_THEME,
    "Dark": DARK_THEME,
    "Cold": COLD_THEME,
    "Warm": WARM_THEME
};
