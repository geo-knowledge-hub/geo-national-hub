#!/usr/bin/env npx tsx
/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Sync Trigger Script
 *
 * Calls the local API endpoints to trigger a health check and/or metadata sync.
 *
 * Usage:
 *   npx tsx scripts/sync-trigger.ts health    # Run a GKH health check
 *   npx tsx scripts/sync-trigger.ts sync      # Run a metadata sync
 *   npx tsx scripts/sync-trigger.ts all       # Run both (health first, then sync)
 *
 * Environment variables:
 *   BASE_URL - App base URL (default: http://localhost:3000/national)
 *   ADMIN_API_TOKEN - Key for protected endpoints
 */

const NATIONAL_HUB_BASE_URL = process.env.NATIONAL_HUB_BASE_URL ?? 'http://localhost:3000/national';
const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN ?? '';

/**
 * Triggers a GKH health check via POST /api/health/check.
 */
async function checkHealth(): Promise<void> {
  console.log('Running GKH health check...');

  const res = await fetch(`${NATIONAL_HUB_BASE_URL}/api/health/check`, {
    method: 'POST',
    headers: { authorization: `Bearer ${ADMIN_API_TOKEN}` },
  });

  const body = await res.json();
  console.log(`Status: ${res.status}`);
  console.log(JSON.stringify(body, null, 2));
}

/**
 * Triggers a metadata sync via POST /api/sync.
 */
async function syncronizeRecordsWithGKH(): Promise<void> {
  console.log('Running metadata sync...');

  const res = await fetch(`${NATIONAL_HUB_BASE_URL}/api/sync`, {
    method: 'POST',
    headers: { authorization: `Bearer ${ADMIN_API_TOKEN}` },
  });

  const body = await res.json();

  console.log(`Status: ${res.status}`);
  console.log(JSON.stringify(body, null, 2));
}

/**
 * Main function
 */
async function main(): Promise<void> {
  // Check health
  await checkHealth();

  // Syncronize records
  await syncronizeRecordsWithGKH();
}

// Run the script
main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
