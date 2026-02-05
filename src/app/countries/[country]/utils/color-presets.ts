/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Color preset definition
 */
export interface ColorPreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

/**
 * Curated color presets aligned with the system design
 * Each preset provides a cohesive color scheme with primary, secondary, accent, and background colors
 * Background colors are light tints that complement the primary color while maintaining readability
 */
export const colorPresets: ColorPreset[] = [
  {
    id: 'steel-blue',
    name: 'Steel Blue',
    primary: '#526479',
    secondary: '#3d4d5f',
    accent: '#6b7d9a',
    background: '#f8f9fb',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    primary: '#c2410c',
    secondary: '#9a3412',
    accent: '#fb923c',
    background: '#fff7ed',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    primary: '#b07258',
    secondary: '#8c5a46',
    accent: '#d4967c',
    background: '#faf6f4',
  },
  {
    id: 'saffron',
    name: 'Saffron',
    primary: '#c49450',
    secondary: '#9c7640',
    accent: '#e0b870',
    background: '#fcfaf0',
  },
  {
    id: 'sage',
    name: 'Sage',
    primary: '#6b8f71',
    secondary: '#526d57',
    accent: '#8fb396',
    background: '#f5f8f5',
  },
  {
    id: 'mauve',
    name: 'Mauve',
    primary: '#9f7f8f',
    secondary: '#7d6370',
    accent: '#c4a3b3',
    background: '#faf7f8',
  },
  {
    id: 'taupe',
    name: 'Taupe',
    primary: '#8f8070',
    secondary: '#6d6256',
    accent: '#b3a494',
    background: '#faf8f5',
  },
  {
    id: 'wheat',
    name: 'Wheat',
    primary: '#b5a06a',
    secondary: '#918050',
    accent: '#d4c48a',
    background: '#faf9f5',
  },
];

/**
 * Get a color preset by ID
 */
export function getColorPreset(id: string): ColorPreset | undefined {
  return colorPresets.find((preset) => preset.id === id);
}

/**
 * Get the default color preset (Steel Blue)
 */
export function getDefaultColorPreset(): ColorPreset {
  return colorPresets[0];
}

/**
 * Find matching preset for a given primary color
 */
export function findPresetByPrimaryColor(primaryColor: string): ColorPreset | undefined {
  return colorPresets.find((preset) => preset.primary.toLowerCase() === primaryColor.toLowerCase());
}
