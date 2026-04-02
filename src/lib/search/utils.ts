/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Available per-page options for pagination controls.
 */
export const PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

/**
 * Union type representing a valid per-page option value.
 */
export type PerPageOption = (typeof PER_PAGE_OPTIONS)[number];

/**
 * Retrieve a value from a nested object by a dot-separated path.
 *
 * For a flat key (no dot) the function behaves like a plain property access.
 * Returns `undefined` when any segment along the path is absent.
 *
 * @param obj - The source object to traverse.
 * @param path - Dot-separated property path (e.g. `"resource_type.name"`).
 * @returns The resolved value, or `undefined` if the path cannot be followed.
 */
export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (current !== null && typeof current === 'object' && !Array.isArray(current)) {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, obj);
}

/**
 * Filter items by a search term across one or more string fields.
 *
 * Performs a case-insensitive substring match. Returns all items when the
 * search term is empty or whitespace-only.
 *
 * Field paths may use dot notation to reach nested properties
 * (e.g. `"resource_type.name"`). For plain (non-dot) keys the behaviour is
 * identical to a direct property access.
 *
 * @param items - The array of items to filter.
 * @param term - The search term to match against.
 * @param fields - The keys (or dot-paths) of `T` whose string values should be searched.
 * @returns A new array containing only the matching items.
 */
export function filterBySearch<T>(items: T[], term: string, fields: (keyof T | string)[]): T[] {
  if (!term.trim()) {
    return items;
  }

  const q = term.toLowerCase();

  return items.filter((item) =>
    fields.some((field) => {
      const fieldStr = field as string;
      const v = fieldStr.includes('.')
        ? getNestedValue(item as Record<string, unknown>, fieldStr)
        : item[field as keyof T];

      return typeof v === 'string' && v.toLowerCase().includes(q);
    }),
  );
}

/**
 * Compute the total number of pages given an item count and page size.
 *
 * Always returns at least 1 so pagination controls remain visible.
 *
 * @param itemCount - Total number of items.
 * @param perPage - Number of items per page.
 * @returns The total number of pages (>= 1).
 */
export function computeTotalPages(itemCount: number, perPage: number): number {
  return Math.max(1, Math.ceil(itemCount / perPage));
}

/**
 * Return the slice of items for the requested page.
 *
 * @param items - The full array of items.
 * @param currentPage - The 1-based page number.
 * @param perPage - Number of items per page.
 * @returns A new array with only the items for the current page.
 */
export function paginateItems<T>(items: T[], currentPage: number, perPage: number): T[] {
  const start = (currentPage - 1) * perPage;
  return items.slice(start, start + perPage);
}

/**
 * Compute the list of page numbers (with ellipsis markers) to render in
 * a pagination bar.
 *
 * When the total page count is <= 7, every page number is returned.
 * Otherwise, the first and last pages are always included, with an
 * ellipsis marker (`'ellipsis'`) inserted to represent skipped ranges.
 *
 * @param totalPages - Total number of pages.
 * @param currentPage - The currently active page (1-based).
 * @returns An array of page numbers and `'ellipsis'` markers.
 */
export function computePageNumbers(
  totalPages: number,
  currentPage: number,
): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);
  }

  return pages;
}

/**
 * Toggle a value in an array — removes it if present, appends it otherwise.
 *
 * Returns a new array (does not mutate the original).
 *
 * @param prev - The current array.
 * @param value - The value to toggle.
 * @returns A new array with the value toggled.
 */
export function toggleArrayItem<V>(prev: V[], value: V): V[] {
  return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
}
