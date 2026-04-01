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
 * Default JSON exporter.
 *
 * Produces the standard National GEO Knowledge Hub search response format:
 * `{ meta, data, facets }`.
 */
export const defaultExporter: Exporter = {
  export(data: Resource[], meta: SearchMeta, facets: FacetsResult): ExporterResult {
    return {
      body: { meta, data, facets },
      contentType: 'application/json',
    };
  },
};
