/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { Country } from '@content-types/content';

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
 * Configuration for all available page sections
 * Maps section keys to their metadata
 * ToDo: Any better way to do this?
 */
export const sectionConfig: Record<string, SectionInfo> = {
  explore: { id: 'explore', label: 'Explore', order: 1 },
  stakeholders: { id: 'stakeholders', label: 'Stakeholders', order: 2 },
  mechanisms: { id: 'mechanisms', label: 'Mechanisms', order: 3 },
  community: { id: 'community', label: 'Community', order: 4 },
  learn: { id: 'learn', label: 'Learn', order: 5 },
  representatives: { id: 'representatives', label: 'Representatives', order: 6 },
};

/**
 * Determines which sections are available based on country data
 *
 * @param countryData - The country data object
 * @param hasResources - Whether the country has resources (for Focus Areas section)
 * @returns Array of available sections sorted by display order
 */
export function getAvailableSections(countryData: Country, hasResources: boolean): SectionInfo[] {
  const available: SectionInfo[] = [];

  // Focus Areas (Explore) - requires resources to be meaningful
  if (hasResources) {
    available.push(sectionConfig.explore);
  }

  // Stakeholders/Partners
  if (countryData.partners && countryData.partners.length > 0) {
    available.push(sectionConfig.stakeholders);
  }

  // Enabling Mechanisms
  if (countryData.mechanisms && countryData.mechanisms.length > 0) {
    available.push(sectionConfig.mechanisms);
  }

  // Community of Practice
  if (countryData.community_of_practice) {
    available.push(sectionConfig.community);
  }

  // Capacity Building (Learn)
  if (
    countryData.capacity_building_activities &&
    countryData.capacity_building_activities.length > 0
  ) {
    available.push(sectionConfig.learn);
  }

  // Key Representatives
  if (countryData.representatives && countryData.representatives.length > 0) {
    available.push(sectionConfig.representatives);
  }

  // Sort by display order
  return available.sort((a, b) => a.order - b.order);
}
