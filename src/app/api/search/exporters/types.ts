/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { Resource } from '@content-types/content';

/**
 * Search metadata included in every response.
 */
export interface SearchMeta {
  query: string;
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

/**
 * Facet counts keyed by field name.
 */
export interface FacetsResult {
  [field: string]: Array<{ value: string; count: number }>;
}

/**
 * Result produced by an exporter.
 */
export interface ExporterResult {
  body: unknown;
  contentType: string;
}

/**
 * Exporter interface
 */
export interface Exporter {
  export(data: Resource[], meta: SearchMeta, facets: FacetsResult): ExporterResult;
}
