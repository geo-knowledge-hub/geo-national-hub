/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { ADMIN_TOKEN_COOKIE } from '@lib/auth/validate-token';

/**
 * POST /api/admin/login
 *
 * Validates admin token and sets httpOnly cookie on success
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    // Validate against environment variable
    if (token !== process.env.ADMIN_API_TOKEN) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    // Set httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
