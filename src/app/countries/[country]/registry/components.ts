/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { ComponentRegistry, ComponentRegistryEntry } from '../types/component-registry';
import { HeroClassic, HeroConnections, HeroBackground, HeroWide } from '../components/hero';
import { CapacityBuildingClassic, CapacityBuildingShowcase } from '../components/capacity-building';
import { StakeholdersGrid, StakeholdersDirectory } from '../components/stakeholders';

/**
 * Hero component registry entry
 * Contains all hero variants with their actual component references
 */
export const heroRegistry: ComponentRegistryEntry = {
  componentId: 'hero',
  componentName: 'Hero Section',
  category: 'hero',
  defaultVariant: 'classic',
  variants: [
    {
      id: 'classic',
      name: 'Classic',
      description: 'Simple hero with country flag',
      category: 'hero',
      component: HeroClassic,
    },
    {
      id: 'connections',
      name: 'Connections',
      description: 'Hero with connected nodes showing resource types',
      category: 'hero',
      component: HeroConnections,
    },
    {
      id: 'background',
      name: 'Background Image',
      description: 'Full-width hero with rectangular background image',
      category: 'hero',
      component: HeroBackground,
    },
    {
      id: 'wide',
      name: 'Wide Banner',
      description: 'Full-width hero with wide/banner-style image',
      category: 'hero',
      component: HeroWide,
    },
  ],
};

/**
 * Capacity building component registry entry
 * Contains all capacity building variants with their actual component references
 */
export const capacityBuildingRegistry: ComponentRegistryEntry = {
  componentId: 'capacity-building',
  componentName: 'Capacity Building',
  category: 'capacity-building',
  defaultVariant: 'classic',
  variants: [
    {
      id: 'classic',
      name: 'Classic',
      description: 'CTA card with illustration linking to activities page',
      category: 'capacity-building',
      component: CapacityBuildingClassic,
    },
    {
      id: 'showcase',
      name: 'Showcase',
      description: 'Hexagonal image grid showcasing activity logos',
      category: 'capacity-building',
      component: CapacityBuildingShowcase,
    },
  ],
};

/**
 * Stakeholders component registry
 */
export const stakeholdersRegistry: ComponentRegistryEntry = {
  componentId: 'stakeholders',
  componentName: 'Stakeholders',
  category: 'stakeholders',
  defaultVariant: 'grid',
  variants: [
    {
      id: 'grid',
      name: 'Grid',
      description: 'Logo card grid with search and pagination',
      category: 'stakeholders',
      component: StakeholdersGrid,
    },
    {
      id: 'directory',
      name: 'Directory',
      description: 'Compact horizontal directory list',
      category: 'stakeholders',
      component: StakeholdersDirectory,
    },
  ],
};

/**
 * Main component registry
 */
export const componentRegistry: ComponentRegistry = {
  hero: heroRegistry,
  'capacity-building': capacityBuildingRegistry,
  stakeholders: stakeholdersRegistry,
};

/**
 * Helper function to get a variant from any registry entry
 */
export function getVariant(entry: ComponentRegistryEntry, variantId: string) {
  return (
    entry.variants.find((v) => v.id === variantId) ||
    entry.variants.find((v) => v.id === entry.defaultVariant)
  );
}

/**
 * Helper function to get the component for a variant
 */
export function getVariantComponent(entry: ComponentRegistryEntry, variantId: string) {
  const variant = getVariant(entry, variantId);
  return variant?.component;
}
