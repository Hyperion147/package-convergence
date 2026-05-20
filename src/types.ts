export interface OklchColor {
  l: number;
  c: number;
  h: number;
}

export interface ThemeConfig {
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

export type ThemeKey = keyof ThemeConfig;
export type ThemeMode = "light" | "dark";
export type PartialThemeConfig = Partial<Record<ThemeKey, OklchColor>>;

export interface ShadowColor extends OklchColor {
  a: number;
}

export interface ShadowConfig {
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

export type ShadowKey = keyof ShadowConfig;

export interface TypographyConfig {
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  letterSpacing: string;
}

export interface LayoutConfig {
  radius: string;
  borderWidth: string;
  borderStyle: string;
}

export interface ThemeBundle {
  light: ThemeConfig;
  dark: ThemeConfig;
}

export type ComponentThemeOverride = Partial<Record<ThemeMode, PartialThemeConfig>>;
export type ComponentOverrideMap = Record<string, ComponentThemeOverride>;

export interface ThemeMetadata {
  name?: string;
  description?: string;
  version?: string;
  tags?: string[];
}

export interface ThemeDefinition {
  themes: ThemeBundle;
  typography: TypographyConfig;
  layout: LayoutConfig;
  shadows: ShadowConfig;
  components?: ComponentOverrideMap;
  metadata?: ThemeMetadata;
}

export interface ValidationIssue {
  path: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult<T> {
  valid: boolean;
  value: T;
  issues: ValidationIssue[];
}

export interface ThemePairContrastResult {
  pair: string;
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
}

export interface AccessibilityReport {
  overallScore: number;
  passingPairs: number;
  failingPairs: number;
  minimumContrast: number;
  pairs: ThemePairContrastResult[];
}

export type ConvergenceExportFormat = "css" | "tailwind-v4" | "json" | "shadcn";

export interface ExportOptions {
  minify?: boolean;
  includeThemeInline?: boolean;
  includeComments?: boolean;
}

export interface ImportOptions {
  baseDefinition?: ThemeDefinition;
}

export interface ThemeExporter {
  id: ConvergenceExportFormat | string;
  label: string;
  export: (definition: ThemeDefinition, options?: ExportOptions) => string;
}

export interface ThemeImporter {
  id: string;
  label: string;
  import: (source: string, options?: ImportOptions) => ThemeDefinition;
}

export interface EngineOptions {
  autoApply?: boolean;
  strictValidation?: boolean;
  selectors?: Partial<Record<ThemeMode, string>>;
}

export interface SetColorOptions {
  mode?: ThemeMode;
  component?: string;
}
