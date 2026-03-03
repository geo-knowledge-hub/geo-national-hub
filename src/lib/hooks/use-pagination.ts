/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';

import {
  computeTotalPages,
  paginateItems,
  computePageNumbers,
  PER_PAGE_OPTIONS,
} from '@lib/search/utils';
import type { PerPageOption } from '@lib/search/utils';

/**
 * Return type for the {@link usePagination} hook.
 */
export interface UsePaginationResult<T> {
  /** The 1-based current page number. */
  currentPage: number;
  /** The active per-page size. */
  perPage: PerPageOption;
  /** Total number of pages. */
  totalPages: number;
  /** The slice of items for the current page. */
  paginatedItems: T[];
  /** Page numbers (with `'ellipsis'` markers) for rendering a pagination bar. */
  pageNumbers: (number | 'ellipsis')[];
  /** Navigate to a specific page (clamped to valid range). */
  handlePageChange: (page: number) => void;
  /** Change the per-page size and reset to page 1. */
  applyPerPage: (pp: PerPageOption) => void;
  /** Reset the current page to 1. Call this when filter state changes. */
  resetPage: () => void;
}

/**
 * Encapsulates pagination state and derived values for a filtered item list.
 *
 * @param filteredItems - The full list of items after filtering.
 * @param initialPerPage - The initial per-page size (default: first entry of {@link PER_PAGE_OPTIONS}).
 * @returns An object with pagination state, derived values, and action handlers.
 */
export function usePagination<T>(
  filteredItems: T[],
  initialPerPage: PerPageOption = PER_PAGE_OPTIONS[0],
): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<PerPageOption>(initialPerPage);

  const totalPages = computeTotalPages(filteredItems.length, perPage);

  // Clamp current page when filtered list shrinks
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(
    () => paginateItems(filteredItems, safePage, perPage),
    [filteredItems, safePage, perPage],
  );

  const pageNumbers = useMemo(
    () => computePageNumbers(totalPages, safePage),
    [totalPages, safePage],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    },
    [totalPages],
  );

  const applyPerPage = useCallback((pp: PerPageOption) => {
    setPerPage(pp);
    setCurrentPage(1);
  }, []);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage: safePage,
    perPage,
    totalPages,
    paginatedItems,
    pageNumbers,
    handlePageChange,
    applyPerPage,
    resetPage,
  };
}
