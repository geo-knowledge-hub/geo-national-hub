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

import { useHits, useSearchBox, useClearRefinements, useInstantSearch } from 'react-instantsearch';

import { EmptyState } from '../empty';

import type { Resource } from '@content-types/content';

/**
 * Props for HitsList
 */
export interface HitsListProps {
  /** Render function for each hit */
  renderHit: (item: Resource) => JSX.Element;
  /** Callback to clear the URL query param */
  onClearQuery: () => void;
}

/**
 * Renders all current hits from InstantSearch using a render prop.
 *
 * @component
 */
export function HitsList({ renderHit, onClearQuery }: HitsListProps): JSX.Element {
  const { hits } = useHits<Resource>();
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
    // Clear the search
    clearSearch();
    onClearQuery();
  };

  // If there are no hits and the search is not loading, show the empty state
  if (hits.length === 0 && !isSearching) {
    return <EmptyState hasActiveFilters={hasActiveFilters} onClearFilters={handleClearAll} />;
  }

  return (
    <div
      className={`flex flex-col gap-4 transition-opacity duration-200 ${isSearching ? 'opacity-40' : 'opacity-100'}`}
    >
      {hits.map((item) => (
        <React.Fragment key={item.id}>{renderHit(item)}</React.Fragment>
      ))}
    </div>
  );
}
