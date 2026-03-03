/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { Search } from 'lucide-react';

import type { JSX } from 'react';

/**
 * Props for the {@link EmptyState} component.
 */
interface EmptyStateProps {
  /** Primary heading shown inside the empty-state card. Defaults to `"No results found"`. */
  heading?: string;
  /** Whether any filter is currently active — controls the "clear all" hint. */
  hasActiveFilters: boolean;
  /** Callback invoked when the user clicks "clear all". */
  onClearFilters?: () => void;
}

/**
 * Empty-state card displayed when a filtered list has zero results.
 *
 * @component
 */
export function EmptyState({
  heading = 'No results found',
  hasActiveFilters,
  onClearFilters,
}: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/60 py-20">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <Search className="h-8 w-8 text-gray-300" />
      </div>
      <p className="text-base font-semibold text-gray-700">{heading}</p>
      <p className="mt-1.5 text-sm text-gray-400">
        {hasActiveFilters ? (
          <>
            Try adjusting filters or{' '}
            <button
              onClick={onClearFilters}
              className="font-medium underline underline-offset-2 transition hover:text-gray-700"
              style={{ color: 'var(--theme-primary, #526479)' }}
            >
              clear all
            </button>
          </>
        ) : (
          'No items available for this selection.'
        )}
      </p>
    </div>
  );
}
