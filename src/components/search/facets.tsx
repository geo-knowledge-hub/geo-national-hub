/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';

import { Button } from '@ui/button';

/**
 * FacetItem - Represents a single facet option with its count.
 */
export interface FacetItem {
  value: string;
  count: number;
}

/**
 * FacetGroupProps - Define the properties accepted in the ``FacetGroup`` component.
 */
interface FacetGroupProps {
  title: string;
  items: FacetItem[];
  selected: string[];
  onToggle: (val: string) => void;
}

/**
 * Facet button component with dynamic counts.
 *
 * @component
 * @param {FacetGroupProps} props - Component props.
 * @returns {JSX.Element} The rendered FacetGroup component.
 */
export const FacetGroup: React.FC<FacetGroupProps> = ({
  title,
  items,
  selected,
  onToggle,
}: FacetGroupProps): JSX.Element => (
  <div className="mb-5">
    <p className="mb-2.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">{title}</p>
    <div className="flex flex-col gap-1">
      {items.map((item) => {
        const isSelected = selected.includes(item.value);
        const isEmpty = item.count === 0 && !isSelected;

        return (
          <Button
            key={item.value}
            variant="ghost"
            size="auto"
            onClick={() => onToggle(item.value)}
            className={`group flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left whitespace-normal ${isEmpty ? 'opacity-40' : ''}`}
          >
            {/* Checkbox indicator */}
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
            {/* Label and count */}
            <span
              className={`flex-1 text-sm ${isSelected ? 'font-medium text-gray-900' : 'text-gray-600'}`}
            >
              {item.value}
            </span>
            <span className="mt-0.5 shrink-0 text-xs text-gray-400">{item.count}</span>
          </Button>
        );
      })}
    </div>
  </div>
);
