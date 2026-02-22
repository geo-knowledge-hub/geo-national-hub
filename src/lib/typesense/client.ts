/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
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
 */
function getTypesenseConfig(): TypesenseConfig {
  const apiKey = process.env.TYPESENSE_API_KEY || 'xyz';
  const host = process.env.TYPESENSE_HOST || 'localhost';
  const port = parseInt(process.env.TYPESENSE_PORT || '8108', 10);
  const protocol = (process.env.TYPESENSE_PROTOCOL || 'http') as 'http' | 'https';

  // Log warning in production if using default values (helps with debugging)
  if (process.env.NODE_ENV === 'production' && (apiKey === 'xyz' || host === 'localhost')) {
    console.warn(
      '[Typesense] Warning: Using default configuration values. ' +
        'Ensure TYPESENSE_API_KEY, TYPESENSE_HOST, TYPESENSE_PORT, and TYPESENSE_PROTOCOL are set in environment variables.',
    );
  }

  return {
    nodes: [
      {
        host,
        port,
        protocol,
      },
    ],
    apiKey,
    connectionTimeoutSeconds: 10,
  };
}

/**
 * Gets the Typesense client instance
 */
export function getTypesenseClient(): Client {
  const config = getTypesenseConfig();
  return new Typesense.Client(config);
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
  HEALTH: 'health',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export default getTypesenseClient;
