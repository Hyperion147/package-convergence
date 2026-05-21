import {
  LayoutConfig,
  OklchColor,
  PartialThemeConfig,
  ShadowColor,
  ShadowConfig,
  ThemeConfig,
  ThemeDefinition,
  ThemeKey,
  TypographyConfig,
  ValidationIssue,
  ValidationResult,
} from "../types";
import { SHADOW_KEYS, THEME_KEYS } from "./constants";

const cloneIssues = (issues: ValidationIssue[]): ValidationIssue[] =>
  issues.map((issue) => ({ ...issue }));

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const validateOklchColor = (
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): value is OklchColor => {
  if (!value || typeof value !== "object") {
    issues.push({ path, message: "Expected an OKLCH color object.", severity: "error" });
    return false;
  }

  const color = value as Record<string, unknown>;
  const numericKeys: Array<keyof OklchColor> = ["l", "c", "h"];

  for (const key of numericKeys) {
    if (!isFiniteNumber(color[key])) {
      issues.push({
        path: `${path}.${key}`,
        message: "Expected a finite number.",
        severity: "error",
      });
    }
  }

  if (isFiniteNumber(color.l) && (color.l < 0 || color.l > 1)) {
    issues.push({
      path: `${path}.l`,
      message: "Lightness should be between 0 and 1.",
      severity: "warning",
    });
  }

  if (isFiniteNumber(color.c) && color.c < 0) {
    issues.push({
      path: `${path}.c`,
      message: "Chroma should be zero or greater.",
      severity: "warning",
    });
  }

  return true;
};

const validateShadowColor = (
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): value is ShadowColor => {
  if (!validateOklchColor(value, path, issues)) {
    return false;
  }

  const alpha = (value as unknown as Record<string, unknown>).a;
  if (!isFiniteNumber(alpha)) {
    issues.push({
      path: `${path}.a`,
      message: "Expected an alpha value between 0 and 1.",
      severity: "error",
    });
    return false;
  }

  if (alpha < 0 || alpha > 1) {
    issues.push({
      path: `${path}.a`,
      message: "Alpha should be between 0 and 1.",
      severity: "warning",
    });
  }

  return true;
};

const validateStringRecord = (
  value: unknown,
  requiredKeys: string[],
  path: string,
  issues: ValidationIssue[],
) => {
  if (!value || typeof value !== "object") {
    issues.push({ path, message: "Expected an object.", severity: "error" });
    return;
  }

  const record = value as Record<string, unknown>;
  for (const key of requiredKeys) {
    if (typeof record[key] !== "string") {
      issues.push({
        path: `${path}.${key}`,
        message: "Expected a string value.",
        severity: "error",
      });
    }
  }
};

export const validateThemeConfig = (value: ThemeConfig): ValidationResult<ThemeConfig> => {
  const issues: ValidationIssue[] = [];
  const theme = value as unknown as Record<string, unknown>;

  for (const key of THEME_KEYS) {
    validateOklchColor(theme[key], `themes.${key}`, issues);
  }

  return {
    valid: issues.every((issue) => issue.severity !== "error"),
    value,
    issues,
  };
};

const validatePartialThemeConfig = (
  value: PartialThemeConfig | undefined,
  path: string,
  issues: ValidationIssue[],
) => {
  if (!value) {
    return;
  }

  for (const [key, color] of Object.entries(value)) {
    validateOklchColor(color, `${path}.${key}`, issues);
  }
};

const validateTypography = (value: TypographyConfig, issues: ValidationIssue[]) => {
  validateStringRecord(
    value,
    ["fontSans", "fontSerif", "fontMono", "letterSpacing"],
    "typography",
    issues,
  );
};

const validateLayout = (value: LayoutConfig, issues: ValidationIssue[]) => {
  validateStringRecord(
    value,
    ["radius", "borderWidth", "borderStyle"],
    "layout",
    issues,
  );
};

const validateShadows = (value: ShadowConfig, issues: ValidationIssue[]) => {
  if (!value || typeof value !== "object") {
    issues.push({ path: "shadows", message: "Expected a shadow config object.", severity: "error" });
    return;
  }

  validateShadowColor(
    (value as unknown as Record<string, unknown>)["shadow-color"],
    "shadows.shadow-color",
    issues,
  );

  for (const key of SHADOW_KEYS) {
    if (key === "shadow-color") {
      continue;
    }
    if (typeof (value as unknown as Record<string, unknown>)[key] !== "string") {
      issues.push({
        path: `shadows.${key}`,
        message: "Expected a CSS shadow string.",
        severity: "error",
      });
    }
  }
};

export const validateThemeDefinition = (
  value: ThemeDefinition,
): ValidationResult<ThemeDefinition> => {
  const issues: ValidationIssue[] = [];

  if (!value || typeof value !== "object") {
    issues.push({
      path: "themeDefinition",
      message: "Expected a theme definition object.",
      severity: "error",
    });
    return { valid: false, value, issues };
  }

  if (!value.themes || typeof value.themes !== "object") {
    issues.push({ path: "themes", message: "Expected light and dark theme objects.", severity: "error" });
  } else {
    const themes = value.themes as unknown as Record<string, ThemeConfig>;
    if (!themes.light) {
      issues.push({ path: "themes.light", message: "Expected a light theme object.", severity: "error" });
    } else {
      validateThemeConfig(themes.light).issues.forEach((issue) =>
        issues.push({
          ...issue,
          path: issue.path.replace("themes.", "themes.light."),
        }),
      );
    }

    if (!themes.dark) {
      issues.push({ path: "themes.dark", message: "Expected a dark theme object.", severity: "error" });
    } else {
      validateThemeConfig(themes.dark).issues.forEach((issue) =>
        issues.push({
          ...issue,
          path: issue.path.replace("themes.", "themes.dark."),
        }),
      );
    }
  }

  validateTypography(value.typography, issues);
  validateLayout(value.layout, issues);
  validateShadows(value.shadows, issues);

  if (value.components) {
    for (const [componentName, override] of Object.entries(value.components)) {
      validatePartialThemeConfig(override.light, `components.${componentName}.light`, issues);
      validatePartialThemeConfig(override.dark, `components.${componentName}.dark`, issues);
    }
  }

  return {
    valid: issues.every((issue) => issue.severity !== "error"),
    value,
    issues: cloneIssues(issues),
  };
};

export const assertThemeDefinition = (value: ThemeDefinition): ThemeDefinition => {
  const result = validateThemeDefinition(value);
  if (!result.valid) {
    const errorMessage = result.issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n");
    throw new Error(`Invalid Convergence theme definition.\n${errorMessage}`);
  }
  return value;
};

export const mergeThemeConfig = (
  base: ThemeConfig,
  overrides?: PartialThemeConfig,
): ThemeConfig => {
  const next = { ...base } as ThemeConfig;
  if (!overrides) {
    return next;
  }

  for (const key of Object.keys(overrides) as ThemeKey[]) {
    const override = overrides[key];
    if (override) {
      next[key] = override;
    }
  }

  return next;
};
