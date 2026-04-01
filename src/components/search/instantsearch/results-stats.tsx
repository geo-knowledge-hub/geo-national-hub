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

import { useSearchBox, useStats, useClearRefinements, useInstantSearch } from 'react-instantsearch';

/**
 * Props for ResultsStats
 */
export interface ResultsStatsProps {
  /** Callback to clear the URL query param */
  onClearQuery: () => void;
}

/**
 * Renders result count and an optional "clear filters" link.
 *
 * @component
 */
export function ResultsStats({ onClearQuery }: ResultsStatsProps): JSX.Element {
  const { nbHits } = useStats();
  const { status } = useInstantSearch();
  const { refine: clearAll, canRefine: hasActiveRefinements } = useClearRefinements();
  const { query, clear: clearSearch } = useSearchBox();

  // Check if the search is loading or stalled
  const isSearching = status === 'loading' || status === 'stalled';

  // Check if there are any active filters
  const hasActiveFilters = hasActiveRefinements || query.trim() !== '';

  // Callback - handle clear all
  const handleClearAll = () => {
    // Clear all refinements
    clearAll();
    clearSearch();
    onClearQuery();
  };

  return (
    <p className="text-sm font-medium text-gray-500">
      {isSearching ? (
        <span className="animate-pulse">Searching…</span>
      ) : (
        <>
          <span className="font-semibold text-gray-900">{nbHits.toLocaleString()}</span>{' '}
          {nbHits === 1 ? 'result' : 'results'}
          {hasActiveFilters && (
            <>
              {' '}
              &mdash;{' '}
              <button
                onClick={handleClearAll}
                className="font-medium underline underline-offset-2 transition hover:text-gray-700"
                style={{ color: '#526479' }}
              >
                clear filters
              </button>
            </>
          )}
        </>
      )}
    </p>
  );
}
