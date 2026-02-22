/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { SyncConfig } from './config';
import type { Resource, SyncField } from '@content-types/content';
import { GkhClient, GkhNotFoundError } from './clients';
import { fetchSyncableResources, writeSyncMetadata } from './clients';
import { hashMetadata, applyFilters } from './toolbox';
import { logger } from './logger';

/**
 * Result of a sync run
 *
 * @param {number} total - Total number of resources
 * @param {number} filtered - Number of resources after filters
 * @param {number} synced - Number of resources synced
 * @param {number} unchanged - Number of resources unchanged
 * @param {number} errors - Number of errors
 */
export interface SyncRunResult {
  total: number;
  filtered: number;
  synced: number;
  unchanged: number;
  errors: number;
}

/**
 * Extracts the GKH record ID from a package URL, record URL, or DOI URL.
 *
 * @param {string} link - The full URL from the record's `link` field.
 * @returns {string} The extracted GKH ID (e.g. "1f0cq-zc482").
 */
export function extractGkhId(link: string): string {
  // Create the URL
  const url = new URL(link);

  // Get the last segment
  const lastSegment = url.pathname.split('/').filter(Boolean).pop() ?? '';

  // Check if the URL is a DOI
  const isDoi = url.hostname.includes('doi.org');

  if (isDoi) {
    return lastSegment.split('/').pop() ?? lastSegment;
  }

  return lastSegment;
}

/**
 * Extract resource type ID.
 *
 * @param {Record<string, unknown>} metadata - GKH metadata.
 * @returns {string | undefined} Resource type ID, or undefined if not present.
 */
function extractResourceTypeId(metadata: Record<string, unknown>): string | undefined {
  const rt = metadata.resource_type as { id?: string } | undefined;

  return rt?.id;
}

/**
 * Resolve base type.
 *
 * @param {Record<string, unknown>} metadata - GKH metadata to augment.
 * @param {GkhClient} client - GKH API client (provides caching).
 */
async function injectBaseType(metadata: Record<string, unknown>, client: GkhClient): Promise<void> {
  // Extract resource type ID
  const typeId = extractResourceTypeId(metadata);

  // If no type ID, return
  if (!typeId) {
    return;
  }

  // Resolve base type
  const baseType = await client.resolveBaseType(typeId);
  metadata.base_type = baseType;
}

/**
 * Sync a Knowledge Package resource with the GKH API.
 *
 * @param {Resource} resource - Typesense resource document.
 * @param {GkhClient} client - GKH API client.
 * @returns {Promise<SyncField | null>} Sync field, or null if unchanged.
 */
async function syncKnowledgePackage(
  resource: Resource,
  client: GkhClient,
): Promise<SyncField | null> {
  // Extract GKH ID
  const id = extractGkhId(resource.link);

  try {
    // Fetch package
    const pkg = await client.getPackage(id);
    const newHash = hashMetadata(pkg.metadata);

    // If package was not changed, skip
    if (resource.sync?.metadata_hash === newHash) {
      logger.info(`Package ${id} unchanged, skipping`, { resourceId: resource.id });

      // Skip
      return null;
    }

    // Fetch resources from the package
    const { metadata: childMetadata, errors } = await client.getPackageResources(id);

    // Resolve base types for the package and each child resource
    await injectBaseType(pkg.metadata, client);
    for (const child of childMetadata) {
      await injectBaseType(child, client);
    }

    // Determine the sync status
    const syncStatus = errors.length > 0 ? 'partial' : 'ok';

    // Create the sync field
    const syncField: SyncField = {
      metadata: {
        package: pkg.metadata,
        resources: childMetadata,
      },
      metadata_hash: newHash,
      synced_at: new Date().toISOString(),
      sync_status: syncStatus,
      ...(errors.length > 0 && {
        sync_error: `Failed to fetch child resources: ${errors.join(', ')}`,
      }),
    };

    // Log the sync
    logger.info(`Package ${id} synced`, {
      resourceId: resource.id,
      status: syncStatus,
      childCount: childMetadata.length,
    });

    // Return the sync field
    return syncField;
  } catch (err) {
    // Get the message
    const message = err instanceof Error ? err.message : String(err);
    const isNotFound = err instanceof GkhNotFoundError;

    logger.error(`Failed to sync package ${id}`, { resourceId: resource.id, error: message });

    // Return the sync field
    return {
      metadata: resource.sync?.metadata ?? {},
      metadata_hash: resource.sync?.metadata_hash ?? '',
      synced_at: new Date().toISOString(),
      sync_status: 'error',
      sync_error: isNotFound ? 'not_found' : message,
    };
  }
}

/**
 * Syncs a Knowledge Resource (non-package) with the GKH API.
 *
 * @param {Resource} resource - Typesense resource document.
 * @param {GkhClient} client - GKH API client.
 *
 * @returns {Promise<SyncField | null>} Sync field, or null if unchanged.
 */
async function syncKnowledgeResource(
  resource: Resource,
  client: GkhClient,
): Promise<SyncField | null> {
  // Extract GKH ID
  const id = extractGkhId(resource.link);

  // Fetch record
  try {
    // Fetch record
    const record = await client.getRecord(id);
    const newHash = hashMetadata(record.metadata);

    // If record was not changed, skip
    if (resource.sync?.metadata_hash === newHash) {
      logger.info(`Record ${id} unchanged, skipping`, { resourceId: resource.id });

      // Skip
      return null;
    }

    // Resolve base type from the vocabulary API
    await injectBaseType(record.metadata, client);

    // Create the sync field
    const syncField: SyncField = {
      metadata: {
        record: record.metadata,
      },
      metadata_hash: newHash,
      synced_at: new Date().toISOString(),
      sync_status: 'ok',
    };

    // Log the sync
    logger.info(`Record ${id} synced`, { resourceId: resource.id });

    // Return the sync field
    return syncField;
  } catch (err) {
    // Get the message
    const message = err instanceof Error ? err.message : String(err);
    const isNotFound = err instanceof GkhNotFoundError;

    logger.error(`Failed to sync record ${id}`, { resourceId: resource.id, error: message });

    return {
      metadata: resource.sync?.metadata ?? {},
      metadata_hash: resource.sync?.metadata_hash ?? '',
      synced_at: new Date().toISOString(),
      sync_status: 'error',
      sync_error: isNotFound ? 'not_found' : message,
    };
  }
}

/**
 * Process a single resource.
 *
 * @param {Resource} resource - The resource to process.
 * @param {GkhClient} client - The GKH API client.
 * @param {SyncConfig} config - The sync configuration.
 * @param {SyncRunResult} result - Running result counters (mutated in place).
 */
async function processResource(
  resource: Resource,
  client: GkhClient,
  config: SyncConfig,
  result: SyncRunResult,
): Promise<void> {
  try {
    // Check if the resource is a package
    const isPackage = resource.type === 'Knowledge Package';

    // Sync the resource
    const syncField: SyncField | null = isPackage
      ? await syncKnowledgePackage(resource, client)
      : await syncKnowledgeResource(resource, client);

    // If the sync field is null, the resource is unchanged
    if (syncField === null) {
      result.unchanged++;
      return;
    }

    // If the sync field is an error, increment the errors
    if (syncField.sync_status === 'error') {
      result.errors++;
    } else {
      result.synced++;
    }

    if (!config.sync.dryRun) {
      try {
        // Write the sync metadata
        await writeSyncMetadata(resource.id, syncField, config);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);

        logger.error(`Failed to write sync data for ${resource.id}`, { error: message });

        result.errors++;
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    logger.error(`Unexpected error processing ${resource.id}`, { error: message });

    result.errors++;
  }
}

/**
 * Processes a batch of resources.
 *
 * @param {Resource[]} batch - The resources to process.
 * @param {GkhClient} client - The GKH API client.
 * @param {SyncConfig} config - The sync configuration.
 * @param {SyncRunResult} result - Running result counters (mutated in place).
 */
async function processBatch(
  batch: Resource[],
  client: GkhClient,
  config: SyncConfig,
  result: SyncRunResult,
): Promise<void> {
  // Get the concurrency
  const concurrency = config.sync.concurrency;

  // Process in chunks
  for (let i = 0; i < batch.length; i += concurrency) {
    // Get the chunk
    const chunk = batch.slice(i, i + concurrency);

    // Process the chunk
    const promises = chunk.map((resource) => {
      return processResource(resource, client, config, result);
    });

    // Wait for all promises to resolve
    await Promise.all(promises);
  }
}

/**
 * Syncronize records with the GKH.
 *
 * @param {SyncConfig} config - The sync configuration.
 * @returns {Promise<SyncRunResult>} Summary of the sync run.
 *
 * @example
 * ```ts
 * const config = loadSyncConfig();
 * const result = await syncronizeRecordsWithGKH(config);
 * console.log(result);
 * ```
 */
export async function syncronizeRecordsWithGKH(config: SyncConfig): Promise<SyncRunResult> {
  // Log the start of the sync run
  logger.info('Starting sync run', {
    dryRun: config.sync.dryRun,
    batchSize: config.sync.batchSize,
    concurrency: config.sync.concurrency,
  });

  // Initialize the result
  const result: SyncRunResult = {
    total: 0,
    filtered: 0,
    synced: 0,
    unchanged: 0,
    errors: 0,
  };

  // Step 1: Fetch all resources from Typesense
  const allResources = await fetchSyncableResources(config);
  result.total = allResources.length;

  // Step 2: Apply filters
  const resources = applyFilters(allResources, config.filters.include, config.filters.exclude);
  result.filtered = resources.length;

  logger.info(`Filtered to ${resources.length} syncable resources out of ${allResources.length}`);

  // Step 3: Process in batches with concurrency
  const client = new GkhClient({
    baseUrl: config.gkhApiBaseUrl,
    retryAttempts: config.sync.retryAttempts,
    retryDelayMs: config.sync.retryDelayMs,
  });

  // Process in batches
  for (let i = 0; i < resources.length; i += config.sync.batchSize) {
    const batch = resources.slice(i, i + config.sync.batchSize);

    await processBatch(batch, client, config, result);
  }

  // Log
  logger.info('Sync run complete', {
    synced: result.synced,
    unchanged: result.unchanged,
    errors: result.errors,
  });

  // Return!
  return result;
}
