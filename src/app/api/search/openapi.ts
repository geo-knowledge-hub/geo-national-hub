/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

import { searchParamsSchema, searchResponseSchema, gkhResponseSchema } from './schema';

/**
 * Generates the OpenAPI 3.1 spec for the National GEO Knowledge Hub search API.
 */
export function generateOpenApiSpec() {
  // Create OpenAPI registry
  const registry = new OpenAPIRegistry();

  // Register response schemas
  registry.register('SearchResponse', searchResponseSchema);
  registry.register('GkhResponse', gkhResponseSchema);

  // Register the GET /api/search endpoint
  registry.registerPath({
    method: 'get',
    path: '/national/api/search',
    summary: 'Search resources',
    description:
      'Full-text search endpoint for the National GEO Knowledge Hub with filtering, faceting, spatial queries, and content-negotiated output formats.',
    tags: ['Search'],
    request: {
      query: searchParamsSchema,
    },
    responses: {
      200: {
        description: 'Search results in the requested format (JSON or GKH).',
        content: {
          'application/json': {
            schema: searchResponseSchema,
          },
          'application/vnd.gkh+json': {
            schema: gkhResponseSchema,
          },
        },
      },
      400: {
        description: 'Invalid query parameters.',
        content: {
          'application/json': {
            schema: {
              type: 'object' as const,
              properties: {
                error: { type: 'string' as const },
                details: {},
              },
            },
          },
        },
      },
    },
  });

  // Create OpenAPI generator
  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'National GEO Knowledge Hub API',
      version: '1.0.0',
      description:
        'Public API for searching and retrieving National GEO Knowledge Hub resources from multiple countries.',
    },
    servers: [{ url: '/' }],
  });
}
