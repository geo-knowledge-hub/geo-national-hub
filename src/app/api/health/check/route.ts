/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { isAuthenticated } from '@lib/auth/validate-token';
import { checkGkhHealth, storeHealthStatus, loadSyncConfig } from '@lib/sync';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/health/check
 *
 * Triggers a GKH health check and stores the result.
 */
export async function POST(request: NextRequest): Promise<Response> {
  // Check authentication
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Load the sync configuration
    const config = loadSyncConfig();

    // Check the GKH health
    const status = await checkGkhHealth({
      ...config.healthCheck,
      gkhApiBaseUrl: config.gkhApiBaseUrl,
    });

    // Store the health status
    await storeHealthStatus(status, config);

    // Return the health status
    return NextResponse.json(status);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    // Return the error
    return NextResponse.json({ status: 'error', error: message }, { status: 500 });
  }
}
