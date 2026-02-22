/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { isAuthenticated } from '@lib/auth/validate-token';
import { syncronizeRecordsWithGKH, loadSyncConfig } from '@lib/sync';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/sync
 *
 * Syncronize records with the GKH.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Check authentication
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Load sync configuration
    const config = loadSyncConfig();

    // Run the sync
    const result = await syncronizeRecordsWithGKH(config);

    // Return the result
    return NextResponse.json({ status: 'ok', result });
  } catch (err) {
    // Return the error
    const message = err instanceof Error ? err.message : String(err);

    return NextResponse.json({ status: 'error', error: message }, { status: 500 });
  }
}
