/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { Resource } from '@content-types/content';
import type { Exporter, ExporterResult, SearchMeta, FacetsResult } from './types';

/**
 * Maps a Resource document to the GEO Knowledge Hub metadata format.
 */
function toGkhHit(resource: Resource) {
  return {
    id: resource.id,
    metadata: {
      resource_type: {
        id: resource.resource_type.id,
        title: { en: resource.resource_type.name },
      },
      title: resource.name,
      creators: (resource.creators ?? []).map((c) => ({
        person_or_org: {
          type: c.person_or_org.type,
          name: c.person_or_org.name,
          ...(c.person_or_org.given_name && { given_name: c.person_or_org.given_name }),
          ...(c.person_or_org.family_name && { family_name: c.person_or_org.family_name }),
        },
        ...(c.affiliations && {
          affiliations: c.affiliations.map((a) => ({ id: a.id, name: a.name })),
        }),
        ...(c.role && { role: { id: c.role.id, title: { en: c.role.name } } }),
      })),
      description: resource.description,
      publication_date: resource.publication_date ?? null,
      publisher: resource.publisher ?? null,
      subjects: (resource.subjects ?? []).map((s) => ({ subject: s })),
      locations: resource.locations?.features
        ? { features: resource.locations.features }
        : undefined,
      rights: (resource.rights ?? []).map((r) => ({
        id: r.id,
        ...(r.title && { title: r.title }),
        ...(r.link && { link: r.link }),
      })),
    },
  };
}

/**
 * GKH metadata exporter.
 *
 * Produces a response shaped like the GEO Knowledge Hub API (Elasticsearch format):
 * `{ hits: { hits: [...], total } }`.
 */
export const gkhExporter: Exporter = {
  export(data: Resource[], meta: SearchMeta, _facets: FacetsResult): ExporterResult {
    return {
      body: {
        hits: {
          hits: data.map(toGkhHit),
          total: meta.total,
        },
      },
      contentType: 'application/vnd.gkh+json',
    };
  },
};
