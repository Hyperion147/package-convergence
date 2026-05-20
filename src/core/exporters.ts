import {
  ExportOptions,
  LayoutConfig,
  OklchColor,
  PartialThemeConfig,
  ShadowConfig,
  ThemeConfig,
  ThemeDefinition,
  ThemeExporter,
  ThemeImporter,
  ThemeMode,
  TypographyConfig,
} from "../types";
import { SHADOW_KEYS, THEME_KEYS } from "./constants";
import { DEFAULT_THEME_DEFINITION } from "../defaults";
import { mergeThemeConfig } from "./schema";
import { parseCssColor } from "../utils/color";

const DEFAULT_SELECTORS: Record<ThemeMode, string> = {
  light: ":root",
  dark: ".dark",
};

const serializeColor = (color: OklchColor, precision = 4) =>
  `oklch(${color.l.toFixed(precision)} ${color.c.toFixed(precision)} ${color.h.toFixed(3)})`;

const indent = (value: string, minify?: boolean) =>
  minify ? value : value.split("\n").map((line) => (line ? `  ${line}` : line)).join("\n");

const block = (selector: string, lines: string[], minify?: boolean) => {
  const body = lines.join(minify ? "" : "\n");
  if (minify) {
    return `${selector}{${body}}`;
  }
  return `${selector} {\n${indent(body, minify)}\n}`;
};

const buildColorLines = (theme: ThemeConfig) =>
  THEME_KEYS.map((key) => `--${key}: ${serializeColor(theme[key])};`);

const buildTypographyLines = (typography: TypographyConfig) => [
  `--font-sans: ${typography.fontSans};`,
  `--font-serif: ${typography.fontSerif};`,
  `--font-mono: ${typography.fontMono};`,
  `--letter-spacing: ${typography.letterSpacing};`,
];

const buildLayoutLines = (layout: LayoutConfig) => [
  `--radius: ${layout.radius};`,
  `--border-width: ${layout.borderWidth};`,
  `--border-style: ${layout.borderStyle};`,
];

const buildShadowLines = (shadows: ShadowConfig) =>
  SHADOW_KEYS.map((key) =>
    key === "shadow-color"
      ? `--shadow-color: ${serializeColor(shadows["shadow-color"])};`
      : `--${key}: ${shadows[key]};`,
  );

const buildThemeInlineLines = () => [
  ...THEME_KEYS.map((key) => `--color-${key}: var(--${key});`),
  "--font-sans: var(--font-sans);",
  "--font-serif: var(--font-serif);",
  "--font-mono: var(--font-mono);",
  "--radius-sm: calc(var(--radius) - 4px);",
  "--radius-md: calc(var(--radius) - 2px);",
  "--radius-lg: var(--radius);",
  "--radius-xl: calc(var(--radius) + 4px);",
  ...SHADOW_KEYS.map((key) => `--${key}: var(--${key});`),
];

const buildComponentLines = (override?: PartialThemeConfig) => {
  if (!override) {
    return [];
  }

  return Object.entries(override).map(([key, value]) => `--${key}: ${serializeColor(value as OklchColor)};`);
};

export const createThemeCss = (
  definition: ThemeDefinition,
  options: ExportOptions = {},
  selectors: Record<ThemeMode, string> = DEFAULT_SELECTORS,
) => {
  const minify = options.minify ?? false;
  const blocks: string[] = [];

  blocks.push(
    block(
      selectors.light,
      [
        ...buildColorLines(definition.themes.light),
        ...buildTypographyLines(definition.typography),
        ...buildLayoutLines(definition.layout),
        ...buildShadowLines(definition.shadows),
      ],
      minify,
    ),
  );

  blocks.push(block(selectors.dark, buildColorLines(definition.themes.dark), minify));

  if (definition.components) {
    for (const [componentName, override] of Object.entries(definition.components)) {
      const attrSelector = `[data-convergence-component="${componentName}"]`;
      if (override.light) {
        blocks.push(block(attrSelector, buildComponentLines(override.light), minify));
      }
      if (override.dark) {
        blocks.push(block(`${selectors.dark} ${attrSelector}`, buildComponentLines(override.dark), minify));
      }
    }
  }

  return blocks.join(minify ? "" : "\n\n");
};

export const cssVariablesExporter: ThemeExporter = {
  id: "css",
  label: "CSS Variables",
  export: (definition, options = {}) => createThemeCss(definition, options),
};

export const tailwindV4Exporter: ThemeExporter = {
  id: "tailwind-v4",
  label: "Tailwind v4",
  export: (definition, options = {}) => {
    const minify = options.minify ?? false;
    const css = createThemeCss(definition, options);
    const themeInline = block("@theme inline", buildThemeInlineLines(), minify).replace("@theme inline {", "@theme inline {");
    return [css, themeInline].join(minify ? "" : "\n\n");
  },
};

export const jsonExporter: ThemeExporter = {
  id: "json",
  label: "Theme JSON",
  export: (definition, options = {}) =>
    JSON.stringify(definition, null, options.minify ? 0 : 2),
};

export const shadcnExporter: ThemeExporter = {
  id: "shadcn",
  label: "shadcn/ui CSS Variables",
  export: (definition, options = {}) => createThemeCss(definition, options),
};

export class ExportRegistry {
  private exporters = new Map<string, ThemeExporter>();

  constructor(exporters: ThemeExporter[] = []) {
    exporters.forEach((exporter) => this.register(exporter));
  }

  register(exporter: ThemeExporter) {
    this.exporters.set(exporter.id, exporter);
    return this;
  }

  get(id: string) {
    return this.exporters.get(id);
  }

  list() {
    return Array.from(this.exporters.values());
  }

  export(id: string, definition: ThemeDefinition, options?: ExportOptions) {
    const exporter = this.exporters.get(id);
    if (!exporter) {
      throw new Error(`Unknown Convergence exporter "${id}".`);
    }
    return exporter.export(definition, options);
  }
}

export const defaultExportRegistry = new ExportRegistry([
  cssVariablesExporter,
  tailwindV4Exporter,
  jsonExporter,
  shadcnExporter,
]);

const parseVarBlock = (css: string, selector: string) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`, "g");
  const matches = Array.from(css.matchAll(regex));
  if (matches.length === 0) {
    return "";
  }
  return matches.map((match) => match[1]).join("\n");
};

const readVariables = (blockContent: string) => {
  const entries = Array.from(blockContent.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi));
  return new Map(entries.map((entry) => [entry[1], entry[2].trim()]));
};

const applyThemeVariables = (base: ThemeConfig, variables: Map<string, string>): ThemeConfig => {
  const next = { ...base } as ThemeConfig;
  for (const key of THEME_KEYS) {
    const value = variables.get(key);
    if (!value) {
      continue;
    }
    const parsed = parseCssColor(value);
    if (parsed) {
      next[key] = parsed;
    }
  }
  return next;
};

const applyTypographyVariables = (base: TypographyConfig, variables: Map<string, string>): TypographyConfig => ({
  fontSans: variables.get("font-sans") ?? base.fontSans,
  fontSerif: variables.get("font-serif") ?? base.fontSerif,
  fontMono: variables.get("font-mono") ?? base.fontMono,
  letterSpacing: variables.get("letter-spacing") ?? base.letterSpacing,
});

const applyLayoutVariables = (base: LayoutConfig, variables: Map<string, string>): LayoutConfig => ({
  radius: variables.get("radius") ?? base.radius,
  borderWidth: variables.get("border-width") ?? base.borderWidth,
  borderStyle: variables.get("border-style") ?? base.borderStyle,
});

const applyShadowVariables = (base: ShadowConfig, variables: Map<string, string>): ShadowConfig => {
  const next = { ...base };
  const shadowColor = variables.get("shadow-color");
  if (shadowColor) {
    const parsed = parseCssColor(shadowColor);
    if (parsed) {
      next["shadow-color"] = { ...parsed, a: base["shadow-color"].a };
    }
  }

  for (const key of SHADOW_KEYS) {
    if (key === "shadow-color") {
      continue;
    }
    const value = variables.get(key);
    if (value) {
      next[key] = value;
    }
  }
  return next;
};

export const cssVariablesImporter: ThemeImporter = {
  id: "css-variables",
  label: "CSS Variables",
  import: (source, options = {}) => {
    const base = options.baseDefinition ?? DEFAULT_THEME_DEFINITION;
    const rootBlock = parseVarBlock(source, ":root");
    const darkBlock = parseVarBlock(source, ".dark");
    const rootVariables = readVariables(rootBlock);
    const darkVariables = readVariables(darkBlock);

    return {
      ...base,
      themes: {
        light: applyThemeVariables(base.themes.light, rootVariables),
        dark: applyThemeVariables(base.themes.dark, darkVariables),
      },
      typography: applyTypographyVariables(base.typography, rootVariables),
      layout: applyLayoutVariables(base.layout, rootVariables),
      shadows: applyShadowVariables(base.shadows, rootVariables),
      metadata: {
        ...base.metadata,
        name: base.metadata?.name ?? "Imported theme",
      },
    };
  },
};

export const importThemeDefinition = (
  source: string,
  type: "css" | "json" = "css",
  baseDefinition = DEFAULT_THEME_DEFINITION,
) => {
  if (type === "json") {
    return JSON.parse(source) as ThemeDefinition;
  }

  return cssVariablesImporter.import(source, { baseDefinition });
};

export const exportThemeDefinition = (
  definition: ThemeDefinition,
  format: string,
  options?: ExportOptions,
) => defaultExportRegistry.export(format, definition, options);

export const resolveThemeForComponent = (
  definition: ThemeDefinition,
  mode: ThemeMode,
  component?: string,
) => {
  if (!component) {
    return definition.themes[mode];
  }

  return mergeThemeConfig(definition.themes[mode], definition.components?.[component]?.[mode]);
};
