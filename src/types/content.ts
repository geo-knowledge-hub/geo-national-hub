/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Content Types
 *
 * App-wide type definitions for content data structures.
 * All field names use snake_case convention for consistency with the data layer.
 */

/**
 * Resource item representing knowledge packages, platforms, etc.
 */
export interface Resource {
  id: string;
  name: string;
  overview: string;
  description: string;
  license: string;
  subjects: string;
  locations: string;
  link: string;
  icon: string;
  type: string;
  uploaded: string;
  country: string;
  country_id: string;
  challenges: string[];
  extras: string[];
  geo_gwp?: string;
  geo_themes?: string[];
  contributors?: string[];
  target_audiences?: string[];
  organization?: string;
}

/**
 * Capacity building activity (workshops, training materials, etc.)
 */
export interface CapacityBuildingActivity {
  title: string;
  description: string;
  link: string;
  logo: string;
  date?: string;
  recurring?: boolean;
  source?: string;
}

/**
 * Partner organization
 */
export interface Partner {
  name: string;
  description: string;
  logo: string;
  link: string;
}

/**
 * Enabling mechanism
 */
export interface Mechanism {
  name: string;
  description: string;
  link: string;
  logo: string;
}

/**
 * Key representative contact
 */
export interface Representative {
  name: string;
  profile: string;
  role: string;
  avatar: string;
}

/**
 * Community of Practice
 */
export interface CommunityOfPractice {
  name: string;
  description: string;
  logo: string;
  link: string;
}

/**
 * Theme configuration for country branding
 */
export interface CountryTheme {
  primary_color: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  hero_variant: string;
  background_image?: string;
}

/**
 * Component configuration for customizable country pages
 */
export interface CountryComponentConfig {
  componentId: string;
  variantId: string;
  enabled: boolean;
  order?: number;
  customProps?: Record<string, unknown>;
}

/**
 * Managed-by metadata for a country (e.g. hosting organization)
 */
export interface ManagedBy {
  name: string;
  url?: string;
}

/**
 * Full country document
 */
export interface Country {
  id: string;
  title: string;
  flag: string;
  theme?: CountryTheme;
  managed_by?: ManagedBy;
  partners: Partner[];
  representatives: Representative[];
  community_of_practice?: CommunityOfPractice;
  mechanisms: Mechanism[];
  capacity_building_activities: CapacityBuildingActivity[];
  component_configs?: CountryComponentConfig[];
}

/**
 * GEO Focus Area
 */
export interface FocusArea {
  id: string;
  key: string;
  name: string;
  logo: string;
}

/**
 * GEO Focus Area Challenge
 */
export interface FocusAreaChallenge {
  id: string;
  key: string;
  title: string;
  description: string;
  tags: string[];
  tag_names: string[];
  logo: string;
}

/**
 * Icon type for React components (HeroIcons)
 */
export type HeroIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;
