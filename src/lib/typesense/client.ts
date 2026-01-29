/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Typesense Client Configuration
 *
 * Provides a configured Typesense client for server-side usage.
 * Environment variables are used for configuration to support different environments.
 */

import Typesense from 'typesense';
import type { Client } from 'typesense';

/**
 * Typesense client configuration type
 */
interface TypesenseConfig {
  nodes: Array<{
    host: string;
    port: number;
    protocol: 'http' | 'https';
  }>;
  apiKey: string;
  connectionTimeoutSeconds: number;
}

/**
 * Gets Typesense configuration from environment variables
 * Called at runtime to ensure env vars are available (important for Next.js standalone builds)
 */
function getTypesenseConfig(): TypesenseConfig {
  return {
    nodes: [
      {
        host: process.env.TYPESENSE_HOST || 'localhost',
        port: parseInt(process.env.TYPESENSE_PORT || '8108', 10),
        protocol: (process.env.TYPESENSE_PROTOCOL || 'http') as 'http' | 'https',
      },
    ],
    apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
    connectionTimeoutSeconds: 10,
  };
}

/**
 * Singleton Typesense client instance
 */
let typesenseClient: Client | null = null;

/**
 * Gets the Typesense client instance (singleton pattern)
 * Reads environment variables at runtime to ensure they're available in all deployment scenarios
 */
export function getTypesenseClient(): Client {
  if (!typesenseClient) {
    const config = getTypesenseConfig();
    typesenseClient = new Typesense.Client(config);
  }
  return typesenseClient;
}

/**
 * Creates a new Typesense client instance (for testing or custom config)
 */
export function createTypesenseClient(config?: Partial<TypesenseConfig>): Client {
  const baseConfig = getTypesenseConfig();
  return new Typesense.Client({
    ...baseConfig,
    ...config,
  });
}

/**
 * Collection names as constants for type safety
 */
export const COLLECTIONS = {
  COUNTRIES: 'countries',
  RESOURCES: 'resources',
  FOCUS_AREAS: 'focus_areas',
  FOCUS_AREA_CHALLENGES: 'focus_area_challenges',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export default getTypesenseClient;
