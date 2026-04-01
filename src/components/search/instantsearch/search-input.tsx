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

import { Search, X } from 'lucide-react';
import { useSearchBox } from 'react-instantsearch';

/**
 * Props for SearchInput
 */
export interface SearchInputProps {
  /** Forwarded ref so the parent can focus the input programmatically */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Callback to keep URL state in sync */
  onQueryChange: (q: string) => void;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Full-width search input 
 *
 * @component
 */
export function SearchInput({
  inputRef,
  onQueryChange,
  placeholder = 'Search resources, datasets, tools…',
}: SearchInputProps): JSX.Element {
  const { query, refine, clear } = useSearchBox();

  // Callback - handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    refine(value);
    onQueryChange(value);
  };

  // Callback - handle clear
  const handleClear = () => {
    clear();
    onQueryChange('');
  };

  // Render the search input
  return (
    <div className="relative flex items-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all focus-within:border-[#526479]/50 focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#526479]/10">
      <div className="pointer-events-none flex items-center pl-4">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="flex-1 border-0 bg-transparent py-3.5 pr-4 pl-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
      />

      {/* Keyboard hint / clear */}
      {query ? (
        <button
          onClick={handleClear}
          className="mr-3 flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-500 transition hover:bg-gray-200"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : (
        <div className="mr-4 hidden items-center gap-1 sm:flex">
          <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-400">
            ⌘K
          </kbd>
        </div>
      )}
    </div>
  );
}
