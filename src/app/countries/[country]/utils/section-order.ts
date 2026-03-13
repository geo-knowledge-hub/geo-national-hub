/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { CountryComponentConfig } from '@content-types/content';

/**
 * Section IDs for reorderable page sections (excludes hero + sticky nav).
 */
export type SectionId =
  | 'explore'
  | 'mechanisms'
  | 'capacity-building'
  | 'community'
  | 'stakeholders'
  | 'representatives'
  | 'marketplace';

/**
 * Default section order when no custom configuration exists.
 */
export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'explore',
  'mechanisms',
  'capacity-building',
  'community',
  'stakeholders',
  'representatives',
  'marketplace',
];

/**
 * Display labels for each section ID.
 */
export const SECTION_LABELS: Record<SectionId, string> = {
  explore: 'Explore',
  mechanisms: 'Mechanisms',
  'capacity-building': 'Capacity Building',
  community: 'Community',
  stakeholders: 'Stakeholders',
  representatives: 'Representatives',
  marketplace: 'Marketplace',
};

/**
 * Returns section IDs sorted by the `order` defined in the component configs.
 */
export function getOrderedSectionIds(componentConfigs?: CountryComponentConfig[]): SectionId[] {
  if (!componentConfigs || componentConfigs.length === 0) {
    return [...DEFAULT_SECTION_ORDER];
  }

  // Build a map of sectionId
  const orderMap = new Map<string, number>();
  for (const config of componentConfigs) {
    if (config.order !== undefined && config.order !== null) {
      orderMap.set(config.componentId, config.order);
    }
  }

  // If no configs have order values, return default
  if (orderMap.size === 0) {
    return [...DEFAULT_SECTION_ORDER];
  }

  // Split into ordered and unordered sections
  const ordered: SectionId[] = [];
  const unordered: SectionId[] = [];

  for (const id of DEFAULT_SECTION_ORDER) {
    if (orderMap.has(id)) {
      ordered.push(id);
    } else {
      unordered.push(id);
    }
  }

  // Sort the ordered sections by their order value
  ordered.sort((a, b) => (orderMap.get(a) ?? 0) - (orderMap.get(b) ?? 0));

  // Append unordered sections at the end in default order
  return [...ordered, ...unordered];
}
