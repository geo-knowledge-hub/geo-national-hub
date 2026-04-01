/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

/**
 * Extend Zod with OpenAPI support
 */
extendZodWithOpenApi(z);

/**
 * Comma-separated string -> trimmed, non-empty string array
 */
const csvList = z
  .string()
  .transform((s) =>
    s
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean),
  )
  .openapi({ type: 'string', description: 'Comma-separated values' });

/**
 * Bbox string -> validated [west, south, east, north] tuple
 */
const bboxTuple = z
  .string()
  .transform((s, ctx) => {
    const coords = s.split(',').map(Number);
    if (coords.length !== 4 || coords.some((c) => !Number.isFinite(c))) {
      ctx.addIssue({
        code: 'custom',
        message: 'bbox must be four comma-separated numbers: west,south,east,north.',
      });
      return z.NEVER;
    }
    return coords as [number, number, number, number];
  })
  .openapi({ type: 'string', example: '-10,4,2,12' });

/**
 * Search parameters schema
 */
export const searchParamsSchema = z.object({
  q: z
    .string()
    .default('*')
    .openapi({ description: 'Full-text search query. Use "*" to match all documents.' }),
  size: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .openapi({ description: 'Results per page (1–100).' }),
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1)
    .openapi({ description: 'Page number (1-indexed).' }),
  sort: z
    .string()
    .optional()
    .openapi({ description: 'Typesense sort expression, e.g. uploaded:desc.' }),
  bbox: bboxTuple.optional().openapi({
    description: 'Bounding box filter: west,south,east,north (longitude/latitude).',
  }),
  resource_type: csvList.optional().openapi({
    description: 'Filter by resource_type.id (comma-separated, OR-combined).',
  }),
  country: csvList.optional().openapi({
    description: 'Filter by country name (comma-separated, OR-combined).',
  }),
  country_id: csvList.optional().openapi({
    description: 'Filter by country ID (comma-separated, OR-combined).',
  }),
  challenges: csvList.optional().openapi({
    description: 'Filter by challenge identifiers (comma-separated, OR-combined).',
  }),
  facets: z
    .string()
    .optional()
    .openapi({ description: 'Facet fields to compute counts for (comma-separated).' }),
  format: z
    .enum(['gkh'])
    .optional()
    .openapi({ description: 'Output format. Alternative to Accept header. Values: "gkh".' }),
  help: z
    .literal('true')
    .optional()
    .openapi({ description: 'When "true", returns endpoint documentation.' }),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

/**
 * Search metadata schema
 */
export const searchMetaSchema = z
  .object({
    query: z.string(),
    total: z.number(),
    page: z.number(),
    size: z.number(),
    total_pages: z.number(),
  })
  .openapi('SearchMeta');

/**
 * Facet count schema
 */
export const facetCountSchema = z
  .object({
    value: z.string(),
    count: z.number(),
  })
  .openapi('FacetCount');

/**
 * Search response schema
 */
export const searchResponseSchema = z
  .object({
    meta: searchMetaSchema,
    data: z.array(z.unknown()).openapi({ description: 'Array of Resource documents.' }),
    facets: z.record(z.string(), z.array(facetCountSchema)),
  })
  .openapi('SearchResponse');

/**
 * GKH hit schema
 */
export const gkhHitSchema = z
  .object({
    id: z.string(),
    metadata: z.object({
      resource_type: z.object({ id: z.string(), title: z.object({ en: z.string() }) }),
      title: z.string(),
      creators: z.array(z.unknown()),
      description: z.string(),
      publication_date: z.string().nullable(),
      publisher: z.string().nullable(),
      subjects: z.array(z.object({ subject: z.string() })),
      locations: z.unknown().optional(),
      rights: z.array(z.unknown()),
    }),
  })
  .openapi('GkhHit');

/**
 * GKH response schema
 */
export const gkhResponseSchema = z
  .object({
    hits: z.object({
      hits: z.array(gkhHitSchema),
      total: z.number(),
    }),
  })
  .openapi('GkhResponse');
