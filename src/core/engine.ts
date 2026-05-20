import {
  EngineOptions,
  ExportOptions,
  LayoutConfig,
  OklchColor,
  PartialThemeConfig,
  SetColorOptions,
  ShadowConfig,
  ShadowKey,
  ThemeConfig,
  ThemeDefinition,
  ThemeKey,
  ThemeMode,
  TypographyConfig,
} from "../types";
import { DEFAULT_THEME_DEFINITION } from "../defaults";
import {
  createThemeCss,
  defaultExportRegistry,
  exportThemeDefinition,
  importThemeDefinition,
  resolveThemeForComponent,
} from "./exporters";
import { assertThemeDefinition, mergeThemeConfig, validateThemeDefinition } from "./schema";
import { parseCssColor } from "../utils/color";

const DEFAULT_STYLE_ID = "convergence-theme-runtime";

type NormalizedEngineOptions = {
  autoApply: boolean;
  strictValidation: boolean;
  selectors: Record<ThemeMode, string>;
};

const cloneDefinition = (definition: ThemeDefinition): ThemeDefinition =>
  JSON.parse(JSON.stringify(definition)) as ThemeDefinition;

const normalizeDefinition = (input: ThemeDefinition | ThemeConfig): ThemeDefinition => {
  if ("themes" in input) {
    return cloneDefinition(input);
  }

  return {
    ...cloneDefinition(DEFAULT_THEME_DEFINITION),
    themes: {
      light: input,
      dark: cloneDefinition(DEFAULT_THEME_DEFINITION).themes.dark,
    },
  };
};

export class ConvergenceEngine {
  private definition: ThemeDefinition;
  private readonly options: NormalizedEngineOptions;

  constructor(initialDefinition: ThemeDefinition | ThemeConfig, options: EngineOptions = {}) {
    this.options = {
      autoApply: options.autoApply ?? true,
      strictValidation: options.strictValidation ?? false,
      selectors: {
        light: options.selectors?.light ?? ":root",
        dark: options.selectors?.dark ?? ".dark",
      },
    };

    this.definition = normalizeDefinition(initialDefinition);
    this.validate(this.definition);

    if (this.options.autoApply) {
      this.applyDefinition();
    }
  }

  private validate(definition: ThemeDefinition) {
    const result = validateThemeDefinition(definition);
    if (!result.valid && this.options.strictValidation) {
      assertThemeDefinition(definition);
    }
    return result;
  }

  private update(nextDefinition: ThemeDefinition) {
    this.validate(nextDefinition);
    this.definition = cloneDefinition(nextDefinition);
    if (this.options.autoApply) {
      this.applyDefinition();
    }
  }

  public getDefinition(): ThemeDefinition {
    return cloneDefinition(this.definition);
  }

  public getConfig(mode: ThemeMode = "light"): ThemeConfig {
    return cloneDefinition(this.definition).themes[mode];
  }

  public getResolvedTheme(mode: ThemeMode = "light", component?: string): ThemeConfig {
    return resolveThemeForComponent(this.definition, mode, component);
  }

  public setDefinition(nextDefinition: ThemeDefinition) {
    this.update(nextDefinition);
  }

  public setTheme(mode: ThemeMode, theme: ThemeConfig) {
    this.update({
      ...this.definition,
      themes: {
        ...this.definition.themes,
        [mode]: theme,
      },
    });
  }

  public setOklch(key: ThemeKey, color: Partial<OklchColor>, options: SetColorOptions = {}) {
    const mode = options.mode ?? "light";
    const component = options.component;

    if (!component) {
      const nextColor = {
        ...this.definition.themes[mode][key],
        ...color,
      };
      this.setTheme(mode, {
        ...this.definition.themes[mode],
        [key]: nextColor,
      });
      return;
    }

    const currentOverride = this.definition.components?.[component]?.[mode]?.[key];
    const baseColor = currentOverride ?? this.definition.themes[mode][key];
    const nextColor = {
      ...baseColor,
      ...color,
    };
    this.setComponentOverride(component, mode, { [key]: nextColor });
  }

  public setTypography(values: Partial<TypographyConfig>) {
    this.update({
      ...this.definition,
      typography: {
        ...this.definition.typography,
        ...values,
      },
    });
  }

  public setLayout(values: Partial<LayoutConfig>) {
    this.update({
      ...this.definition,
      layout: {
        ...this.definition.layout,
        ...values,
      },
    });
  }

  public setShadow(key: ShadowKey, value: ShadowConfig[ShadowKey]) {
    this.update({
      ...this.definition,
      shadows: {
        ...this.definition.shadows,
        [key]: value,
      },
    });
  }

  public setComponentOverride(
    component: string,
    mode: ThemeMode,
    values: PartialThemeConfig,
  ) {
    const currentComponents = this.definition.components ?? {};
    const currentOverride = currentComponents[component] ?? {};
    const nextModeOverride = {
      ...(currentOverride[mode] ?? {}),
      ...values,
    };

    this.update({
      ...this.definition,
      components: {
        ...currentComponents,
        [component]: {
          ...currentOverride,
          [mode]: nextModeOverride,
        },
      },
    });
  }

  public clearComponentOverride(component: string, mode?: ThemeMode) {
    if (!this.definition.components?.[component]) {
      return;
    }

    const nextComponents = { ...this.definition.components };
    if (!mode) {
      delete nextComponents[component];
    } else {
      nextComponents[component] = { ...nextComponents[component] };
      delete nextComponents[component][mode];
      if (Object.keys(nextComponents[component]).length === 0) {
        delete nextComponents[component];
      }
    }

    this.update({
      ...this.definition,
      components: nextComponents,
    });
  }

  public export(format: string, options?: ExportOptions) {
    return exportThemeDefinition(this.definition, format, options);
  }

  public setAutoApply(enabled: boolean) {
    this.options.autoApply = enabled;
  }

  public import(source: string, type: "css" | "json" = "css") {
    const nextDefinition = importThemeDefinition(source, type, this.definition);
    this.update(nextDefinition);
    return this.getDefinition();
  }

  public generateCss(options?: ExportOptions) {
    return createThemeCss(this.definition, options, this.options.selectors);
  }

  public applyDefinition() {
    if (typeof document === "undefined") {
      return;
    }

    const styleId = DEFAULT_STYLE_ID;
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = this.generateCss();
  }

  public syncDefinitionFromDom(): ThemeDefinition {
    if (typeof document === "undefined") {
      return this.getDefinition();
    }

    const computed = getComputedStyle(document.documentElement);
    const next = this.getDefinition();

    for (const [key, value] of Object.entries(next.themes.light) as [ThemeKey, OklchColor][]) {
      const cssValue = computed.getPropertyValue(`--${key}`);
      const parsed = parseCssColor(cssValue);
      if (parsed) {
        next.themes.light[key] = parsed;
      } else {
        next.themes.light[key] = value;
      }
    }

    const typography = {
      fontSans: computed.getPropertyValue("--font-sans").trim() || next.typography.fontSans,
      fontSerif: computed.getPropertyValue("--font-serif").trim() || next.typography.fontSerif,
      fontMono: computed.getPropertyValue("--font-mono").trim() || next.typography.fontMono,
      letterSpacing:
        computed.getPropertyValue("--letter-spacing").trim() || next.typography.letterSpacing,
    };

    const layout = {
      radius: computed.getPropertyValue("--radius").trim() || next.layout.radius,
      borderWidth: computed.getPropertyValue("--border-width").trim() || next.layout.borderWidth,
      borderStyle: computed.getPropertyValue("--border-style").trim() || next.layout.borderStyle,
    };

    const shadows: ShadowConfig = { ...next.shadows };
    for (const key of Object.keys(shadows) as ShadowKey[]) {
      const cssValue = computed.getPropertyValue(`--${key}`).trim();
      if (!cssValue) {
        continue;
      }
      if (key === "shadow-color") {
        const parsed = parseCssColor(cssValue);
        if (parsed) {
          shadows[key] = { ...parsed, a: next.shadows["shadow-color"].a };
        }
      } else {
        const shadowKey = key as Exclude<ShadowKey, "shadow-color">;
        shadows[shadowKey] = cssValue;
      }
    }

    const synced = {
      ...next,
      typography,
      layout,
      shadows,
    };

    this.update(synced);
    return synced;
  }

  public syncFromDom(): ThemeConfig {
    return this.syncDefinitionFromDom().themes.light;
  }
}

export const createComponentThemeAttributes = (component: string) => ({
  "data-convergence-component": component,
});

export const resolveThemeOverrides = (
  theme: ThemeConfig,
  overrides?: PartialThemeConfig,
) => mergeThemeConfig(theme, overrides);
