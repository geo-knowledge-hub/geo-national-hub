/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { SyncConfig } from './config';
import type { HealthStatus } from '@content-types/content';
import { logger } from './logger';
import { createTypesenseClient } from './clients';

/**
 * Constant - Health document ID.
 */
const HEALTH_DOC_ID = 'gkh-status';

/**
 * Checks whether the global GKH API is reachable.
 *
 * @param {SyncConfig['healthCheck'] & { gkhApiBaseUrl: string }} config - Health check configuration.
 * @returns {Promise<HealthStatus>} The result including online status, latency, and timestamp.
 */
export async function checkGkhHealth(
  config: SyncConfig['healthCheck'] & { gkhApiBaseUrl: string },
): Promise<HealthStatus> {
  // Start the timer
  const startedAt = Date.now();

  try {
    // Create an abort controller
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs);

    // Fetch the health endpoint
    const response = await fetch(`${config.gkhApiBaseUrl}${config.endpoint}`, {
      signal: controller.signal,
    });

    // Clear the timeout
    clearTimeout(timer);

    // Create the health status
    const status: HealthStatus = {
      online: response.ok,
      latency_ms: Date.now() - startedAt,
      checked_at: new Date().toISOString(),
    };

    // Log the health status
    logger.info(`Health check: ${status.online ? 'online' : 'offline'}`, {
      latency_ms: status.latency_ms,
    });

    // Return the health status
    return status;
  } catch {
    // Create the health status
    const status: HealthStatus = {
      online: false,
      latency_ms: Date.now() - startedAt,
      checked_at: new Date().toISOString(),
    };

    // Log the health status
    logger.warn('Health check failed (unreachable)', { latency_ms: status.latency_ms });
    return status;
  }
}

/**
 * Stores the health status in Typesense.
 *
 * @param {HealthStatus} status - Health status to store.
 * @param {SyncConfig} config - Sync configuration.
 * @returns {Promise<void>}
 */
export async function storeHealthStatus(status: HealthStatus, config: SyncConfig): Promise<void> {
  // Create the client
  const client = createTypesenseClient(config);

  // Upsert the health status
  await client
    .collections('health')
    .documents()
    .upsert({
      id: HEALTH_DOC_ID,
      ...status,
    });

  // Log
  logger.info('Health status stored in Typesense');
}

/**
 * Reads the stored health status from Typesense.
 *
 * @param {SyncConfig} config - Sync configuration.
 * @returns {Promise<HealthStatus | null>} Stored health status, or null if not found.
 */
export async function getHealthStatus(config: SyncConfig): Promise<HealthStatus | null> {
  // Create the client
  const client = createTypesenseClient(config);

  // Get the health status
  try {
    const doc = (await client.collections('health').documents(HEALTH_DOC_ID).retrieve()) as {
      online: boolean;
      latency_ms: number;
      checked_at: string;
    };

    return {
      online: doc.online,
      latency_ms: doc.latency_ms,
      checked_at: doc.checked_at,
    };
  } catch (err) {
    if ((err as { httpStatus?: number }).httpStatus === 404) {
      return null;
    }
    throw err;
  }
}
