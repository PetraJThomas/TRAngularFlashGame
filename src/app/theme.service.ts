import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'flash-game-theme';
const DEFAULT_HUE = 270; // purple

/**
 * Convert HSL to hex color string.
 * Using hex avoids any browser issues with light-dark() parsing nested hsl().
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color)))
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generate an M3-style tonal color.
 * Saturation varies with tone to mimic Material's HCT-derived palettes:
 * - Mid tones (30–60) have full saturation for vivid primary colors
 * - Light tones (80–95) boost saturation for vibrant pastels
 * - Extreme tones (0–10, 95–100) desaturate toward neutral
 */
function toneToColor(hue: number, baseSat: number, tone: number): string {
  let s = baseSat;
  if (tone <= 10) {
    s = baseSat * (tone / 10) * 0.8;
  } else if (tone >= 95) {
    s = baseSat * ((100 - tone) / 5) * 0.6;
  } else if (tone >= 80) {
    // Boost saturation for light pastel tones (containers in dark mode, etc.)
    s = Math.min(100, baseSat * 1.3);
  }
  return hslToHex(hue, s, tone);
}

function paletteTokens(
  prefix: string,
  hue: number,
  saturation: number,
): Record<string, string> {
  const t = (tone: number) => toneToColor(hue, saturation, tone);
  return {
    [`--mat-sys-${prefix}`]: `light-dark(${t(42)}, ${t(82)})`,
    [`--mat-sys-on-${prefix}`]: `light-dark(#ffffff, ${t(22)})`,
    [`--mat-sys-${prefix}-container`]: `light-dark(${t(92)}, ${t(32)})`,
    [`--mat-sys-on-${prefix}-container`]: `light-dark(${t(12)}, ${t(92)})`,
    [`--mat-sys-${prefix}-fixed`]: `light-dark(${t(92)}, ${t(92)})`,
    [`--mat-sys-${prefix}-fixed-dim`]: `light-dark(${t(82)}, ${t(82)})`,
    [`--mat-sys-on-${prefix}-fixed`]: `light-dark(${t(12)}, ${t(12)})`,
    [`--mat-sys-on-${prefix}-fixed-variant`]: `light-dark(${t(32)}, ${t(32)})`,
  };
}

function generateM3Tokens(hue: number): Record<string, string> {
  const primarySat = 55;
  const secondarySat = 20;
  const tertiaryHue = (hue + 60) % 360;
  const tertiarySat = 45;

  const tp = (tone: number) => toneToColor(hue, primarySat, tone);

  return {
    ...paletteTokens('primary', hue, primarySat),
    '--mat-sys-inverse-primary': `light-dark(${tp(82)}, ${tp(42)})`,
    ...paletteTokens('secondary', hue, secondarySat),
    ...paletteTokens('tertiary', tertiaryHue, tertiarySat),
    '--mat-sys-surface-tint': `light-dark(${tp(42)}, ${tp(82)})`,
  };
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly darkMode = signal(false);
  readonly hue = signal(DEFAULT_HUE);

  constructor() {
    if (this.isBrowser) {
      this.loadPreferences();

      effect(() => {
        document.documentElement.style.colorScheme = this.darkMode() ? 'dark' : 'light';
        this.savePreferences();
      });

      effect(() => {
        this.applyPalette(this.hue());
        this.savePreferences();
      });
    }
  }

  toggleDarkMode(): void {
    this.darkMode.update(v => !v);
  }

  setHue(hue: number): void {
    this.hue.set(Math.round(Math.min(360, Math.max(0, hue))));
  }

  private applyPalette(hue: number): void {
    const tokens = generateM3Tokens(hue);
    const style = document.documentElement.style;
    for (const [prop, value] of Object.entries(tokens)) {
      style.setProperty(prop, value);
    }
  }

  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const prefs = JSON.parse(stored);
        if (typeof prefs.darkMode === 'boolean') this.darkMode.set(prefs.darkMode);
        if (typeof prefs.hue === 'number') this.hue.set(prefs.hue);
      }
    } catch {
      // ignore malformed storage
    }
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        darkMode: this.darkMode(),
        hue: this.hue(),
      }));
    } catch {
      // ignore storage errors
    }
  }
}
