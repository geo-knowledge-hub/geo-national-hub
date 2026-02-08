/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

/**
 * Cookie name for admin authentication token
 */
export const ADMIN_TOKEN_COOKIE = 'admin_token';

/**
 * Validates admin token from Authorization header (Bearer token)
 *
 * @param request - NextRequest object
 * @returns true if token is valid, false otherwise
 */
export function validateAdminToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.slice(7);
  return token === process.env.ADMIN_API_TOKEN;
}

/**
 * Validates admin token from cookie
 *
 * @param request - NextRequest object
 * @returns true if cookie token is valid, false otherwise
 */
export function validateAdminCookie(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  return token === process.env.ADMIN_API_TOKEN;
}

/**
 * Checks if the current request is authenticated as admin
 * Validates token from either Authorization header or cookie
 *
 * @param request - NextRequest object
 * @returns true if authenticated, false otherwise
 */
export function isAuthenticated(request: NextRequest): boolean {
  return validateAdminToken(request) || validateAdminCookie(request);
}

/**
 * Server-side check if admin is authenticated (for Server Components)
 * Checks the admin_token cookie
 *
 * @returns Promise<boolean> - true if authenticated
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!token) return false;

  return token === process.env.ADMIN_API_TOKEN;
}

/**
 * Gets the admin token from cookie (for Server Components)
 *
 * @returns Promise<string | undefined> - the token or undefined
 */
export async function getAdminTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;
}
