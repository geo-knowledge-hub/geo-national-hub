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
import type { SyncConfig } from './config';
import type { Resource, SyncField } from '@content-types/content';
import { logger } from './logger';

/**
 * Properties of the GEO Knowledge Hub client configuration.
 */
export interface GkhClientConfig {
  baseUrl: string;
  retryAttempts: number;
  retryDelayMs: number;
}

/**
 * Properties of the GEO Knowledge Hub package response.
 */
export interface GkhPackageResponse {
  id: string;
  metadata: Record<string, unknown>;
  relationship?: {
    resources?: Array<{ id: string }>;
  };
  [key: string]: unknown;
}

/**
 * Properties of the GEO Knowledge Hub record response.
 */
export interface GkhRecordResponse {
  id: string;
  metadata: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Properties of a GKH vocabulary resource type entry.
 */
export interface GkhResourceTypeResponse {
  id: string;
  title: Record<string, string>;
  icon: string;
  props: {
    type: string;
    subtype: string;
    basetype: string;
    [key: string]: string;
  };
  [key: string]: unknown;
}

/**
 * GEO Knowledge Hub not found error.
 */
export class GkhNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GkhNotFoundError';
  }
}

/**
 * GEO Knowledge Hub API error.
 */
export class GkhApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'GkhApiError';
    this.status = status;
  }
}

/**
 * GEO Knowledge Hub client
 */
export class GkhClient {
  private baseUrl: string;
  private retryAttempts: number;
  private retryDelayMs: number;
  private resourceTypeCache = new Map<string, string>();

  /**
   * Constructor
   *
   * @param {GkhClientConfig} config - Configuration for the client.
   */
  constructor(config: GkhClientConfig) {
    this.baseUrl = config.baseUrl;
    this.retryAttempts = config.retryAttempts;
    this.retryDelayMs = config.retryDelayMs;
  }

  /**
   * Fetche a Knowledge Package by ID.
   *
   * @param {string} id - The GKH package ID.
   * @returns {Promise<GkhPackageResponse>} The package data.
   */
  async getPackage(id: string): Promise<GkhPackageResponse> {
    const url = `${this.baseUrl}/packages/${id}`;
    return this.fetchWithRetry<GkhPackageResponse>(url);
  }

  /**
   * Fetch a Knowledge Resource (record) by ID.
   *
   * @param {string} id - The GKH record ID.
   * @returns {Promise<GkhRecordResponse>} The record data.
   */
  async getRecord(id: string): Promise<GkhRecordResponse> {
    const url = `${this.baseUrl}/records/${id}`;
    return this.fetchWithRetry<GkhRecordResponse>(url);
  }

  /**
   * Fetche a resource type metadata by ID.
   *
   * @param {string} typeId - Resource type ID (e.g. "software-awsami").
   *
   * @returns {Promise<GkhResourceTypeResponse>} The vocabulary entry.
   */
  async getResourceType(typeId: string): Promise<GkhResourceTypeResponse> {
    // Define URL
    const url = `${this.baseUrl}/vocabularies/resourcetypes/${typeId}`;

    // Fetch!
    return this.fetchWithRetry<GkhResourceTypeResponse>(url);
  }

  /**
   * Resolve base type.
   *
   * @param {string} typeId - Resource type ID (e.g. "software-awsami").
   *
   * @returns {Promise<string>} The base type string.
   */
  async resolveBaseType(typeId: string): Promise<string> {
    const cached = this.resourceTypeCache.get(typeId);
    if (cached) {
      return cached;
    }

    try {
      // Fetch the resource type
      const vocab = await this.getResourceType(typeId);

      // Get the base type
      const baseType = vocab.props.type ?? typeId;

      // Cache the base type
      this.resourceTypeCache.set(typeId, baseType);

      // Return the base type
      return baseType;
    } catch (err) {
      logger.warn(`Failed to resolve base type for "${typeId}", using ID as fallback`, {
        error: err instanceof Error ? err.message : String(err),
      });

      // Cache the base type
      this.resourceTypeCache.set(typeId, typeId);
      return typeId;
    }
  }

  /**
   * Fetche all child resources for a Knowledge Package.
   *
   * @param {string} packageId - The GKH package ID.
   * @returns {Promise<{ metadata: Record<string, unknown>[]; errors: string[] }>} Child resource metadata and any errors.
   */
  async getPackageResources(
    packageId: string,
  ): Promise<{ metadata: Record<string, unknown>[]; errors: string[] }> {
    // Get the package
    const pkg = await this.getPackage(packageId);

    // Get the child IDs
    const childIds = pkg.relationship?.resources?.map((r) => r.id) ?? [];

    // Initialize metadata and errors
    const metadata: Record<string, unknown>[] = [];
    const errors: string[] = [];

    // Fetch the child resources
    for (const childId of childIds) {
      try {
        // Fetch the record
        const record = await this.getRecord(childId);

        // Add the metadata to the list
        metadata.push(record.metadata);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);

        logger.warn(`Failed to fetch child resource ${childId} of package ${packageId}`, {
          error: message,
        });

        errors.push(childId);
      }
    }

    return { metadata, errors };
  }

  /**
   * Fetches a URL.
   *
   * @param {string} url - The URL to fetch.
   * @returns {Promise<T>} The parsed JSON response.
   */
  private async fetchWithRetry<T>(url: string): Promise<T> {
    let lastError: Error | null = null;

    // Try to fetch URL
    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        // Fetch URL
        const response = await fetch(url);

        // If there are errors, throw it
        if (!response.ok) {
          const status = response.status;

          if (status === 404) {
            throw new GkhNotFoundError(`Resource not found: ${url}`);
          }

          throw new GkhApiError(`GKH API returned ${status} for ${url}`, status);
        }

        // Return!
        return (await response.json()) as T;
      } catch (err) {
        if (err instanceof GkhNotFoundError) {
          throw err;
        }

        lastError = err instanceof Error ? err : new Error(String(err));

        if (attempt < this.retryAttempts) {
          logger.warn(`Retry ${attempt + 1}/${this.retryAttempts} for ${url}`, {
            error: lastError.message,
          });

          // Wait before retrying
          await this.delay(this.retryDelayMs);
        }
      }
    }

    throw lastError ?? new Error(`Failed to fetch ${url}`);
  }

  /**
   * Delay function.
   *
   * @param {number} ms - The number of milliseconds to delay.
   * @returns {Promise<void>} Promise that resolves after the delay.
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Create a Typesense client.
 *
 * @param {SyncConfig} config - The sync configuration.
 * @returns {Client} A configured Typesense client.
 */
export function createTypesenseClient(config: SyncConfig): Client {
  return new Typesense.Client({
    nodes: [
      {
        host: config.typesense.host,
        port: config.typesense.port,
        protocol: config.typesense.protocol,
      },
    ],
    apiKey: config.typesense.apiKey,
    connectionTimeoutSeconds: 10,
  });
}

/**
 * Fetch all resources from Typesense, paginating through results.
 *
 * @param {SyncConfig} config - Sync configuration.
 * @returns {Promise<Resource[]>} All resources in the collection.
 */
export async function fetchSyncableResources(config: SyncConfig): Promise<Resource[]> {
  // Create the client
  const client = createTypesenseClient(config);

  // Get the collection name
  const collectionName = config.typesense.collectionName;
  const resources: Resource[] = [];

  // Initialize the page and total found
  let page = 1;
  const perPage = 250;
  let totalFound = 0;

  // Fetch the resources
  do {
    // Fetch
    const result = await client.collections(collectionName).documents().search({
      q: '*',
      per_page: perPage,
      page,
    });

    // Update the total found
    totalFound = result.found;

    // Add the resources to the list
    for (const hit of result.hits || []) {
      resources.push(hit.document as Resource);
    }

    // Increment the page
    page++;
  } while ((page - 1) * perPage < totalFound);

  logger.info(`Fetched ${resources.length} resources from Typesense`);
  return resources;
}

/**
 * Write sync metadata back to a Typesense document.
 *
 * @param {string} recordId - Typesense document ID.
 * @param {SyncField} syncData - Sync field value to store.
 * @param {SyncConfig} config - Sync configuration.
 * @returns {Promise<void>} Void.
 */
export async function writeSyncMetadata(
  recordId: string,
  syncData: SyncField,
  config: SyncConfig,
): Promise<void> {
  // Create the client
  const client = createTypesenseClient(config);

  // Update the document
  await client
    .collections(config.typesense.collectionName)
    .documents(recordId)
    .update({ sync: syncData });
}
