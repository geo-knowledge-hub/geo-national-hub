/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { NextRequest, NextResponse } from 'next/server';

import { getTypesenseClient, COLLECTIONS } from '@lib/typesense/client';
import type { Resource } from '@content-types/content';
import { resolveExporter, type FacetsResult } from './exporters';
import { searchParamsSchema } from './schema';
import { generateOpenApiSpec } from './openapi';

/**
 * Fields to query by
 */
const QUERY_BY_FIELDS = 'name,description,organization,subjects,creators.person_or_org.name';

/**
 * Default facets to compute
 */
const DEFAULT_FACETS = 'resource_type.id,country,challenges';

/**
 * Maps query param names to Typesense field names for array filters
 */
const FILTER_FIELDS: Record<string, string> = {
  resource_type: 'resource_type.id',
  country: 'country',
  country_id: 'country_id',
  challenges: 'challenges',
};

/**
 * Type for Typesense search hit
 */
interface SearchHit<T> {
  document: T;
  highlight?: Record<string, unknown>;
  highlights?: unknown[];
  text_match?: number;
}

/**
 * Builds a Typesense `filter_by` expression from parsed query params
 */
function buildFilterBy(params: {
  resource_type?: string[];
  country?: string[];
  country_id?: string[];
  challenges?: string[];
  bbox?: [number, number, number, number];
}): string | undefined {
  // Initialize parts array
  const parts: string[] = [];

  // Iterate over filter fields
  for (const [param, tsField] of Object.entries(FILTER_FIELDS)) {
    // Get values for param
    const values = (params as Record<string, string[] | undefined>)[param];

    // If values are available, add to parts
    if (values?.length) {
      // Add to parts
      parts.push(
        values.length === 1 ? `${tsField}:=${values[0]}` : `${tsField}:[${values.join(',')}]`,
      );
    }
  }

  // Add bbox filter
  if (params.bbox) {
    // Parse bbox
    const [west, south, east, north] = params.bbox;

    // Create polygon
    const polygon = [
      `${south}, ${west}`,
      `${north}, ${west}`,
      `${north}, ${east}`,
      `${south}, ${east}`,
      `${south}, ${west}`,
    ].join(', ');

    // Add to parts
    parts.push(`locations.bbox:(${polygon})`);
  }

  // Return parts joined by ' && ' if there are any parts, otherwise undefined
  return parts.length > 0 ? parts.join(' && ') : undefined;
}

/**
 * GET /api/search
 *
 * Search endpoint with simple query parameters, faceting, spatial
 * filtering, and content-negotiated output formats.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  // Help mode — return OpenAPI spec
  if (searchParams.get('help') === 'true') {
    return NextResponse.json(generateOpenApiSpec());
  }

  // Parse and validate params with Zod
  const raw = Object.fromEntries(searchParams);
  const parsed = searchParamsSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Bad Request', details: parsed.error.issues },
      { status: 400 },
    );
  }

  // Parse query params
  const { q, size, page, sort, bbox, resource_type, country, country_id, challenges, facets } =
    parsed.data;

  // Compute facets and filter
  const facetBy = facets ?? DEFAULT_FACETS;
  const filterBy = buildFilterBy({ resource_type, country, country_id, challenges, bbox });

  // Execute search
  try {
    // Get Typesense client
    const client = getTypesenseClient();

    // Execute Typesense search
    const result = await client.collections(COLLECTIONS.RESOURCES).documents().search({
      q,
      query_by: QUERY_BY_FIELDS,
      filter_by: filterBy,
      facet_by: facetBy,
      max_facet_values: 50,
      sort_by: sort,
      page,
      per_page: size,
    });

    // Extract documents from search result
    const hits = result.hits as SearchHit<Resource>[] | undefined;
    const data: Resource[] = (hits ?? []).map((hit) => hit.document);

    // Extract facets from search result
    const facetCounts: FacetsResult = {};
    for (const facetResult of result.facet_counts ?? []) {
      // Add facet count to result
      facetCounts[facetResult.field_name] = facetResult.counts.map(
        (c: { value: string; count: number }) => ({
          value: c.value,
          count: c.count,
        }),
      );
    }

    // Build response via chosen exporter
    const total = result.found;
    const totalPages = size > 0 ? Math.ceil(total / size) : 0;

    // Build metadata
    const meta = { query: q, total, page, size, total_pages: totalPages };

    // Resolve exporter
    const exporter = resolveExporter(request);

    // Export data
    const exported = exporter.export(data, meta, facetCounts);

    // Return response
    return new NextResponse(JSON.stringify(exported.body), {
      status: 200,
      headers: { 'Content-Type': exported.contentType },
    });
  } catch (err) {
    // Return error response
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Internal Server Error', details: message }, { status: 500 });
  }
}
