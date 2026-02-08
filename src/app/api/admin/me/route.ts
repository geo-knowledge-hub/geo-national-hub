/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { NextRequest, NextResponse } from 'next/server';

import { isAuthenticated } from '@lib/auth/validate-token';

/**
 * GET /api/admin/me
 *
 * Returns authentication status for the current user
 */
export async function GET(request: NextRequest) {
  const authenticated = isAuthenticated(request);

  return NextResponse.json({ authenticated });
}
