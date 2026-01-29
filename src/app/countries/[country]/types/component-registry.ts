/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { ComponentType } from 'react';

/**
 * Component categories
 */
export type ComponentCategory =
  | 'hero'
  | 'explore'
  | 'stakeholders'
  | 'mechanisms'
  | 'community'
  | 'representatives';

/**
 * Component variant with reference to the actual React component
 * Uses a generic component type to support any props shape
 */
export interface ComponentVariant {
  id: string;
  name: string;
  description: string;
  preview?: string;
  category: ComponentCategory;
  /**
   * The actual React component to render
   * Uses 'any' props to allow flexibility - type safety is handled at the render site
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
}

/**
 * Component registry entry containing all variants
 */
export interface ComponentRegistryEntry {
  componentId: string;
  componentName: string;
  category: ComponentCategory;
  variants: ComponentVariant[];
  defaultVariant: string;
}

/**
 * Component configuration for a country
 */
export interface ComponentConfiguration {
  componentId: string;
  variantId: string;
  enabled: boolean;
  order?: number;
  customProps?: Record<string, unknown>;
}

/**
 * Full component registry - maps component IDs to their entries
 */
export interface ComponentRegistry {
  [componentId: string]: ComponentRegistryEntry;
}
