/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { Country, CountryComponentConfig } from '@content-types/content';

import { getOrderedSectionIds, type SectionId } from './section-order';

/**
 * Section information for quick access navigation
 */
export interface SectionInfo {
  /** HTML anchor id for the section */
  id: string;
  /** Button label displayed to users */
  label: string;
  /** Display order in the navigation */
  order: number;
}

/**
 * Configuration for all page sections
 */
export const sectionConfig: Record<string, SectionInfo> = {
  explore: { id: 'explore', label: 'Explore', order: 1 },
  mechanisms: { id: 'mechanisms', label: 'Mechanisms', order: 2 },
  learn: { id: 'learn', label: 'Learn', order: 3 },
  community: { id: 'community', label: 'Community', order: 4 },
  stakeholders: { id: 'stakeholders', label: 'Stakeholders', order: 5 },
  representatives: { id: 'representatives', label: 'Representatives', order: 6 },
  marketplace: { id: 'marketplace', label: 'Marketplace', order: 7 },
};

/**
 * Maps section-order IDs to sectionConfig keys.
 */
const sectionIdToConfigKey: Record<string, string> = {
  explore: 'explore',
  mechanisms: 'mechanisms',
  'capacity-building': 'learn',
  community: 'community',
  stakeholders: 'stakeholders',
  representatives: 'representatives',
  marketplace: 'marketplace',
};

/**
 * Get available section IDs
 *
 * @param countryData - The country data object
 * @param hasResources - Whether the country has resources
 * @returns Array of SectionId values that have data
 */
export function getAvailableSectionIds(countryData: Country, hasResources: boolean): SectionId[] {
  const checks: [SectionId, boolean][] = [
    ['explore', hasResources],
    ['mechanisms', (countryData.mechanisms?.length ?? 0) > 0],
    ['capacity-building', (countryData.capacity_building_activities?.length ?? 0) > 0],
    ['community', !!countryData.community_of_practice],
    ['stakeholders', (countryData.partners?.length ?? 0) > 0],
    ['representatives', (countryData.representatives?.length ?? 0) > 0],
    ['marketplace', (countryData.marketplace?.businesses?.length ?? 0) > 0],
  ];

  return checks.filter(([, available]) => available).map(([id]) => id);
}

/**
 * Determines which sections are available based on country data
 *
 * @param countryData - The country data object
 * @param hasResources - Whether the country has resources (for Focus Areas section)
 * @param componentConfigs - Optional component configs for custom ordering
 * @returns Array of available sections sorted by display order
 */
export function getAvailableSections(
  countryData: Country,
  hasResources: boolean,
  componentConfigs?: CountryComponentConfig[],
): SectionInfo[] {
  const availableIds = new Set<SectionId>(getAvailableSectionIds(countryData, hasResources));

  // Map SectionIds to their sectionConfig keys
  const availableConfigKeys = new Set<string>();
  for (const id of availableIds) {
    const configKey = sectionIdToConfigKey[id];

    if (configKey) {
      availableConfigKeys.add(configKey);
    }
  }

  // Get ordered section IDs and map to config keys
  const orderedIds = getOrderedSectionIds(componentConfigs);
  const available: SectionInfo[] = [];

  for (let i = 0; i < orderedIds.length; i++) {
    const configKey = sectionIdToConfigKey[orderedIds[i]];

    if (configKey && availableConfigKeys.has(configKey) && sectionConfig[configKey]) {
      available.push({ ...sectionConfig[configKey], order: i });
    }
  }

  return available;
}
