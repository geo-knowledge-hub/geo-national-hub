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

/**
 * Properties expected for the FocusAreaPills component.
 */
interface FocusAreaPillsProps {
  /** All available focus areas */
  focusAreas: string[];
  /** Currently selected focus areas */
  selected: string[];
  /** Callback when selection changes */
  onToggle: (area: string) => void;
}

/**
 * FocusAreaPills Component
 *
 * @component
 * @param {FocusAreaPillsProps} props - Component props.
 * @returns {JSX.Element} The rendered FocusAreaPills component.
 */
export function FocusAreaPills({
  focusAreas,
  selected,
  onToggle,
}: FocusAreaPillsProps): JSX.Element {
  // If no focus areas, return empty
  if (focusAreas.length === 0) {
    return <></>;
  }

  // Otherwise, render pills
  return (
    <div className="flex flex-wrap items-center gap-2">
      {focusAreas.map((area) => {
        // Check if area is selected
        const isActive = selected.includes(area);

        // Render pill
        return (
          <button
            key={area}
            onClick={() => onToggle(area)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              isActive
                ? 'themed-bg text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            {area}
          </button>
        );
      })}

      {/* Clear all button */}
      {selected.length > 0 && (
        <button
          onClick={() => selected.forEach(onToggle)}
          className="text-xs text-gray-400 underline transition hover:text-gray-600"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
