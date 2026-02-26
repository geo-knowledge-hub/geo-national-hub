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
 * Tag list component.
 *
 * @param items - The list of items to display.
 * @returns Tag list element.
 *
 * @component
 */
export function TagList({ items }: { items: string[] }): JSX.Element {
  // if there are no items, return a placeholder
  if (items.length === 0) {
    return <p className="text-sm text-gray-400">Not specified</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={i}
          className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
