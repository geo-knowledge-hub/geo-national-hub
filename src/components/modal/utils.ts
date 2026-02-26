/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type {
  GkhContributor,
  GkhSubject,
  GkhLanguage,
  GkhRight,
  GkhTargetAudience,
  GkhRelatedIdentifier,
  GkhEngagementPriority,
  GkhGeoWorkProgrammeActivity,
  MetadataFields,
} from './types';

/**
 * Resolves i18n object.
 *
 * @param value - Value to resolve.
 * @returns The resolved string, or undefined if not resolvable.
 */
export function resolveI18n(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;

    if (typeof obj.en === 'string') {
      return obj.en;
    }

    for (const v of Object.values(obj)) {
      if (typeof v === 'string') {
        return v;
      }
    }
  }
  return undefined;
}

/**
 * Formats an ISO date string into a human-readable form.
 *
 * @param dateStr - ISO date string.
 * @returns Formatted date like "January 5, 2026".
 */
export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Capitalizes the first letter of a base type string.
 *
 * @param baseType - Raw base type value.
 * @returns Capitalized string.
 */
export function capitalizeBaseType(baseType: string): string {
  return baseType.charAt(0).toUpperCase() + baseType.slice(1);
}

/**
 * Ensures all anchor tags in an HTML string open in a new tab.
 *
 * @param html - Raw HTML string.
 * @returns HTML with all links opening in new tabs.
 */
export function addBlankTargetToLinks(html: string): string {
  return html.replace(/<a\s/gi, '<a target="_blank" rel="noopener noreferrer" ');
}

/**
 * Extract metadata fields from the GKH metadata object.
 *
 * @param meta - GKH metadata object.
 * @returns Metadata fields.
 */
export function extractMetadataFields(meta: Record<string, unknown>): MetadataFields {
  const resourceType = meta.resource_type as
    | { id?: string; title?: Record<string, string> }
    | undefined;

  const creators = (meta.creators as GkhContributor[] | undefined) ?? [];
  const contributors = (meta.contributors as GkhContributor[] | undefined) ?? [];

  return {
    title: resolveI18n(meta.title),
    description: resolveI18n(meta.description),
    publicationDate: resolveI18n(meta.publication_date),
    publisher: resolveI18n(meta.publisher),
    resourceTypeTitle: resolveI18n(resourceType?.title),
    baseType: meta.base_type as string | undefined,
    creators,
    contributors,
    contactPersons: contributors.filter((c) => c.role?.id === 'contactperson'),
    otherContributors: contributors.filter((c) => c.role?.id !== 'contactperson'),
    subjects: (meta.subjects as GkhSubject[] | undefined) ?? [],
    languages: (meta.languages as GkhLanguage[] | undefined) ?? [],
    rights: (meta.rights as GkhRight[] | undefined) ?? [],
    targetAudiences: (meta.target_audiences as GkhTargetAudience[] | undefined) ?? [],
    relatedIdentifiers: (meta.related_identifiers as GkhRelatedIdentifier[] | undefined) ?? [],
    engagementPriorities: (meta.engagement_priorities as GkhEngagementPriority[] | undefined) ?? [],
    gwpActivity: meta.geo_work_programme_activity as GkhGeoWorkProgrammeActivity | undefined,
  };
}
