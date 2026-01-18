"use client";

import { ThemeConfig, OklchColor, ThemeKey } from './types';
import { parseCssColor } from './utils/color';

export * from './types';
export * from './defaults';
export * from './components/Convergence';

export class ConvergenceEngine {
  private config: ThemeConfig;

  constructor(initialConfig: ThemeConfig, options: { autoApply?: boolean } = { autoApply: true }) {
    this.config = initialConfig;
    if (options.autoApply) {
      this.applyFullTheme(initialConfig);
    }
  }

  public syncFromDom(): ThemeConfig {
    if (typeof document === 'undefined') return { ...this.config };
    
    const computed = getComputedStyle(document.documentElement);
    const newConfig = { ...this.config };
    
    (Object.keys(newConfig) as ThemeKey[]).forEach(key => {
        const val = computed.getPropertyValue(`--${key}`);
        if (val) {
            const parsed = parseCssColor(val);
            if (parsed) {
                newConfig[key] = parsed;
            }
        }
    });
    
    this.config = newConfig;
    return newConfig;
  }

  /**
   * Updates a specific color and injects it into the DOM
   */
  public setOklch(key: ThemeKey, color: Partial<OklchColor>): void {
    if (!this.config[key]) {
      console.warn(`Theme key "${key}" does not exist.`);
      return;
    }

    this.config[key] = { ...this.config[key], ...color };
    
    const { l, c, h } = this.config[key];
    
    const cssValue = `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(3)})`;
    
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(`--${key}`, cssValue);
    }
  }

  public applyFullTheme(config: ThemeConfig): void {
    if (typeof document === 'undefined') return;
    this.config = config;
    (Object.keys(config) as ThemeKey[]).forEach((key) => {
      const { l, c, h } = config[key];
    const cssValue = `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(3)})`;
      document.documentElement.style.setProperty(`--${key}`, cssValue);
    });
  }
  
  public getConfig(): ThemeConfig {
    return { ...this.config };
  }
}