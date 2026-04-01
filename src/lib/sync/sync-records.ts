/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { SyncConfig } from './config';
import type {
  Resource,
  SyncPayload,
  VocabRef,
  ResourceCreator,
  ResourceRight,
  ResourceLocations,
} from '@content-types/content';
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
 * Resolve a GKH localized title object to a plain string.
 *
 * @param {unknown} titleObj - Raw title value from a GKH API response.
 * @returns {string} The resolved title string.
 */
function resolveTitle(titleObj: unknown): string {
  if (titleObj === null || typeof titleObj !== 'object') {
    return '';
  }

  const obj = titleObj as Record<string, unknown>;

  if (typeof obj['en'] === 'string') {
    return obj['en'];
  }

  // Fall back to the first available language value
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      return obj[key] as string;
    }
  }

  return '';
}

/**
 * Compute the centroid of a GeoJSON Polygon ring as [lat, lng].
 *
 * Uses the arithmetic mean of the exterior ring's vertices (excluding the
 * closing duplicate). Sufficient for display-level accuracy.
 *
 * @param {number[][]} ring - Exterior ring coordinates (each entry is [lng, lat]).
 * @returns {[number, number]} Centroid as [lat, lng].
 */
function polygonCentroid(ring: number[][]): [number, number] {
  // The closing coordinate duplicates the first — exclude it
  const points =
    ring[0] !== undefined &&
    ring[ring.length - 1] !== undefined &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1]
      ? ring.slice(0, -1)
      : ring;

  const count = points.length;

  if (count === 0) {
    return [0, 0];
  }

  let sumLng = 0;
  let sumLat = 0;

  for (const coord of points) {
    sumLng += coord[0] ?? 0;
    sumLat += coord[1] ?? 0;
  }

  return [sumLat / count, sumLng / count];
}

/**
 * Compute a bounding box as a geopolygon (4 corners in [lat, lng] order)
 * from a polygon ring.
 *
 * Typesense `geopolygon` expects an array of [lat, lng] pairs forming a
 * closed polygon. We return 4 corner points of the bounding rectangle.
 *
 * @param {number[][]} ring - Exterior ring coordinates (each entry is [lng, lat]).
 * @returns {[number, number][]} Four corners as [lat, lng] pairs.
 */
function polygonBbox(ring: number[][]): [number, number][] {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const coord of ring) {
    const lng = coord[0] ?? 0;
    const lat = coord[1] ?? 0;

    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }

  // Return 4 corners as [lat, lng] pairs (Typesense geopolygon format)
  return [
    [minLat, minLng],
    [minLat, maxLng],
    [maxLat, maxLng],
    [maxLat, minLng],
  ];
}

/**
 * Extract structured top-level Resource fields from a raw GKH API metadata blob.
 *
 * This function is the single mapping point between the GKH API response shape
 * and the app-level `Resource` type. All fields are optional. Only fields
 * present and parseable in `metadata` are included in the returned object.
 *
 * Mapping rules:
 * - `resource_type`: `{ id, title }` -> `VocabRef { id, name: title.en }`
 * - `subjects`: `[{ subject }]` -> `string[]`
 * - `creators`: GKH creator array -> `ResourceCreator[]`
 * - `rights`: GKH rights array -> `ResourceRight[]`
 * - `target_audiences`: `[{ id, title }]` -> `VocabRef[]`
 * - `engagement_priorities`: `[{ id, title }]` -> `VocabRef[]`
 * - `geo_work_programme_activity`: `{ id, title }` -> `VocabRef`
 * - `locations`: GeoJSON FeatureCollection -> `ResourceLocations`
 * - `publication_date`: passed through as a string
 * - `publisher`: passed through as a string
 * - `description`: passed through as a string
 *
 * @param {Record<string, unknown>} metadata - Raw GKH API metadata object.
 * @returns {Partial<Resource>} Extracted fields ready to merge into a Resource document.
 */
export function extractStructuredFields(metadata: Record<string, unknown>): Partial<Resource> {
  const result: Partial<Resource> = {};

  // resource_type
  const rawResourceType = metadata.resource_type as { id?: string; title?: unknown } | undefined;

  if (rawResourceType?.id) {
    result.resource_type = {
      id: rawResourceType.id,
      name: resolveTitle(rawResourceType.title),
    } satisfies VocabRef;
  }

  // subjects
  const rawSubjects = metadata.subjects;

  if (Array.isArray(rawSubjects)) {
    const subjects = rawSubjects
      .map((entry: unknown) => {
        const e = entry as { subject?: unknown };
        return typeof e?.subject === 'string' ? e.subject : null;
      })
      .filter((s): s is string => s !== null);

    if (subjects.length > 0) {
      result.subjects = subjects;
    }
  }

  // creators
  const rawCreators = metadata.creators;

  if (Array.isArray(rawCreators)) {
    const creators: ResourceCreator[] = [];

    for (const entry of rawCreators) {
      const e = entry as {
        person_or_org?: {
          type?: unknown;
          name?: unknown;
          given_name?: unknown;
          family_name?: unknown;
        };
        affiliations?: Array<{ id?: unknown; name?: unknown }>;
        role?: { id?: unknown; title?: unknown };
      };

      const poc = e?.person_or_org;

      if (!poc || typeof poc.name !== 'string') {
        continue;
      }

      const type: ResourceCreator['person_or_org']['type'] =
        poc.type === 'organizational' ? 'organizational' : 'personal';

      const creator: ResourceCreator = {
        person_or_org: {
          type,
          name: poc.name,
          ...(typeof poc.given_name === 'string' && { given_name: poc.given_name }),
          ...(typeof poc.family_name === 'string' && { family_name: poc.family_name }),
        },
      };

      if (Array.isArray(e.affiliations) && e.affiliations.length > 0) {
        const affiliations: VocabRef[] = e.affiliations
          .filter((a) => typeof a?.id === 'string')
          .map((a) => ({
            id: a.id as string,
            name: typeof a.name === 'string' ? a.name : '',
          }));

        if (affiliations.length > 0) {
          creator.affiliations = affiliations;
        }
      }

      if (e.role && typeof (e.role as { id?: unknown }).id === 'string') {
        creator.role = {
          id: (e.role as { id: string }).id,
          name: resolveTitle((e.role as { title?: unknown }).title),
        };
      }

      creators.push(creator);
    }

    if (creators.length > 0) {
      result.creators = creators;
    }
  }

  // rights
  const rawRights = metadata.rights;

  if (Array.isArray(rawRights)) {
    const rights: ResourceRight[] = [];

    for (const entry of rawRights) {
      const e = entry as { id?: unknown; title?: unknown; link?: unknown };

      if (typeof e?.id !== 'string') {
        continue;
      }

      const right: ResourceRight = {
        id: e.id,
        title:
          e.title !== null && typeof e.title === 'object'
            ? (e.title as { [lang: string]: string })
            : {},
        ...(typeof e.link === 'string' && { link: e.link }),
      };

      rights.push(right);
    }

    if (rights.length > 0) {
      result.rights = rights;
    }
  }

  // target_audiences
  const rawAudiences = metadata.target_audiences;

  if (Array.isArray(rawAudiences)) {
    const audiences: VocabRef[] = rawAudiences
      .filter(
        (e): e is { id: string; title?: unknown } =>
          typeof (e as { id?: unknown })?.id === 'string',
      )
      .map((e) => ({ id: e.id, name: resolveTitle(e.title) }));

    if (audiences.length > 0) {
      result.target_audiences = audiences;
    }
  }

  // engagement_priorities
  const rawPriorities = metadata.engagement_priorities;

  if (Array.isArray(rawPriorities)) {
    const priorities: VocabRef[] = rawPriorities
      .filter(
        (e): e is { id: string; title?: unknown } =>
          typeof (e as { id?: unknown })?.id === 'string',
      )
      .map((e) => ({ id: e.id, name: resolveTitle(e.title) }));

    if (priorities.length > 0) {
      result.engagement_priorities = priorities;
    }
  }

  // geo_work_programme_activity
  const rawGwpa = metadata.geo_work_programme_activity as
    | { id?: unknown; title?: unknown }
    | undefined;

  if (typeof rawGwpa?.id === 'string') {
    result.geo_work_programme_activity = {
      id: rawGwpa.id,
      name: resolveTitle(rawGwpa.title),
    } satisfies VocabRef;
  }

  // locations
  const rawLocations = metadata.locations as
    | {
        features?: Array<{
          geometry?: {
            type?: string;
            coordinates?: unknown;
          };
          place?: string;
          description?: string;
        }>;
      }
    | undefined;

  if (rawLocations?.features && Array.isArray(rawLocations.features)) {
    const locations: ResourceLocations = {
      features: rawLocations.features.map((f) => ({
        ...(f.geometry && { geometry: f.geometry as Record<string, unknown> }),
        ...(typeof f.place === 'string' && { place: f.place }),
        ...(typeof f.description === 'string' && { description: f.description }),
      })),
    };

    // Derive centroid and bbox from the first usable geometry
    for (const feature of rawLocations.features) {
      const geom = feature.geometry;

      if (!geom?.type) {
        continue;
      }

      if (geom.type === 'Point') {
        // coordinates: [lng, lat]
        const coords = geom.coordinates as number[] | undefined;

        if (Array.isArray(coords) && coords.length >= 2) {
          locations.centroid = [coords[1]!, coords[0]!];
        }

        break;
      }

      if (geom.type === 'Polygon') {
        // coordinates: [[ [lng, lat], ... ]]
        const rings = geom.coordinates as number[][][] | undefined;
        const ring = rings?.[0];

        if (Array.isArray(ring) && ring.length > 0) {
          locations.centroid = polygonCentroid(ring);
          locations.bbox = polygonBbox(ring);
        }

        break;
      }
    }

    result.locations = locations;

    // Flag spatial availability for map-mode filtering
    if (locations.centroid || locations.bbox) {
      result.has_location = true;
    }
  }

  // publication_date
  if (typeof metadata.publication_date === 'string') {
    result.publication_date = metadata.publication_date;
  }

  // publisher
  if (typeof metadata.publisher === 'string') {
    result.publisher = metadata.publisher;
  }

  // description
  if (typeof metadata.description === 'string') {
    result.description = metadata.description;
  }

  return result;
}

/**
 * Sync a Knowledge Package resource with the GKH API.
 *
 * Returns a combined payload of extracted top-level Resource fields and
 * operational sync state, or null if the package is unchanged since last sync.
 *
 * @param {Resource} resource - Typesense resource document.
 * @param {GkhClient} client - GKH API client.
 * @returns {Promise<SyncPayload | null>} Combined sync payload, or null if unchanged.
 */
async function syncKnowledgePackage(
  resource: Resource,
  client: GkhClient,
): Promise<SyncPayload | null> {
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

    // Extract structured fields from the package metadata
    const extractedFields = extractStructuredFields(pkg.metadata);

    // Determine the sync status
    const syncStatus = errors.length > 0 ? 'partial' : 'ok';

    // Build the combined payload
    const payload: SyncPayload = {
      ...extractedFields,
      sync: {
        metadata_hash: newHash,
        synced_at: new Date().toISOString(),
        sync_status: syncStatus,
        ...(errors.length > 0 && {
          sync_error: `Failed to fetch child resources: ${errors.join(', ')}`,
        }),
      },
    };

    // Log the sync
    logger.info(`Package ${id} synced`, {
      resourceId: resource.id,
      status: syncStatus,
      childCount: childMetadata.length,
    });

    // Return the payload
    return payload;
  } catch (err) {
    // Get the message
    const message = err instanceof Error ? err.message : String(err);
    const isNotFound = err instanceof GkhNotFoundError;

    logger.error(`Failed to sync package ${id}`, { resourceId: resource.id, error: message });

    // On error, return only the operational sync fields. Do not overwrite
    // top-level Resource fields that were previously extracted.
    return {
      sync: {
        metadata_hash: resource.sync?.metadata_hash ?? '',
        synced_at: new Date().toISOString(),
        sync_status: 'error',
        sync_error: isNotFound ? 'not_found' : message,
      },
    };
  }
}

/**
 * Syncs a Knowledge Resource (non-package) with the GKH API.
 *
 * Returns a combined payload of extracted top-level Resource fields and
 * operational sync state, or null if the record is unchanged since last sync.
 *
 * @param {Resource} resource - Typesense resource document.
 * @param {GkhClient} client - GKH API client.
 *
 * @returns {Promise<SyncPayload | null>} Combined sync payload, or null if unchanged.
 */
async function syncKnowledgeResource(
  resource: Resource,
  client: GkhClient,
): Promise<SyncPayload | null> {
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

    // Extract structured fields from the record metadata
    const extractedFields = extractStructuredFields(record.metadata);

    // Build the combined payload
    const payload: SyncPayload = {
      ...extractedFields,
      sync: {
        metadata_hash: newHash,
        synced_at: new Date().toISOString(),
        sync_status: 'ok',
      },
    };

    // Log the sync
    logger.info(`Record ${id} synced`, { resourceId: resource.id });

    // Return the payload
    return payload;
  } catch (err) {
    // Get the message
    const message = err instanceof Error ? err.message : String(err);
    const isNotFound = err instanceof GkhNotFoundError;

    logger.error(`Failed to sync record ${id}`, { resourceId: resource.id, error: message });

    // On error, return only the operational sync fields. Do not overwrite
    // top-level Resource fields that were previously extracted.
    return {
      sync: {
        metadata_hash: resource.sync?.metadata_hash ?? '',
        synced_at: new Date().toISOString(),
        sync_status: 'error',
        sync_error: isNotFound ? 'not_found' : message,
      },
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
    // Check if the resource is a knowledge package by its resource_type id
    const isPackage = resource.resource_type?.id === 'knowledge-package';

    // Sync the resource. Returns either a full payload or null (unchanged)
    const payload: SyncPayload | null = isPackage
      ? await syncKnowledgePackage(resource, client)
      : await syncKnowledgeResource(resource, client);

    // If the payload is null, the resource is unchanged
    if (payload === null) {
      result.unchanged++;
      return;
    }

    // Track result counters
    if (payload.sync.sync_status === 'error') {
      result.errors++;
    } else {
      result.synced++;
    }

    if (!config.sync.dryRun) {
      try {
        // Write the combined payload (extracted fields + sync state) to Typesense
        await writeSyncMetadata(resource.id, payload, config);
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
