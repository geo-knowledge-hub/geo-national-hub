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
import { getTypesenseClient, COLLECTIONS } from '@lib/typesense/client';
import { themeUpdateSchema } from '@lib/api/schemas';

import type { Country } from '@content-types/content';

interface RouteParams {
  params: Promise<{ countryId: string }>;
}

/**
 * GET /api/admin/countries/[countryId]/theme
 *
 * Retrieves theme configuration for a country
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { countryId } = await params;

  try {
    const client = getTypesenseClient();
    const country = (await client
      .collections(COLLECTIONS.COUNTRIES)
      .documents(countryId)
      .retrieve()) as Country;

    return NextResponse.json({
      success: true,
      data: {
        countryId,
        theme: country.theme || null,
      },
    });
  } catch (error) {
    const httpStatus = (error as { httpStatus?: number }).httpStatus;

    if (httpStatus === 404) {
      return NextResponse.json({ success: false, error: 'Country not found' }, { status: 404 });
    }

    console.error('Error fetching country theme:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch theme' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/countries/[countryId]/theme
 *
 * Updates theme configuration for a country
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { countryId } = await params;

  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = themeUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues.map((e) => e.message).join(', '),
        },
        { status: 400 },
      );
    }

    const { theme } = validation.data;

    // Update Typesense document
    const client = getTypesenseClient();
    await client.collections(COLLECTIONS.COUNTRIES).documents(countryId).update({ theme });

    return NextResponse.json({
      success: true,
      data: {
        countryId,
        theme,
      },
    });
  } catch (error) {
    const httpStatus = (error as { httpStatus?: number }).httpStatus;

    if (httpStatus === 404) {
      return NextResponse.json({ success: false, error: 'Country not found' }, { status: 404 });
    }

    console.error('Error updating country theme:', error);
    return NextResponse.json({ success: false, error: 'Failed to update theme' }, { status: 500 });
  }
}
