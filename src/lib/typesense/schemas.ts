/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Typesense Collection Schemas
 *
 * Defines the structure for Typesense collections used for indexing and searching.
 * These schemas are used during collection creation and seeding.
 */

/**
 * Countries collection schema
 */
export const countriesSchema = {
  name: 'countries',
  enable_nested_fields: true,
  fields: [
    // Core
    { name: 'id', type: 'string' as const },
    { name: 'title', type: 'string' as const },
    { name: 'flag', type: 'string' as const, index: false },

    // Theme (nested object)
    { name: 'theme', type: 'object' as const, optional: true },
    { name: 'theme.primary_color', type: 'string' as const, optional: true },
    { name: 'theme.secondary_color', type: 'string' as const, optional: true },
    { name: 'theme.accent_color', type: 'string' as const, optional: true },
    { name: 'theme.background_color', type: 'string' as const, optional: true },
    { name: 'theme.hero_variant', type: 'string' as const, optional: true },
    { name: 'theme.background_image', type: 'string' as const, optional: true },

    // Managed by (hosting organization)
    { name: 'managed_by', type: 'object' as const, optional: true },
    { name: 'managed_by.name', type: 'string' as const, optional: true },
    { name: 'managed_by.url', type: 'string' as const, index: false, optional: true },

    // Partners (embedded array)
    { name: 'partners', type: 'object[]' as const, optional: true },
    { name: 'partners.name', type: 'string[]' as const, optional: true },
    { name: 'partners.description', type: 'string[]' as const, optional: true },
    { name: 'partners.logo', type: 'string[]' as const, index: false, optional: true },
    { name: 'partners.link', type: 'string[]' as const, index: false, optional: true },

    // Representatives (embedded array)
    { name: 'representatives', type: 'object[]' as const, optional: true },
    { name: 'representatives.name', type: 'string[]' as const, optional: true },
    { name: 'representatives.role', type: 'string[]' as const, optional: true },
    { name: 'representatives.profile', type: 'string[]' as const, index: false, optional: true },
    { name: 'representatives.avatar', type: 'string[]' as const, index: false, optional: true },

    // Community of Practice (embedded object)
    { name: 'community_of_practice', type: 'object' as const, optional: true },
    { name: 'community_of_practice.name', type: 'string' as const, optional: true },
    { name: 'community_of_practice.description', type: 'string' as const, optional: true },
    { name: 'community_of_practice.logo', type: 'string' as const, index: false, optional: true },
    { name: 'community_of_practice.link', type: 'string' as const, index: false, optional: true },

    // Mechanisms (embedded array)
    { name: 'mechanisms', type: 'object[]' as const, optional: true },
    { name: 'mechanisms.name', type: 'string[]' as const, optional: true },
    { name: 'mechanisms.description', type: 'string[]' as const, optional: true },
    { name: 'mechanisms.link', type: 'string[]' as const, index: false, optional: true },
    { name: 'mechanisms.logo', type: 'string[]' as const, index: false, optional: true },

    // Capacity Building Activities (embedded array)
    { name: 'capacity_building_activities', type: 'object[]' as const, optional: true },
    { name: 'capacity_building_activities.title', type: 'string[]' as const, optional: true },
    { name: 'capacity_building_activities.description', type: 'string[]' as const, optional: true },
    {
      name: 'capacity_building_activities.link',
      type: 'string[]' as const,
      index: false,
      optional: true,
    },
    {
      name: 'capacity_building_activities.logo',
      type: 'string[]' as const,
      index: false,
      optional: true,
    },
    { name: 'capacity_building_activities.date', type: 'string[]' as const, optional: true },
    { name: 'capacity_building_activities.recurring', type: 'bool[]' as const, optional: true },
    { name: 'capacity_building_activities.source', type: 'string[]' as const, optional: true },

    // Component Configurations (for customizable page layouts)
    { name: 'component_configs', type: 'object[]' as const, optional: true },
    { name: 'component_configs.componentId', type: 'string[]' as const, optional: true },
    { name: 'component_configs.variantId', type: 'string[]' as const, optional: true },
    { name: 'component_configs.enabled', type: 'bool[]' as const, optional: true },
    { name: 'component_configs.order', type: 'int32[]' as const, optional: true },

    // Marketplace (embedded object with nested businesses and applications)
    { name: 'marketplace', type: 'object' as const, optional: true },
    { name: 'marketplace.businesses', type: 'object[]' as const, optional: true },
    { name: 'marketplace.businesses.id', type: 'string[]' as const, optional: true },
    { name: 'marketplace.businesses.name', type: 'string[]' as const, optional: true },
    { name: 'marketplace.businesses.tagline', type: 'string[]' as const, optional: true },
    { name: 'marketplace.businesses.description', type: 'string[]' as const, optional: true },
    {
      name: 'marketplace.businesses.logo',
      type: 'string[]' as const,
      index: false,
      optional: true,
    },
    {
      name: 'marketplace.businesses.website_url',
      type: 'string[]' as const,
      index: false,
      optional: true,
    },
    { name: 'marketplace.businesses.established', type: 'string[]' as const, optional: true },
    { name: 'marketplace.businesses.focus_areas', type: 'string[]' as const, optional: true },
    { name: 'marketplace.businesses.featured', type: 'bool[]' as const, optional: true },
    { name: 'marketplace.businesses.applications', type: 'object[]' as const, optional: true },
    {
      name: 'marketplace.businesses.applications.id',
      type: 'string[]' as const,
      optional: true,
    },
    {
      name: 'marketplace.businesses.applications.title',
      type: 'string[]' as const,
      optional: true,
    },
    {
      name: 'marketplace.businesses.applications.description',
      type: 'string[]' as const,
      optional: true,
    },
    {
      name: 'marketplace.businesses.applications.icon',
      type: 'string[]' as const,
      index: false,
      optional: true,
    },
    {
      name: 'marketplace.businesses.applications.access_url',
      type: 'string[]' as const,
      index: false,
      optional: true,
    },
    {
      name: 'marketplace.businesses.applications.website_url',
      type: 'string[]' as const,
      index: false,
      optional: true,
    },
    {
      name: 'marketplace.businesses.applications.focus_areas',
      type: 'string[]' as const,
      optional: true,
    },
    {
      name: 'marketplace.businesses.applications.app_type',
      type: 'string[]' as const,
      optional: true,
    },
    {
      name: 'marketplace.businesses.applications.access_model',
      type: 'string[]' as const,
      optional: true,
    },
    {
      name: 'marketplace.businesses.applications.version',
      type: 'string[]' as const,
      optional: true,
    },
    {
      name: 'marketplace.businesses.applications.last_updated',
      type: 'string[]' as const,
      optional: true,
    },
    {
      name: 'marketplace.businesses.applications.data_formats',
      type: 'string[]' as const,
      optional: true,
    },
    {
      name: 'marketplace.businesses.applications.screenshots',
      type: 'string[]' as const,
      index: false,
      optional: true,
    },
    { name: 'marketplace.config', type: 'object' as const, optional: true },
    { name: 'marketplace.config.section_title', type: 'string' as const, optional: true },
    { name: 'marketplace.config.intro_text', type: 'string' as const, optional: true },
    { name: 'marketplace.config.featured_business', type: 'string' as const, optional: true },
    { name: 'marketplace.config.app_sort_order', type: 'string' as const, optional: true },
  ],
};

/**
 * Resources collection schema
 */
export const resourcesSchema = {
  name: 'resources',
  enable_nested_fields: true,
  fields: [
    { name: 'id', type: 'string' as const },
    { name: 'country_id', type: 'string' as const, facet: true },
    { name: 'country', type: 'string' as const, facet: true },
    { name: 'name', type: 'string' as const },
    { name: 'overview', type: 'string' as const, optional: true },
    { name: 'description', type: 'string' as const },
    { name: 'license', type: 'string' as const, optional: true },
    { name: 'subjects', type: 'string' as const, optional: true },
    { name: 'locations', type: 'string' as const, optional: true },
    { name: 'link', type: 'string' as const },
    { name: 'icon', type: 'string' as const, index: false },
    { name: 'type', type: 'string' as const, facet: true },
    { name: 'uploaded', type: 'string' as const },
    { name: 'challenges', type: 'string[]' as const, facet: true },
    { name: 'extras', type: 'string[]' as const, optional: true },
    { name: 'geo_gwp', type: 'string' as const, facet: true, optional: true },
    { name: 'geo_themes', type: 'string[]' as const, facet: true, optional: true },
    { name: 'contributors', type: 'string[]' as const, optional: true },
    { name: 'target_audiences', type: 'string[]' as const, facet: true, optional: true },
    { name: 'organization', type: 'string' as const, facet: true, optional: true },
    { name: 'source', type: 'string' as const, facet: true, optional: true },
    { name: 'sync', type: 'object' as const, optional: true },
    { name: 'sync.synced_at', type: 'string' as const, optional: true },
    { name: 'sync.sync_status', type: 'string' as const, optional: true, facet: true },
    { name: 'sync.metadata_hash', type: 'string' as const, optional: true },
  ],
};

/**
 * Health status collection schema
 */
export const healthSchema = {
  name: 'health',
  fields: [
    { name: 'id', type: 'string' as const },
    { name: 'online', type: 'bool' as const },
    { name: 'latency_ms', type: 'int32' as const },
    { name: 'checked_at', type: 'string' as const },
  ],
};

/**
 * Focus Areas collection schema
 */
export const focusAreasSchema = {
  name: 'focus_areas',
  fields: [
    { name: 'id', type: 'string' as const },
    { name: 'key', type: 'string' as const, facet: true },
    { name: 'name', type: 'string' as const },
    { name: 'logo', type: 'string' as const, index: false },
  ],
};

/**
 * Focus Area Challenges collection schema
 */
export const focusAreaChallengesSchema = {
  name: 'focus_area_challenges',
  fields: [
    { name: 'id', type: 'string' as const },
    { name: 'key', type: 'string' as const, facet: true },
    { name: 'title', type: 'string' as const },
    { name: 'description', type: 'string' as const },
    { name: 'tags', type: 'string[]' as const, facet: true },
    { name: 'tag_names', type: 'string[]' as const, facet: true },
    { name: 'logo', type: 'string' as const, index: false },
  ],
};
