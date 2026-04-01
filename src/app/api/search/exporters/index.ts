/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { NextRequest } from 'next/server';
import type { Exporter } from './types';

import { defaultExporter } from './default';
import { gkhExporter } from './gkh';

export type { Exporter, ExporterResult, SearchMeta, FacetsResult } from './types';

/**
 * GEO Knowledge Hub media type.
 */
const GKH_MEDIA_TYPE = 'application/vnd.gkh+json';

/**
 * Resolves the appropriate exporter for a request.
 *
 * Resolution order:
 * 1. `Accept` header - `application/vnd.gkh+json` selects GKH exporter
 * 2. `format` query param - `gkh` selects GKH exporter
 * 3. Default JSON exporter
 *
 * This is a simplified version of the resolver. We could use more sophisticated
 * logic when we have more exporters.
 */
export function resolveExporter(request: NextRequest): Exporter {
  // Get accept header
  const accept = request.headers.get('accept') ?? '';

  // If accept header includes GKH media type, return GKH exporter
  if (accept.includes(GKH_MEDIA_TYPE)) {
    return gkhExporter;
  }

  // Get format query param
  const format = request.nextUrl.searchParams.get('format');

  // If format is gkh, return GKH exporter
  if (format === 'gkh') {
    return gkhExporter;
  }

  // Otherwise, return default JSON exporter
  return defaultExporter;
}
