/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, JSX } from 'react';

import { useRefinementList } from 'react-instantsearch';
import type { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';

import { Button } from '@ui/button';

/**
 * Visible limit for the facet group
 */
const VISIBLE_LIMIT = 10;

/**
 * Props for InstantSearchFacetGroup
 */
export interface InstantSearchFacetGroupProps {
  /** Typesense field to facet on */
  attribute: string;
  /** Label shown above the facet */
  title: string;
  /** Optional transformer applied to items before rendering */
  transformItems?: (items: RefinementListItem[]) => RefinementListItem[];
}

/**
 * Custom facet group component backed by React InstantSearch's
 * useRefinementList hook. Renders with checkbox indicators + counts.
 *
 * @component
 */
export function InstantSearchFacetGroup({
  attribute,
  title,
  transformItems,
}: InstantSearchFacetGroupProps): JSX.Element | null {
  const { items, refine } = useRefinementList({ attribute, limit: 50, transformItems });
  const [expanded, setExpanded] = useState(false);

  // If the items are empty, return null
  if (items.length === 0) {
    return null;
  }

  // Check if there are more items than the visible limit
  const hasMore = items.length > VISIBLE_LIMIT;

  // Get the visible items
  const visibleItems = expanded ? items : items.slice(0, VISIBLE_LIMIT);

  // Get the hidden count
  const hiddenCount = items.length - VISIBLE_LIMIT;

  return (
    <div className="mb-5">
      <p className="mb-2.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">{title}</p>
      <div className="flex flex-col gap-1">
        {visibleItems.map((item) => {
          const isSelected = item.isRefined;
          const isEmpty = item.count === 0 && !isSelected;

          return (
            <Button
              key={item.value}
              variant="ghost"
              size="auto"
              onClick={() => refine(item.value)}
              className={`group flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left whitespace-normal ${isEmpty ? 'opacity-40' : ''}`}
            >
              <div
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                  isSelected ? '' : 'border-gray-300 bg-white group-hover:border-gray-400'
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: 'var(--theme-primary, #526479)',
                        backgroundColor: 'var(--theme-primary, #526479)',
                      }
                    : undefined
                }
              >
                {isSelected && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span
                className={`flex-1 text-sm ${isSelected ? 'font-medium text-gray-900' : 'text-gray-600'}`}
              >
                {item.label}
              </span>
              <span className="mt-0.5 shrink-0 text-xs text-gray-400">{item.count}</span>
            </Button>
          );
        })}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 px-2 text-left text-xs font-medium transition hover:underline"
            style={{ color: 'var(--theme-primary, #526479)' }}
          >
            {expanded ? 'Show less' : `Show more (+${hiddenCount})`}
          </button>
        )}
      </div>
    </div>
  );
}
