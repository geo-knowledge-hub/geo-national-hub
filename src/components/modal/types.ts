/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { Resource, SyncMetadata } from '@content-types/content';

/**
 * Props - Resource overview dialog
 */
export interface ResourceOverviewDialogProps {
  open: boolean;
  onClose: () => void;
  data: Resource;
}

/**
 * Props - GKH metadata dialog
 */
export interface GkhMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  data: Resource;
  syncMetadata: SyncMetadata;
}

/**
 * Types - GKH contributor
 */
export interface GkhContributor {
  person_or_org: {
    type: 'personal' | 'organizational';
    name: string;
    given_name?: string;
    family_name?: string;
  };
  role?: { id: string; title: Record<string, string> };
  affiliations?: Array<{ name: string }>;
}

/**
 * Types - GKH subject
 */
export interface GkhSubject {
  subject: string;
}

/**
 * Types - GKH right
 */
export interface GkhRight {
  id: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  props?: { url?: string };
}

/**
 * Types - GKH related identifier
 */
export interface GkhRelatedIdentifier {
  identifier: string;
  scheme: string;
  relation_type?: { title: Record<string, string> };
  title?: string;
  description?: string;
}

/**
 * Types - GKH target audience
 */
export interface GkhTargetAudience {
  id: string;
  title: Record<string, string>;
}

/**
 * Types - GKH engagement priority
 */
export interface GkhEngagementPriority {
  id: string;
  title: Record<string, string>;
}

/**
 * Types - GKH GEO work programme activity
 */
export interface GkhGeoWorkProgrammeActivity {
  id: string;
  title: Record<string, string>;
}

/**
 * Types - GKH language
 */
export interface GkhLanguage {
  id: string;
  title: Record<string, string>;
}

/**
 * Types - Metadata fields
 */
export interface MetadataFields {
  title: string | undefined;
  description: string | undefined;
  publicationDate: string | undefined;
  publisher: string | undefined;
  resourceTypeTitle: string | undefined;
  baseType: string | undefined;
  creators: GkhContributor[];
  contributors: GkhContributor[];
  contactPersons: GkhContributor[];
  otherContributors: GkhContributor[];
  subjects: GkhSubject[];
  languages: GkhLanguage[];
  rights: GkhRight[];
  targetAudiences: GkhTargetAudience[];
  relatedIdentifiers: GkhRelatedIdentifier[];
  engagementPriorities: GkhEngagementPriority[];
  gwpActivity: GkhGeoWorkProgrammeActivity | undefined;
}
