/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { getHealthStatus, loadSyncConfig } from '@lib/sync';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/health
 *
 * Returns the last stored GKH health status.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Load sync configuration
    const config = loadSyncConfig();

    // Get the health status
    const status = await getHealthStatus(config);

    // If the health status is not found, return online
    if (!status) {
      return NextResponse.json({ online: true, latency_ms: 0, checked_at: null });
    }

    // Return the health status
    return NextResponse.json(status);
  } catch {
    // In any case, assume GKH is online
    return NextResponse.json({ online: true, latency_ms: 0, checked_at: null });
  }
}
