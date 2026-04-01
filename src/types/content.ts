/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Vocabulary reference
 *
 * Used for resource_type, geo_work_programme_activity, target_audiences,
 * engagement_priorities, affiliations, roles, etc.
 */
export interface VocabRef {
  id: string;
  name: string;
}

/**
 * Structured creator
 */
export interface ResourceCreator {
  person_or_org: {
    type: 'personal' | 'organizational';
    name: string;
    given_name?: string;
    family_name?: string;
  };
  affiliations?: VocabRef[];
  role?: VocabRef;
}

/**
 * License / rights entry
 */
export interface ResourceRight {
  id: string;
  title: { [lang: string]: string };
  link?: string;
}

/**
 * Spatial locations
 */
export interface ResourceLocations {
  features?: Array<{
    geometry?: Record<string, unknown>;
    place?: string;
    description?: string;
  }>;
  centroid?: [number, number];
  bbox?: [number, number][];
}

/**
 * Sync field
 */
export interface SyncField {
  metadata_hash: string;
  synced_at: string;
  sync_status: 'ok' | 'error' | 'partial';
  sync_error?: string;
}

/**
 * Combined payload
 */
export type SyncPayload = Partial<Resource> & { sync: SyncField };

/**
 * Health status
 */
export interface HealthStatus {
  online: boolean;
  latency_ms: number;
  checked_at: string;
}

/**
 * Resource item
 */
export interface Resource {
  id: string;
  name: string;
  description: string;
  link: string;
  icon: string;
  uploaded: string;
  country: string;
  country_id: string;
  organization?: string;
  source?: string;

  /** Resource type */
  resource_type: VocabRef;

  /** GEO Work Programme Activity */
  geo_work_programme_activity?: VocabRef;

  /** GEO Engagement Priorities (SDGs, conventions, etc.) */
  engagement_priorities?: VocabRef[];

  /** Target audiences */
  target_audiences?: VocabRef[];

  /** Challenges */
  challenges: string[];

  /** Subject keywords */
  subjects?: string[];

  /** Structured creators */
  creators?: ResourceCreator[];

  /** License / rights entries */
  rights?: ResourceRight[];

  /** Whether this resource has spatial location data */
  has_location?: boolean;

  /** Spatial locations */
  locations?: ResourceLocations;

  /** Publication date */
  publication_date?: string;

  /** Publisher name */
  publisher?: string;

  /** Extra fields */
  extras?: {
    doi?: string;
    cstr?: string;
    temporal_start?: string;
    temporal_end?: string;
    contact_email?: string;
    citation?: string;
  };

  /** Operational sync state */
  sync?: SyncField;
}

/**
 * Capacity building activity
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
 * Representative contact
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
 * Supporter organization for a country page
 */
export interface Supporter {
  name: string;
  url?: string;
  logo: string;
}

/**
 * External hub configuration — when set, this country's hub is hosted externally.
 */
export interface ExternalHub {
  url: string;
}

/**
 * Marketplace application offered by a business
 */
export interface MarketplaceApplication {
  id: string;
  title: string;
  description: string;
  icon: string;
  access_url: string;
  website_url?: string;
  focus_areas: string[];
  app_type: 'Web App' | 'Mobile' | 'API' | 'Dataset' | 'Other';
  access_model: 'Free' | 'Open' | 'Free (with subscription)' | 'Subscription';
  version?: string;
  last_updated?: string;
  data_formats?: string[];
  screenshots?: string[];
}

/**
 * Marketplace business / organization
 */
export interface MarketplaceBusiness {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  website_url?: string;
  established?: string;
  focus_areas: string[];
  applications: MarketplaceApplication[];
  featured?: boolean;
}

/**
 * Marketplace configuration
 */
export interface MarketplaceConfig {
  section_title?: string;
  intro_text?: string;
  featured_business?: string;
  visible_columns?: string[];
  app_sort_order?: 'manual' | 'alphabetical';
}

/**
 * Marketplace data embedded in a country record
 */
export interface Marketplace {
  businesses: MarketplaceBusiness[];
  config?: MarketplaceConfig;
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
  supporters?: Supporter[];
  external_hub?: ExternalHub;
  partners: Partner[];
  representatives: Representative[];
  community_of_practice?: CommunityOfPractice;
  mechanisms: Mechanism[];
  capacity_building_activities: CapacityBuildingActivity[];
  component_configs?: CountryComponentConfig[];
  marketplace?: Marketplace;
  feedback_url?: string;
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
 * Icon type for React components
 */
export type HeroIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;
