/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { z } from 'zod';

/**
 * Schema for a single filter rule
 */
const filterRuleSchema = z.object({
  field: z.enum(['source', 'type', 'country_id', 'challenges']),
  operator: z.enum(['eq', 'neq', 'in', 'nin']),
  value: z.union([z.string(), z.array(z.string())]),
});

/**
 * Schema for the sync configuration
 */
const syncConfigSchema = z.object({
  gkhApiBaseUrl: z.string().url(),

  healthCheck: z.object({
    enabled: z.boolean(),
    timeoutMs: z.number().positive(),
    endpoint: z.string(),
  }),

  typesense: z.object({
    host: z.string(),
    port: z.number().int().positive(),
    protocol: z.enum(['http', 'https']),
    apiKey: z.string(),
    collectionName: z.string(),
  }),

  sync: z.object({
    batchSize: z.number().int().positive(),
    concurrency: z.number().int().positive(),
    retryAttempts: z.number().int().min(0),
    retryDelayMs: z.number().int().min(0),
    dryRun: z.boolean(),
  }),

  filters: z.object({
    include: z.array(filterRuleSchema).optional(),
    exclude: z.array(filterRuleSchema).optional(),
  }),
});

/**
 * Types for the sync configuration
 */
export type FilterRule = z.infer<typeof filterRuleSchema>;
export type SyncConfig = z.infer<typeof syncConfigSchema>;

/**
 * Load sync configuration
 *
 * @returns {SyncConfig} Validated sync configuration.
 */
export function loadSyncConfig(): SyncConfig {
  // Default configuration
  const raw: SyncConfig = {
    gkhApiBaseUrl: process.env.GKH_API_URL ?? 'https://gkhub.earthobservations.org/api',

    healthCheck: {
      enabled: true,
      timeoutMs: 5000,
      endpoint: '/records?size=1',
    },

    typesense: {
      host: process.env.TYPESENSE_HOST ?? 'localhost',
      port: Number(process.env.TYPESENSE_PORT ?? '8108'),
      protocol: (process.env.TYPESENSE_PROTOCOL ?? 'http') as 'http' | 'https',
      apiKey: process.env.TYPESENSE_API_KEY ?? 'xyz',
      collectionName: 'resources',
    },

    sync: {
      batchSize: 50,
      concurrency: 3,
      retryAttempts: 2,
      retryDelayMs: 1000,
      dryRun: false,
    },

    filters: {
      include: [{ field: 'source', operator: 'eq', value: 'geo-knowledge-hub' }],
      exclude: [],
    },
  };

  // Parse and return the configuration
  return syncConfigSchema.parse(raw);
}
