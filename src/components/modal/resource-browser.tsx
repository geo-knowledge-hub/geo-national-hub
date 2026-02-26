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
import { Search, ChevronRight } from 'lucide-react';

import { resolveI18n, capitalizeBaseType } from './utils';

/**
 * Constants
 */
const ALL_CATEGORY = 'all';
const RESOURCES_PER_PAGE = 6;

/**
 * Resource browser component.
 *
 * @component
 */
export function ResourceBrowser({
  resources,
  activeCategory,
  onCategoryChange,
  onResourceSelect,
}: {
  resources: Record<string, unknown>[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onResourceSelect: (index: number) => void;
}) {
  // State - Search query and current page
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Effect - Reset page
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Memo - Categories and grouped resources
  const { categories, grouped } = useMemo(() => {
    const grouped = new Map<string, { meta: Record<string, unknown>; originalIndex: number }[]>();

    // Group resources by base type
    resources.forEach((res, idx) => {
      const baseType = (res.base_type as string) ?? 'other';
      const key = baseType.toLowerCase();

      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push({ meta: res, originalIndex: idx });
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
    const categoryFiltered =
      activeCategory === ALL_CATEGORY
        ? resources.map((meta, originalIndex) => ({ meta, originalIndex }))
        : (grouped.get(activeCategory) ?? []);

    if (!searchQuery.trim()) {
      return categoryFiltered;
    }

    // Prepare search query
    const q = searchQuery.toLowerCase();

    // Filter resources by title
    return categoryFiltered.filter(({ meta }) => {
      const title = resolveI18n(meta.title)?.toLowerCase() ?? '';
      return title.includes(q);
    });
  }, [resources, grouped, activeCategory, searchQuery]);

  // Calculate total pages, safe page, and page start
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / RESOURCES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * RESOURCES_PER_PAGE;
  const pageItems = filteredResources.slice(pageStart, pageStart + RESOURCES_PER_PAGE);

  // If there are no resources, return null
  if (resources.length === 0) {
    return null;
  }

  // Render!
  return (
    <section>
      <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
        Knowledge Resources ({resources.length})
      </h3>

      {/* Category filters */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(ALL_CATEGORY)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
            activeCategory === ALL_CATEGORY
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({resources.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              activeCategory === cat
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {capitalizeBaseType(cat)} ({grouped.get(cat)?.length ?? 0})
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative mb-3">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resources by title..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Resources */}
      {pageItems.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">No resources match your search.</p>
      ) : (
        <div className="space-y-1.5">
          {pageItems.map(({ meta, originalIndex }) => {
            // Get the resource title
            const resTitle = resolveI18n(meta.title) ?? `Resource ${originalIndex + 1}`;

            // Get the resource type title
            const resTypeTitle = resolveI18n(
              (meta.resource_type as { title?: Record<string, string> } | undefined)?.title,
            );

            // Render
            return (
              <button
                key={originalIndex}
                onClick={() => onResourceSelect(originalIndex)}
                className="group flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-left transition hover:border-gray-200 hover:bg-gray-100/80"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-gray-950">
                    {resTitle}
                  </p>
                  {resTypeTitle && <p className="mt-0.5 text-xs text-gray-500">{resTypeTitle}</p>}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-gray-600" />
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination footer */}
      {filteredResources.length > RESOURCES_PER_PAGE && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {pageStart + 1} -{' '}
            {Math.min(pageStart + RESOURCES_PER_PAGE, filteredResources.length)} of{' '}
            {filteredResources.length} resources
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  page === safePage
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
