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
 * Typesense client configuration from environment variables
 */
const typesenseConfig = {
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

/**
 * Singleton Typesense client instance
 */
let typesenseClient: Client | null = null;

/**
 * Gets the Typesense client instance (singleton pattern)
 */
export function getTypesenseClient(): Client {
  if (!typesenseClient) {
    typesenseClient = new Typesense.Client(typesenseConfig);
  }
  return typesenseClient;
}

/**
 * Creates a new Typesense client instance (for testing or custom config)
 */
export function createTypesenseClient(config?: Partial<typeof typesenseConfig>): Client {
  return new Typesense.Client({
    ...typesenseConfig,
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
