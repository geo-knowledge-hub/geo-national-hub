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
import { Search, X, SlidersHorizontal } from 'lucide-react';

import type { Country } from '@content-types/content';

import {
  BackButton,
  FacetGroup,
  PerPageSelector,
  PaginationRow,
  PaginationInfo,
  EmptyState,
} from '@components/global';

import type { FacetItem } from '@components/global';
import { Button } from '@ui/button';
import { Badge } from '@ui/badge';
import { usePagination } from '@lib/hooks/use-pagination';
import { filterBySearch, toggleArrayItem } from '@lib/search/utils';

import { ActivityItem } from './activity-item';

/**
 * Properties expected for the CapacityBuildingSection component.
 */
interface CapacityBuildingSectionProps {
  countryData: Country;
  /** The rendered capacity-building variant component (from the component registry). */
  heroContent: JSX.Element;
}

/**
 * Returns true if the date is today or in the future.
 */
function isFutureEvent(dateString?: string): boolean {
  if (!dateString) return false;
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  } catch {
    return false;
  }
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
  heroContent,
}: CapacityBuildingSectionProps): JSX.Element {
  // State - Search term
  const [searchTerm, setSearchTerm] = useState('');
  // State - Multi-select status filters
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  // State - Multi-select recurring filters
  const [selectedRecurring, setSelectedRecurring] = useState<string[]>([]);
  // State - Mobile filter visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  // Status facets
  const statusFacets: FacetItem[] = useMemo(() => {
    let upcoming = 0;
    let past = 0;

    sortedActivities.forEach((a) => {
      if (isFutureEvent(a.date)) {
        upcoming++;
      } else {
        past++;
      }
    });

    const items: FacetItem[] = [];

    // Add upcoming and past facets
    if (upcoming > 0) items.push({ value: 'Upcoming', count: upcoming });
    if (past > 0) items.push({ value: 'Past', count: past });

    return items;
  }, [sortedActivities]);

  // Recurring facets
  const recurringFacets: FacetItem[] = useMemo(() => {
    let yes = 0;
    let no = 0;

    sortedActivities.forEach((a) => {
      if (a.recurring) {
        yes++;
      } else {
        no++;
      }
    });

    const items: FacetItem[] = [];

    // Add yes and no facets
    if (yes > 0) items.push({ value: 'Yes', count: yes });
    if (no > 0) items.push({ value: 'No', count: no });

    return items;
  }, [sortedActivities]);

  // Apply search + status + recurring filters
  const filteredActivities = useMemo(() => {
    let result = filterBySearch(sortedActivities, searchTerm, ['title', 'description']);

    if (selectedStatuses.length > 0) {
      result = result.filter((a) => {
        const status = isFutureEvent(a.date) ? 'Upcoming' : 'Past';
        return selectedStatuses.includes(status);
      });
    }

    if (selectedRecurring.length > 0) {
      result = result.filter((a) => {
        const recurring = a.recurring ? 'Yes' : 'No';
        return selectedRecurring.includes(recurring);
      });
    }

    return result;
  }, [sortedActivities, searchTerm, selectedStatuses, selectedRecurring]);

  // Pagination
  const {
    currentPage,
    perPage,
    totalPages,
    paginatedItems: paginatedActivities,
    pageNumbers,
    handlePageChange,
    applyPerPage,
    resetPage,
  } = usePagination(filteredActivities);

  // Toggle helpers
  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => toggleArrayItem(prev, status));
    resetPage();
  };

  const toggleRecurring = (recurring: string) => {
    setSelectedRecurring((prev) => toggleArrayItem(prev, recurring));
    resetPage();
  };

  // Apply search
  function applySearch(term: string) {
    setSearchTerm(term);
    resetPage();
  }

  // Clear filters
  function clearFilters() {
    setSearchTerm('');
    setSelectedStatuses([]);
    setSelectedRecurring([]);
    resetPage();
  }

  // Has active filters
  const hasActiveFilters =
    !!searchTerm || selectedStatuses.length > 0 || selectedRecurring.length > 0;

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <>
      {statusFacets.length > 0 && (
        <FacetGroup
          title="Status"
          items={statusFacets}
          selected={selectedStatuses}
          onToggle={toggleStatus}
        />
      )}
      {recurringFacets.length > 0 && (
        <FacetGroup
          title="Recurring"
          items={recurringFacets}
          selected={selectedRecurring}
          onToggle={toggleRecurring}
        />
      )}
    </>
  );

  // Render!
  return (
    <div className="min-h-screen">
      {/* Hero — renders the user-configured capacity building variant */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-10">
          <div className="mb-4">
            <BackButton />
          </div>
          {heroContent}
        </div>
      </div>

      {/* Search bar + Sidebar Filters + Results */}
      <div className="mx-auto max-w-7xl px-6 py-8 pb-16">
        {/* Search bar */}
        <div className="mb-6">
          <div className="relative flex items-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all focus-within:border-[color:var(--theme-primary,#526479)]/50 focus-within:shadow-md focus-within:ring-2 focus-within:ring-[color:var(--theme-primary,#526479)]/10">
            <div className="pointer-events-none flex items-center pl-4">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search activities…"
              value={searchTerm}
              onChange={(e) => applySearch(e.target.value)}
              className="flex-1 border-0 bg-transparent py-3.5 pr-4 pl-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => applySearch('')}
                className="mr-3 flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile filter toggle */}
        <div className="mb-4 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="gap-1.5"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {selectedStatuses.length + selectedRecurring.length > 0 && (
              <Badge
                className="flex h-4 w-4 items-center justify-center p-0 text-[10px]"
                style={{
                  backgroundColor: 'var(--theme-primary, #526479)',
                  borderColor: 'transparent',
                }}
              >
                {selectedStatuses.length + selectedRecurring.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Mobile filters panel */}
        {showMobileFilters && (
          <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50/50 p-4 md:hidden">
            {sidebarContent}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-8">{sidebarContent}</div>
          </aside>

          {/* Results column */}
          <div>
            {/* Results bar */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-gray-500">
                <span className="font-semibold text-gray-900">
                  {filteredActivities.length.toLocaleString()}
                </span>{' '}
                {filteredActivities.length === 1 ? 'activity' : 'activities'}
                {hasActiveFilters && (
                  <>
                    {' '}
                    &mdash;{' '}
                    <button
                      onClick={clearFilters}
                      className="font-medium underline underline-offset-2 transition hover:text-gray-700"
                      style={{ color: 'var(--theme-primary, #526479)' }}
                    >
                      clear filters
                    </button>
                  </>
                )}
              </p>

              <PerPageSelector
                value={perPage}
                onChange={applyPerPage}
                prefixLabel="Show"
                suffixLabel="per page"
              />
            </div>

            {/* Activity list */}
            {filteredActivities.length === 0 ? (
              <EmptyState
                heading="No activities found"
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {paginatedActivities.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <PaginationRow
              currentPage={currentPage}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              onPageChange={handlePageChange}
            />
            <PaginationInfo
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredActivities.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
