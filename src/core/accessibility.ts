import { converter } from "culori";
import {
  AccessibilityReport,
  OklchColor,
  ThemeConfig,
  ThemePairContrastResult,
} from "../types";
import { CONTRAST_PAIRS } from "./constants";

type RgbColor = {
  r?: number;
  g?: number;
  b?: number;
};

const toRgb = converter("rgb");

const channelToLinear = (channel: number): number => {
  if (channel <= 0.03928) {
    return channel / 12.92;
  }

  return Math.pow((channel + 0.055) / 1.055, 2.4);
};

const relativeLuminance = (color: OklchColor): number => {
  const rgb = toRgb({ mode: "oklch", ...color }) as RgbColor | undefined;
  if (!rgb || rgb.r == null || rgb.g == null || rgb.b == null) {
    return 0;
  }

  const r = channelToLinear(rgb.r);
  const g = channelToLinear(rgb.g);
  const b = channelToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const getContrastRatio = (foreground: OklchColor, background: OklchColor): number => {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
};

export const scoreThemeAccessibility = (theme: ThemeConfig): AccessibilityReport => {
  const pairs: ThemePairContrastResult[] = CONTRAST_PAIRS.map(([backgroundKey, foregroundKey]) => {
    const ratio = getContrastRatio(theme[foregroundKey], theme[backgroundKey]);
    return {
      pair: `${foregroundKey} on ${backgroundKey}`,
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
    };
  });

  const minimumContrast = pairs.reduce(
    (minimum, pair) => Math.min(minimum, pair.ratio),
    Number.POSITIVE_INFINITY,
  );
  const passingPairs = pairs.filter((pair) => pair.passesAA).length;
  const failingPairs = pairs.length - passingPairs;
  const overallScore = Math.round((passingPairs / pairs.length) * 100);

  return {
    overallScore,
    passingPairs,
    failingPairs,
    minimumContrast: Number.isFinite(minimumContrast) ? minimumContrast : 0,
    pairs,
  };
};
