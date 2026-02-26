/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Utility Functions
 *
 * Common utility functions used across the application.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with proper precedence handling.
 *
 * @param inputs - Class values to merge
 * @returns Merged class string with conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prepends the basePath to local asset paths for proper resolution.
 *
 * Next.js does not automatically prepend basePath to string src values
 * in the Image component, so we need to handle this manually for
 * images loaded from JSON/Typesense data.
 *
 * @param path - The asset path (e.g., "/content/flags/flag-australia.png")
 * @returns The path with basePath prepended for local assets, or unchanged for external URLs
 */
export function getAssetPath(path: string): string {
  // Return empty string for falsy values
  if (!path) return '';

  // Don't modify external URLs
  if (path.startsWith('http') || path.startsWith('//')) {
    return path;
  }

  // Prepend basePath for local assets
  const basePath = process.env.__NEXT_ROUTER_BASEPATH || '/national';
  return `${basePath}${path}`;
}

/**
 * Converts a hex color string to an HSL string in "H S% L%" format
 *
 * @param hex - Hex color string (e.g. "#526479")
 * @returns HSL string (e.g. "213 19% 40%")
 */
export function hexToHslString(hex: string): string {
  const h = hex.replace(/^#/, '');

  if (h.length !== 6) {
    return '0 0% 0%';
  }

  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return `0 0% ${Math.round(l * 100)}%`;
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let hue = 0;
  if (max === r) {
    hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    hue = ((b - r) / d + 2) / 6;
  } else {
    hue = ((r - g) / d + 4) / 6;
  }

  return `${Math.round(hue * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
