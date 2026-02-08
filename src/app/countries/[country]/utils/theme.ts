/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { CountryTheme } from '@content-types/content';

/**
 * Default theme definition
 */
const defaultTheme: CountryTheme = {
  primary_color: '#526479',
  secondary_color: '#3d4d5f',
  accent_color: '#6b7d9a',
  background_color: '#f8f9fb',
  hero_variant: 'default',
};

/**
 * Get default theme
 */
export function getDefaultTheme(): CountryTheme {
  return { ...defaultTheme };
}

/**
 * Get theme or return default
 * @param theme Optional theme to use, falls back to default if not provided
 */
export function getThemeOrDefault(theme?: CountryTheme | null): CountryTheme {
  return theme || getDefaultTheme();
}

/**
 * Rough luminance of a hex color (0–1). Used to decide if background is "dark".
 */
function hexLuminance(hex: string): number {
  const h = hex.replace(/^#/, '');

  if (h.length !== 6) {
    return 1;
  }

  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Apply theme styles to an element
 * Sets --theme-surface for cards: soft gray when background is darker, white otherwise
 */
export function applyThemeStyles(theme: CountryTheme) {
  const bg = theme.background_color || '#ffffff';
  const luminance = hexLuminance(bg);
  const surface = luminance < 0.92 ? '#f4f5f7' : '#ffffff';

  return {
    '--theme-primary': theme.primary_color,
    '--theme-secondary': theme.secondary_color || theme.primary_color,
    '--theme-accent': theme.accent_color || theme.primary_color,
    '--theme-background': bg,
    '--theme-surface': surface,
  } as React.CSSProperties;
}
