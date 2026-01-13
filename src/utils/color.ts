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
