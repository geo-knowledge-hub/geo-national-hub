/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronRight, Search, Menu } from 'lucide-react';

import { resolveI18n, capitalizeBaseType } from './utils';

const ALL_CATEGORY = 'all';

/**
 * Resource navbar
 *
 * @component
 */
export function ResourceNavbar({
  resourceTitle,
  resources,
  activeResourceIdx,
  titleScrolledOut,
  onBackToPackage,
  onResourceSelect,
  onClose,
}: {
  resourceTitle: string;
  resources: Record<string, unknown>[];
  activeResourceIdx: number;
  /** When true, the resource title is no longer visible in the body — show it here */
  titleScrolledOut?: boolean;
  onBackToPackage: () => void;
  onResourceSelect: (index: number) => void;
  onClose: () => void;
}) {
  // State - Menu open, search query, and category
  const [menuOpen, setMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [navCategory, setNavCategory] = useState(ALL_CATEGORY);

  // Effect - Reset search query when menu is closed
  useEffect(() => {
    if (!menuOpen) {
      setNavSearch('');
    }
  }, [menuOpen]);

  // Memo - Categories and grouped resources
  const { categories, grouped } = useMemo(() => {
    const grouped = new Map<string, { meta: Record<string, unknown>; originalIndex: number }[]>();

    // Group resources by base type
    resources.forEach((res, idx) => {
      const bt = ((res.base_type as string) ?? 'other').toLowerCase();

      if (!grouped.has(bt)) {
        grouped.set(bt, []);
      }

      grouped.get(bt)!.push({ meta: res, originalIndex: idx });
    });

    // Get categories
    const categories = Array.from(grouped.keys()).sort((a, b) => {
      if (a === 'other') return 1;
      if (b === 'other') return -1;

      return a.localeCompare(b);
    });

    // Return categories and grouped resources
    return { categories, grouped };
  }, [resources]);

  // Memo - Filtered resources
  const filteredResources = useMemo(() => {
    const catFiltered =
      navCategory === ALL_CATEGORY
        ? resources.map((meta, originalIndex) => ({ meta, originalIndex }))
        : (grouped.get(navCategory) ?? []);

    if (!navSearch.trim()) {
      return catFiltered;
    }

    // Prepare search query
    const q = navSearch.toLowerCase();

    return catFiltered.filter(({ meta }) => {
      const title = resolveI18n(meta.title)?.toLowerCase() ?? '';
      return title.includes(q);
    });
  }, [resources, grouped, navCategory, navSearch]);

  return (
    <div className="rounded-t-lg border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      {/* Breadcrumb bar */}
      <div className="flex items-center justify-between gap-3 px-6 py-3 md:px-8">
        <nav className="flex min-w-0 items-center gap-1.5 text-sm">
          <button
            onClick={onBackToPackage}
            className="shrink-0 font-medium text-gray-900 transition hover:text-gray-600 hover:underline"
          >
            Back to package
          </button>
          {/* Resource title appears in breadcrumb only after scrolling past the body header */}
          {titleScrolledOut && (
            <>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="animate-fade-in truncate text-gray-600">{resourceTitle}</span>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              menuOpen ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Menu className="h-3.5 w-3.5" />
            Browse
          </button>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Embedded menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-gray-50/80 px-6 pt-3 pb-4 md:px-8">
          {/* Categories */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            <button
              onClick={() => setNavCategory(ALL_CATEGORY)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                navCategory === ALL_CATEGORY
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({resources.length})
            </button>

            {/* Categories */}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setNavCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  navCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {capitalizeBaseType(cat)} ({grouped.get(cat)?.length ?? 0})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Resource list */}
          <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white">
            {filteredResources.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                No resources match your search.
              </p>
            ) : (
              filteredResources.map(({ meta, originalIndex }) => {
                // Get the resource title
                const title = resolveI18n(meta.title) ?? `Resource ${originalIndex + 1}`;

                // Get the resource type
                const resType = resolveI18n(
                  (meta.resource_type as { title?: Record<string, string> } | undefined)?.title,
                );

                // Check if the resource type is active
                const isActive = originalIndex === activeResourceIdx;

                // Render
                return (
                  <button
                    key={originalIndex}
                    onClick={() => {
                      onResourceSelect(originalIndex);
                      setMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 border-b border-gray-50 px-4 py-2.5 text-left transition last:border-b-0 ${
                      isActive ? 'border-l-2 border-l-gray-900 bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm ${isActive ? 'font-medium text-gray-900' : 'text-gray-700'}`}
                      >
                        {title}
                      </p>
                      {resType && <p className="text-xs text-gray-500">{resType}</p>}
                    </div>

                    {/* Current resource indicator */}
                    {isActive && (
                      <span className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                        Current
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
