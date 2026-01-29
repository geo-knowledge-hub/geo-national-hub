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
    id: 'ocean',
    name: 'Ocean',
    primary: '#0369a1',
    secondary: '#075985',
    accent: '#38bdf8',
    background: '#f0f9ff',
  },
  {
    id: 'forest',
    name: 'Forest',
    primary: '#15803d',
    secondary: '#166534',
    accent: '#4ade80',
    background: '#f0fdf4',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    primary: '#c2410c',
    secondary: '#9a3412',
    accent: '#fb923c',
    background: '#fff7ed',
  },
  // {
  //   id: 'violet',
  //   name: 'Violet',
  //   primary: '#7c3aed',
  //   secondary: '#6d28d9',
  //   accent: '#a78bfa',
  //   background: '#faf5ff',
  // },
  // {
  //   id: 'slate',
  //   name: 'Slate',
  //   primary: '#475569',
  //   secondary: '#334155',
  //   accent: '#94a3b8',
  //   background: '#f8fafc',
  // },
  {
    id: 'charcoal',
    name: 'Charcoal',
    primary: '#475569',
    secondary: '#334155',
    accent: '#94a3b8',
    background: '#e2e4e8',
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
