/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Utility Functions
 *
 * Common utility functions used across the application.
 */

/**
 * Prepends the basePath to local asset paths for proper resolution.
 *
 * Next.js does not automatically prepend basePath to string src values
 * in the Image component, so we need to handle this manually for
 * images loaded from JSON/Typesense data.
 *
 * @param path - The asset path (e.g., "/content/flags/flag-australia.png")
 * @returns The path with basePath prepended for local assets, or unchanged for external URLs
 */
export function getAssetPath(path: string): string {
  // Return empty string for falsy values
  if (!path) return '';

  // Don't modify external URLs
  if (path.startsWith('http') || path.startsWith('//')) {
    return path;
  }

  // Prepend basePath for local assets
  const basePath = process.env.__NEXT_ROUTER_BASEPATH || '/national';
  return `${basePath}${path}`;
}
