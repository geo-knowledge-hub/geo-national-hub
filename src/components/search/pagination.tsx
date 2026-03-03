/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import type { JSX } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@ui/button';
import { PER_PAGE_OPTIONS } from '@lib/search/utils';
import type { PerPageOption } from '@lib/search/utils';

/**
 * Props for the {@link PerPageSelector} component.
 */
interface PerPageSelectorProps {
  /** Currently active per-page value. */
  value: PerPageOption;
  /** Callback when the user picks a new per-page value. */
  onChange: (pp: PerPageOption) => void;
  /** Optional label rendered *before* the button group (e.g. `"Show"`). */
  prefixLabel?: string;
  /** Optional label rendered *after* the button group (e.g. `"per page"`). */
  suffixLabel?: string;
}

/**
 * Props for the {@link PaginationRow} component.
 */
interface PaginationRowProps {
  /** The 1-based current page. */
  currentPage: number;
  /** Total number of pages. */
  totalPages: number;
  /** Page numbers with `'ellipsis'` markers (from `computePageNumbers`). */
  pageNumbers: (number | 'ellipsis')[];
  /** Navigate to a given page. */
  onPageChange: (page: number) => void;
}

/**
 * Props for the {@link PaginationInfo} component.
 */
interface PaginationInfoProps {
  /** The 1-based current page. */
  currentPage: number;
  /** Total number of pages. */
  totalPages: number;
  /** Total number of filtered items. */
  totalItems: number;
}

/**
 * Segmented button group for choosing a per-page size.
 *
 * @component
 */
export function PerPageSelector({
  value,
  onChange,
  prefixLabel,
  suffixLabel,
}: PerPageSelectorProps): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      {prefixLabel && <span className="hidden text-xs text-gray-400 sm:inline">{prefixLabel}</span>}
      <div className="flex rounded-lg border border-gray-200 bg-white">
        {PER_PAGE_OPTIONS.map((n, i) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              i > 0 ? 'border-l border-gray-200' : ''
            } ${value === n ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            style={value === n ? { backgroundColor: 'var(--theme-primary, #526479)' } : undefined}
          >
            {n}
          </button>
        ))}
      </div>
      {suffixLabel && <span className="hidden text-xs text-gray-400 sm:inline">{suffixLabel}</span>}
    </div>
  );
}

/**
 * Prev / page-numbers / Next navigation bar.
 *
 * @component
 */
export function PaginationRow({
  currentPage,
  totalPages,
  pageNumbers,
  onPageChange,
}: PaginationRowProps): JSX.Element | null {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-9 w-9 rounded-xl"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
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
              onClick={() => onPageChange(p)}
              className={`h-9 w-9 rounded-xl text-sm font-medium ${
                currentPage === p ? 'text-white shadow-sm' : 'text-gray-600'
              }`}
              style={
                currentPage === p ? { backgroundColor: 'var(--theme-primary, #526479)' } : undefined
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
        onClick={() => onPageChange(currentPage + 1)}
        className="h-9 w-9 rounded-xl"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * "Page X of Y — N total" label shown below the pagination row.
 *
 * @component
 */
export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
}: PaginationInfoProps): JSX.Element | null {
  if (totalPages <= 1) return null;

  return (
    <p className="mt-3 text-center text-xs text-gray-400">
      Page {currentPage} of {totalPages} &mdash; {totalItems.toLocaleString()} total
    </p>
  );
}
