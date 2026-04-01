/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useEffect, JSX } from 'react';

import { Button } from '@ui/button';

/**
 * Record type filter
 */
export type RecordTypeFilter = 'all' | 'kp' | 'kr';

/**
 * Props for RecordTypeFacet
 */
export interface RecordTypeFacetProps {
  value: RecordTypeFilter;
  onChange: (value: RecordTypeFilter) => void;
}

/**
 * Custom facet that filters resources into Knowledge Package vs Knowledge Resource.
 *
 * This component is controlled — the parent manages the state and applies the
 * corresponding Typesense filter string via Configure:
 *
 * - KP: `resource_type.id:=knowledge`
 * - KR: `resource_type.id:!=knowledge`
 * - All: no filter
 *
 * This avoids conflicts with the Resource Type facet's useRefinementList.
 */
export function RecordTypeFacet({ value, onChange }: RecordTypeFacetProps): JSX.Element {
  // Callback - handle click
  const handleClick = (type: RecordTypeFilter) => {
    onChange(value === type ? 'all' : type);
  };

  // Options for the record type facet
  const options: { key: RecordTypeFilter; label: string }[] = [
    { key: 'kp', label: 'Knowledge Package' },
    { key: 'kr', label: 'Knowledge Resource' },
  ];

  // Render the record type facet
  return (
    <div className="mb-5">
      <p className="mb-2.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        Record Type
      </p>
      <div className="flex flex-col gap-1">
        {options.map(({ key, label }) => {
          const isSelected = value === key;

          return (
            <Button
              key={key}
              variant="ghost"
              size="auto"
              onClick={() => handleClick(key)}
              className="group flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left whitespace-normal"
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
                {label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Build a Typesense filter string for the given record type
 */
export function recordTypeFilterStr(value: RecordTypeFilter): string {
  switch (value) {
    case 'kp':
      return 'resource_type.id:=knowledge';
    case 'kr':
      return 'resource_type.id:!=knowledge';
    default:
      return '';
  }
}
