/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';

/**
 * FacetGroupProps - Define the properties accepted in the ``FacetGroup`` component.
 */
interface FacetGroupProps {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (val: string) => void;
}

/**
 * Facet button component.
 *
 * @component
 * @param {FacetGroupProps} props - Component props.
 * @param {string} props.title - Facet button title.
 * @param {string[]} props.items - Facet options for this group.
 * @param {string[]} props.selected - Selected facet items.
 * @param {Function} props.onToggle - Callback called when one facet item is selected.
 * @returns {JSX.Element} The rendered FacetGroup component.
 */
export const FacetGroup: React.FC<FacetGroupProps> = ({
  title,
  items,
  selected,
  onToggle,
}: FacetGroupProps): JSX.Element => (
  <div className="mb-6">
    <p className="mb-2 text-sm font-semibold text-gray-700">{title}</p>
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onToggle(item)}
          className={`rounded-xl border px-3 py-1.5 text-sm ${
            selected.includes(item)
              ? 'bg-gray-900 text-white'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  </div>
);
