/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { CountryComponentConfig, CountryTheme } from '@content-types/content';

/**
 * Base path for admin API endpoints
 */
const API_BASE = '/national/api/admin';

/**
 * Response type for API calls
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Checks if the current user is authenticated as admin
 *
 * @returns Promise<boolean> - true if authenticated
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.authenticated === true;
  } catch {
    return false;
  }
}

/**
 * Attempts to login with admin token
 *
 * @param token - Admin token
 * @returns Promise<boolean> - true if login successful
 */
export async function loginAdmin(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
      credentials: 'include',
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

/**
 * Fetches component configurations for a country
 *
 * @param countryId - Country ID
 * @returns Promise with component configs or throws error
 */
export async function getCountryConfig(countryId: string): Promise<CountryComponentConfig[]> {
  const response = await fetch(`${API_BASE}/countries/${countryId}/config`, {
    method: 'GET',
    credentials: 'include',
  });

  const data: ApiResponse<{ component_configs: CountryComponentConfig[] }> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch configuration');
  }

  return data.data?.component_configs || [];
}

/**
 * Saves component configurations for a country
 *
 * @param countryId - Country ID
 * @param configs - Component configurations to save
 * @returns Promise that resolves on success or throws error
 */
export async function saveCountryConfig(
  countryId: string,
  configs: CountryComponentConfig[],
): Promise<void> {
  const response = await fetch(`${API_BASE}/countries/${countryId}/config`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ component_configs: configs }),
    credentials: 'include',
  });

  const data: ApiResponse<unknown> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to save configuration');
  }
}

/**
 * Fetches theme configuration for a country
 *
 * @param countryId - Country ID
 * @returns Promise with theme or null
 */
export async function getCountryTheme(countryId: string): Promise<CountryTheme | null> {
  const response = await fetch(`${API_BASE}/countries/${countryId}/theme`, {
    method: 'GET',
    credentials: 'include',
  });

  const data: ApiResponse<{ theme: CountryTheme | null }> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch theme');
  }

  return data.data?.theme || null;
}

/**
 * Saves theme configuration for a country
 *
 * @param countryId - Country ID
 * @param theme - Theme configuration to save
 * @returns Promise that resolves on success or throws error
 */
export async function saveCountryTheme(countryId: string, theme: CountryTheme): Promise<void> {
  const response = await fetch(`${API_BASE}/countries/${countryId}/theme`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ theme }),
    credentials: 'include',
  });

  const data: ApiResponse<unknown> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to save theme');
  }
}
