import { converter, Oklch, formatHex } from 'culori';
import { OklchColor } from '../types';

const oklchToCulori = (color: OklchColor): Oklch => ({
  mode: 'oklch',
  l: color.l,
  c: color.c,
  h: color.h
});

const culoriToOklch = (color: Oklch): OklchColor => ({
  l: color.l || 0,
  c: color.c || 0,
  h: color.h || 0
});

const toOklch = converter('oklch');

export const convertOklchToHex = (color: OklchColor): string => {
  return formatHex(oklchToCulori(color));
};

export const convertHexToOklch = (hex: string): OklchColor => {
  const oklch = toOklch(hex);
  if (!oklch) {
    // Fallback if invalid hex
    return { l: 0, c: 0, h: 0 };
  }
  return culoriToOklch(oklch);
};

export const parseCssColor = (str: string): OklchColor | null => {
  if (!str) return null;
  const trimmed = str.trim();
  
  // Try direct parsing
  let parsed = toOklch(trimmed);
  
  // If failed, it might be a raw value list used in Tailwind variables like "210 40% 98%" (hsl) or similar
  if (!parsed) {
    // heuristic: check if it looks like raw numbers
    if (/^[\d\.]+(\%|deg)?(\s+[\d\.]+(\%|deg)?){2,}(\s*\/\s*[\d\.]+%?)?$/.test(trimmed)) {
       // Try wrapping in hsl() as a common fallback for shadcn-like vars
       parsed = toOklch(`hsl(${trimmed})`);
       
       // If that failed, try oklch()
       if (!parsed) {
         parsed = toOklch(`oklch(${trimmed})`);
       }
    }
  }

  if (parsed) {
    return culoriToOklch(parsed);
  }

  return null;
};
