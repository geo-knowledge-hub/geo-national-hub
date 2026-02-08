/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { ADMIN_TOKEN_COOKIE } from '@lib/auth/validate-token';

/**
 * GET /admin/logout
 *
 * Clears the admin authentication cookie and redirects to home
 */
export async function GET(request: Request) {
  const cookieStore = await cookies();

  // Delete the admin token cookie
  cookieStore.delete(ADMIN_TOKEN_COOKIE);

  // Redirect to home page - construct URL from the request's origin
  const url = new URL(request.url);
  const redirectUrl = new URL('/national', url.origin);

  return NextResponse.redirect(redirectUrl);
}
