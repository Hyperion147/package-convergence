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
    "card-foreground": OklchColor;
    popover: OklchColor;
    "popover-foreground": OklchColor;
    primary: OklchColor;
    "primary-foreground": OklchColor;
    secondary: OklchColor;
    "secondary-foreground": OklchColor;
    muted: OklchColor;
    "muted-foreground": OklchColor;
    accent: OklchColor;
    "accent-foreground": OklchColor;
    destructive: OklchColor;
    "destructive-foreground": OklchColor;
    border: OklchColor;
    input: OklchColor;
    ring: OklchColor;
    "chart-1": OklchColor;
    "chart-2": OklchColor;
    "chart-3": OklchColor;
    "chart-4": OklchColor;
    "chart-5": OklchColor;
    sidebar: OklchColor;
    "sidebar-foreground": OklchColor;
    "sidebar-primary": OklchColor;
    "sidebar-primary-foreground": OklchColor;
    "sidebar-accent": OklchColor;
    "sidebar-accent-foreground": OklchColor;
    "sidebar-border": OklchColor;
    "sidebar-ring": OklchColor;
}
type ThemeKey = keyof ThemeConfig;
type ThemeMode = "light" | "dark";
type PartialThemeConfig = Partial<Record<ThemeKey, OklchColor>>;
interface ShadowColor extends OklchColor {
    a: number;
}
interface ShadowConfig {
    "shadow-color": ShadowColor;
    "shadow-2xs": string;
    "shadow-xs": string;
    "shadow-sm": string;
    shadow: string;
    "shadow-md": string;
    "shadow-lg": string;
    "shadow-xl": string;
    "shadow-2xl": string;
}
type ShadowKey = keyof ShadowConfig;
interface TypographyConfig {
    fontSans: string;
    fontSerif: string;
    fontMono: string;
    letterSpacing: string;
}
interface LayoutConfig {
    radius: string;
    borderWidth: string;
    borderStyle: string;
}
interface ThemeBundle {
    light: ThemeConfig;
    dark: ThemeConfig;
}
type ComponentThemeOverride = Partial<Record<ThemeMode, PartialThemeConfig>>;
type ComponentOverrideMap = Record<string, ComponentThemeOverride>;
interface ThemeMetadata {
    name?: string;
    description?: string;
    version?: string;
    tags?: string[];
}
interface ThemeDefinition {
    themes: ThemeBundle;
    typography: TypographyConfig;
    layout: LayoutConfig;
    shadows: ShadowConfig;
    components?: ComponentOverrideMap;
    metadata?: ThemeMetadata;
}
interface ValidationIssue {
    path: string;
    message: string;
    severity: "error" | "warning";
}
interface ValidationResult<T> {
    valid: boolean;
    value: T;
    issues: ValidationIssue[];
}
interface ThemePairContrastResult {
    pair: string;
    ratio: number;
    passesAA: boolean;
    passesAAA: boolean;
}
interface AccessibilityReport {
    overallScore: number;
    passingPairs: number;
    failingPairs: number;
    minimumContrast: number;
    pairs: ThemePairContrastResult[];
}
type ConvergenceExportFormat = "css" | "tailwind-v4" | "json" | "shadcn";
interface ExportOptions {
    minify?: boolean;
    includeThemeInline?: boolean;
    includeComments?: boolean;
}
interface ImportOptions {
    baseDefinition?: ThemeDefinition;
}
interface ThemeExporter {
    id: ConvergenceExportFormat | string;
    label: string;
    export: (definition: ThemeDefinition, options?: ExportOptions) => string;
}
interface ThemeImporter {
    id: string;
    label: string;
    import: (source: string, options?: ImportOptions) => ThemeDefinition;
}
interface EngineOptions {
    autoApply?: boolean;
    strictValidation?: boolean;
    selectors?: Partial<Record<ThemeMode, string>>;
}
interface SetColorOptions {
    mode?: ThemeMode;
    component?: string;
}

declare const LIGHT_THEME: ThemeConfig;
declare const DARK_THEME: ThemeConfig;
declare const COLD_THEME: ThemeConfig;
declare const WARM_THEME: ThemeConfig;
declare const VERDANT_THEME: ThemeConfig;
declare const LIGHT_SHADOWS: ShadowConfig;
declare const DARK_SHADOWS: ShadowConfig;
declare const COLD_SHADOWS: ShadowConfig;
declare const WARM_SHADOWS: ShadowConfig;
declare const VERDANT_SHADOWS: ShadowConfig;
declare const DEFAULT_TYPOGRAPHY: TypographyConfig;
declare const DEFAULT_LAYOUT: LayoutConfig;
declare const PRESET_SHADOWS: Record<string, ShadowConfig>;
declare const PRESETS: Record<string, ThemeConfig>;
declare const DEFAULT_THEME_DEFINITION: ThemeDefinition;

declare const convertOklchToHex: (color: OklchColor) => string;
declare const convertHexToOklch: (hex: string) => OklchColor;
declare const parseCssColor: (str: string) => OklchColor | null;

declare const THEME_KEYS: ThemeKey[];
declare const SHADOW_KEYS: ShadowKey[];
declare const CONTRAST_PAIRS: readonly [readonly ["background", "foreground"], readonly ["card", "card-foreground"], readonly ["popover", "popover-foreground"], readonly ["primary", "primary-foreground"], readonly ["secondary", "secondary-foreground"], readonly ["muted", "muted-foreground"], readonly ["accent", "accent-foreground"], readonly ["destructive", "destructive-foreground"], readonly ["sidebar", "sidebar-foreground"], readonly ["sidebar-primary", "sidebar-primary-foreground"], readonly ["sidebar-accent", "sidebar-accent-foreground"]];

declare const validateThemeConfig: (value: ThemeConfig) => ValidationResult<ThemeConfig>;
declare const validateThemeDefinition: (value: ThemeDefinition) => ValidationResult<ThemeDefinition>;
declare const assertThemeDefinition: (value: ThemeDefinition) => ThemeDefinition;
declare const mergeThemeConfig: (base: ThemeConfig, overrides?: PartialThemeConfig) => ThemeConfig;

declare const getContrastRatio: (foreground: OklchColor, background: OklchColor) => number;
declare const scoreThemeAccessibility: (theme: ThemeConfig) => AccessibilityReport;

declare const createThemeCss: (definition: ThemeDefinition, options?: ExportOptions, selectors?: Record<ThemeMode, string>) => string;
declare const cssVariablesExporter: ThemeExporter;
declare const tailwindV4Exporter: ThemeExporter;
declare const jsonExporter: ThemeExporter;
declare const shadcnExporter: ThemeExporter;
declare class ExportRegistry {
    private exporters;
    constructor(exporters?: ThemeExporter[]);
    register(exporter: ThemeExporter): this;
    get(id: string): ThemeExporter | undefined;
    list(): ThemeExporter[];
    export(id: string, definition: ThemeDefinition, options?: ExportOptions): string;
}
declare const defaultExportRegistry: ExportRegistry;
declare const cssVariablesImporter: ThemeImporter;
declare const importThemeDefinition: (source: string, type?: "css" | "json", baseDefinition?: ThemeDefinition) => ThemeDefinition;
declare const exportThemeDefinition: (definition: ThemeDefinition, format: string, options?: ExportOptions) => string;
declare const resolveThemeForComponent: (definition: ThemeDefinition, mode: ThemeMode, component?: string) => ThemeConfig;

declare class ConvergenceEngine {
    private definition;
    private readonly options;
    constructor(initialDefinition: ThemeDefinition | ThemeConfig, options?: EngineOptions);
    private validate;
    private update;
    getDefinition(): ThemeDefinition;
    getConfig(mode?: ThemeMode): ThemeConfig;
    getResolvedTheme(mode?: ThemeMode, component?: string): ThemeConfig;
    setDefinition(nextDefinition: ThemeDefinition): void;
    setTheme(mode: ThemeMode, theme: ThemeConfig): void;
    setOklch(key: ThemeKey, color: Partial<OklchColor>, options?: SetColorOptions): void;
    setTypography(values: Partial<TypographyConfig>): void;
    setLayout(values: Partial<LayoutConfig>): void;
    setShadow(key: ShadowKey, value: ShadowConfig[ShadowKey]): void;
    setComponentOverride(component: string, mode: ThemeMode, values: PartialThemeConfig): void;
    clearComponentOverride(component: string, mode?: ThemeMode): void;
    export(format: string, options?: ExportOptions): string;
    setAutoApply(enabled: boolean): void;
    import(source: string, type?: "css" | "json"): ThemeDefinition;
    generateCss(options?: ExportOptions): string;
    applyDefinition(): void;
    syncDefinitionFromDom(): ThemeDefinition;
    syncFromDom(): ThemeConfig;
}
declare const createComponentThemeAttributes: (component: string) => {
    "data-convergence-component": string;
};
declare const resolveThemeOverrides: (theme: ThemeConfig, overrides?: PartialThemeConfig) => ThemeConfig;

interface ConvergenceProps {
    initialConfig?: ThemeConfig;
    initialDefinition?: ThemeDefinition;
    className?: string;
    syncStart?: boolean;
}
declare function Convergence({ initialConfig, initialDefinition, className, syncStart, }: ConvergenceProps): react_jsx_runtime.JSX.Element;

interface ConvergenceThemeStyleProps {
    definition: ThemeDefinition;
    id?: string;
}
declare function ConvergenceThemeStyle({ definition, id, }: ConvergenceThemeStyleProps): react_jsx_runtime.JSX.Element;

export { type AccessibilityReport, COLD_SHADOWS, COLD_THEME, CONTRAST_PAIRS, type ComponentOverrideMap, type ComponentThemeOverride, Convergence, ConvergenceEngine, type ConvergenceExportFormat, ConvergenceThemeStyle, DARK_SHADOWS, DARK_THEME, DEFAULT_LAYOUT, DEFAULT_THEME_DEFINITION, DEFAULT_TYPOGRAPHY, type EngineOptions, type ExportOptions, ExportRegistry, type ImportOptions, LIGHT_SHADOWS, LIGHT_THEME, type LayoutConfig, type OklchColor, PRESETS, PRESET_SHADOWS, type PartialThemeConfig, SHADOW_KEYS, type SetColorOptions, type ShadowColor, type ShadowConfig, type ShadowKey, THEME_KEYS, type ThemeBundle, type ThemeConfig, type ThemeDefinition, type ThemeExporter, type ThemeImporter, type ThemeKey, type ThemeMetadata, type ThemeMode, type ThemePairContrastResult, type TypographyConfig, VERDANT_SHADOWS, VERDANT_THEME, type ValidationIssue, type ValidationResult, WARM_SHADOWS, WARM_THEME, assertThemeDefinition, convertHexToOklch, convertOklchToHex, createComponentThemeAttributes, createThemeCss, cssVariablesExporter, cssVariablesImporter, defaultExportRegistry, exportThemeDefinition, getContrastRatio, importThemeDefinition, jsonExporter, mergeThemeConfig, parseCssColor, resolveThemeForComponent, resolveThemeOverrides, scoreThemeAccessibility, shadcnExporter, tailwindV4Exporter, validateThemeConfig, validateThemeDefinition };
