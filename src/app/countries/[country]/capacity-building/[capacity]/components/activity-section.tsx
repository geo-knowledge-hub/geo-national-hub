/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useMemo, JSX } from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

import type { Country } from '@content-types/content';

import { ActivityItem } from './activity-item';

/**
 * Per-page options for pagination.
 */
const PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

/**
 * Properties expected for the CapacityBuildingSection component.
 */
interface CapacityBuildingSectionProps {
  countryData: Country;
}

/**
 * Simple text search filter across string fields.
 */
function filterBySearch<T>(items: T[], searchTerm: string, fields: (keyof T)[]): T[] {
  if (!searchTerm.trim()) return items;
  const term = searchTerm.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      return typeof value === 'string' && value.toLowerCase().includes(term);
    }),
  );
}

/**
 * CapacityBuildingSection Component
 *
 * @component
 * @param {CapacityBuildingSectionProps} props - Component props.
 * @returns {JSX.Element} The rendered CapacityBuildingSection component.
 */
export function CapacityBuildingSection({
  countryData,
}: CapacityBuildingSectionProps): JSX.Element {
  // State - Search term
  const [searchTerm, setSearchTerm] = useState('');
  // State - Current page
  const [currentPage, setCurrentPage] = useState(1);
  // State - Per page
  const [perPage, setPerPage] = useState<(typeof PER_PAGE_OPTIONS)[number]>(5);

  const activities = countryData.capacity_building_activities ?? [];

  // Sort by date (most recent first)
  const sortedActivities = useMemo(
    () =>
      [...activities].sort((a, b) => {
        if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (a.date) return -1;
        if (b.date) return 1;
        return 0;
      }),
    [activities],
  );

  // Apply search
  const filteredActivities = useMemo(
    () => filterBySearch(sortedActivities, searchTerm, ['title', 'description']),
    [sortedActivities, searchTerm],
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / perPage));

  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredActivities.slice(start, start + perPage);
  }, [filteredActivities, currentPage, perPage]);

  // Page number list
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      )
        pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  // Apply search
  function applySearch(term: string) {
    setSearchTerm(term);
    setCurrentPage(1);
  }

  // Apply per page
  function applyPerPage(pp: (typeof PER_PAGE_OPTIONS)[number]) {
    setPerPage(pp);
    setCurrentPage(1);
  }

  // Handle page change
  function handlePageChange(page: number) {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Render!
  return (
    <section className="mt-10 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="themed-title mb-1 text-3xl font-bold">List of activities</h2>
            <p className="text-sm text-gray-500">
              Explore capacity building activities in {countryData.title}.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full lg:w-72">
            <div className="relative flex items-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all focus-within:border-[color:var(--theme-primary,#526479)]/50 focus-within:shadow-md focus-within:ring-2 focus-within:ring-[color:var(--theme-primary,#526479)]/10">
              <div className="pointer-events-none flex items-center pl-4">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search activities…"
                value={searchTerm}
                onChange={(e) => applySearch(e.target.value)}
                className="flex-1 border-0 bg-transparent py-2.5 pr-3 pl-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => applySearch('')}
                  className="mr-3 flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results bar */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-gray-500">
            <span className="font-semibold text-gray-900">
              {filteredActivities.length.toLocaleString()}
            </span>{' '}
            {filteredActivities.length === 1 ? 'activity' : 'activities'}
          </p>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-gray-400 sm:inline">Show</span>
            <div className="flex rounded-lg border border-gray-200 bg-white">
              {PER_PAGE_OPTIONS.map((n, i) => (
                <button
                  key={n}
                  onClick={() => applyPerPage(n)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    i > 0 ? 'border-l border-gray-200' : ''
                  } ${perPage === n ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  style={
                    perPage === n ? { backgroundColor: 'var(--theme-primary, #526479)' } : undefined
                  }
                >
                  {n}
                </button>
              ))}
            </div>
            <span className="hidden text-xs text-gray-400 sm:inline">per page</span>
          </div>
        </div>

        {/* Activity list */}
        {filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/60 py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <Search className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-base font-semibold text-gray-700">No activities found</p>
            {searchTerm && (
              <p className="mt-1.5 text-sm text-gray-400">
                Try a different search term or{' '}
                <button
                  onClick={() => applySearch('')}
                  className="font-medium underline underline-offset-2"
                  style={{ color: 'var(--theme-primary, #526479)' }}
                >
                  clear search
                </button>
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {paginatedActivities.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-0.5">
              {pageNumbers.map((p, i) =>
                p === 'ellipsis' ? (
                  <span key={`e-${i}`} className="px-2 text-sm text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`h-9 w-9 rounded-xl text-sm font-medium transition-all ${
                      currentPage === p ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={
                      currentPage === p
                        ? { backgroundColor: 'var(--theme-primary, #526479)' }
                        : undefined
                    }
                    aria-current={currentPage === p ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <p className="mt-3 text-center text-xs text-gray-400">
            Page {currentPage} of {totalPages} &mdash; {filteredActivities.length.toLocaleString()}{' '}
            total
          </p>
        )}
      </div>
    </section>
  );
}
