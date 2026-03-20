/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX, createElement } from 'react';
import { StaticImageData } from 'next/image';

import type { CountryComponentConfig, Supporter } from '@content-types/content';
import { ComponentRegistryEntry } from '../types/component-registry';
import { componentRegistry, getVariant } from '../registry/components';
import { getDefaultTheme } from './theme';

/**
 * Props for rendering any component from the registry
 */
interface RenderComponentProps {
  /** The registry entry for this component category */
  registryEntry: ComponentRegistryEntry;
  /** Variant ID to render (falls back to default) */
  variantId?: string;
  /** Props to pass to the component */
  props: Record<string, unknown>;
}

/**
 * Generic component renderer - dynamically renders any registered component
 * This is the scalable approach that works with any component in the registry
 */
export function renderComponent({
  registryEntry,
  variantId,
  props,
}: RenderComponentProps): JSX.Element | null {
  const variant = getVariant(registryEntry, variantId || registryEntry.defaultVariant);

  if (!variant?.component) {
    console.warn(`No component found for variant: ${variantId} in ${registryEntry.componentId}`);
    return null;
  }

  return createElement(variant.component, props);
}

/**
 * Props specific to hero rendering
 */
interface HeroRendererProps {
  countryId: string;
  title: string;
  description: string;
  imageSrc?: string | StaticImageData;
  imageAlt?: string;
  componentConfigs?: CountryComponentConfig[];
  theme?: { primary_color?: string };
  managedBy?: string;
  managedByLink?: string;
  supporters?: Supporter[];
  /** Override variant - used for live preview when hovering over options */
  overrideVariant?: string;
}

/**
 * Renders the appropriate hero component based on country configuration
 * Uses the component registry for dynamic, scalable rendering
 */
export function renderHeroComponent({
  countryId,
  title,
  description,
  imageSrc,
  imageAlt,
  componentConfigs,
  theme,
  managedBy,
  managedByLink,
  supporters,
  overrideVariant,
}: HeroRendererProps): JSX.Element {
  // Get hero config from country configuration
  const heroConfig = componentConfigs?.find((c) => c.componentId === 'hero');

  // Override variant takes precedence (used for live preview)
  const variantId =
    overrideVariant || heroConfig?.variantId || componentRegistry.hero.defaultVariant;

  // Get theme colors
  const countryTheme = theme || getDefaultTheme();
  const primaryColor = countryTheme.primary_color || '#526479';

  // Build props for the hero component
  const heroProps = {
    countryId,
    title,
    description,
    imageSrc,
    imageAlt,
    primaryColor,
    managedBy,
    managedByLink,
    supporters,
    // Include any custom props from configuration
    ...heroConfig?.customProps,
  };

  // Use the generic renderer
  const rendered = renderComponent({
    registryEntry: componentRegistry.hero,
    variantId,
    props: heroProps,
  });

  // Fallback in case rendering fails
  if (!rendered) {
    return <div className="p-8 text-center text-gray-500">Hero component not found</div>;
  }

  return rendered;
}
