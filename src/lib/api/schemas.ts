/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { z } from 'zod';

/**
 * Schema for a single component configuration
 */
export const componentConfigSchema = z.object({
  componentId: z.string().min(1, 'Component ID is required'),
  variantId: z.string().min(1, 'Variant ID is required'),
  enabled: z.boolean(),
  order: z.number().int().optional(),
  customProps: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Schema for component configs array in API requests
 */
export const componentConfigsSchema = z.object({
  component_configs: z.array(componentConfigSchema),
});

/**
 * Schema for country theme in API requests
 */
export const themeSchema = z.object({
  primary_color: z.string().min(1, 'Primary color is required'),
  secondary_color: z.string().optional(),
  accent_color: z.string().optional(),
  background_color: z.string().optional(),
  hero_variant: z.string().min(1, 'Hero variant is required'),
  background_image: z.string().optional(),
});

/**
 * Schema for theme update request
 */
export const themeUpdateSchema = z.object({
  theme: themeSchema,
});

/**
 * Exported types from schemas
 */
export type ComponentConfig = z.infer<typeof componentConfigSchema>;
export type ComponentConfigsRequest = z.infer<typeof componentConfigsSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type ThemeUpdateRequest = z.infer<typeof themeUpdateSchema>;
