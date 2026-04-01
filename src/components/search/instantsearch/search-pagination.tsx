/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX } from 'react';

import { usePagination } from 'react-instantsearch';

import { Button } from '@ui/button';
import { PerPageSelector } from '../pagination';

import { computePageNumbers } from '@lib/search/utils';
import type { PerPageOption } from '@lib/search/utils';

/**
 * Props for SearchPagination
 */
export interface SearchPaginationProps {
  perPage: PerPageOption;
  onPerPageChange: (pp: PerPageOption) => void;
}

/**
 * Pagination controls (prev / page numbers / next) plus per-page selector
 *
 * @component
 */
export function SearchPagination({ perPage, onPerPageChange }: SearchPaginationProps): JSX.Element {
  const { currentRefinement, nbPages, refine } = usePagination();

  // Current page is 1-based
  const currentPage = currentRefinement + 1;
  const totalPages = Math.max(1, nbPages);
  const pageNumbers = computePageNumbers(totalPages, currentPage);

  // Callback - handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      refine(page - 1);
    }
  };

  // Render the search pagination
  return (
    <>
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="h-9 w-9 rounded-xl"
            aria-label="Previous page"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </Button>

          <div className="flex items-center gap-0.5">
            {pageNumbers.map((p, i) =>
              p === 'ellipsis' ? (
                <span key={`e-${i}`} className="px-2 text-sm text-gray-400">
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(p)}
                  className={`h-9 w-9 rounded-xl text-sm font-medium ${
                    currentPage === p ? 'text-white shadow-sm' : 'text-gray-600'
                  }`}
                  style={
                    currentPage === p
                      ? { backgroundColor: 'var(--theme-primary, #526479)' }
                      : undefined
                  }
                  aria-current={currentPage === p ? 'page' : undefined}
                >
                  {p}
                </Button>
              ),
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="h-9 w-9 rounded-xl"
            aria-label="Next page"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <p className="mt-3 text-center text-xs text-gray-400">
          Page {currentPage} of {totalPages}
        </p>
      )}

      {/* Per-page selector */}
      <div className="mt-4 flex justify-end">
        <PerPageSelector value={perPage as PerPageOption} onChange={onPerPageChange} />
      </div>
    </>
  );
}
