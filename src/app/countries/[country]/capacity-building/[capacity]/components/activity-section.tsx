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

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import type { Country } from '@content-types/content';

import { ActivityItem } from './activity-item';

/**
 * Properties expected for the CapacityBuildingSection component.
 */
interface CapacityBuildingSectionProps {
  countryData: Country;
}

/**
 * Simple search filter function
 */
function filterBySearch<T>(items: T[], searchTerm: string, fields: (keyof T)[]): T[] {
  if (!searchTerm.trim()) {
    return items;
  }

  // prepare search term
  const term = searchTerm.toLowerCase();

  // filter items
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      }
      return false;
    }),
  );
}

/**
 * CapacityBuildingSection Component - Displays capacity building activities for a country.
 *
 * @component
 * @param {CapacityBuildingSectionProps} params Component params.
 * @returns {JSX.Element} The rendered CapacityBuildingSection component.
 */
export function CapacityBuildingSection({
  countryData,
}: CapacityBuildingSectionProps): JSX.Element {
  // State - Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const activities = countryData.capacity_building_activities || [];

  /**
   * Sort activities by date (most recent first)
   */
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      // If both have dates, sort by date (most recent first)
      if (a.date && b.date) {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Most recent first
      }

      // If only one has a date, prioritize it
      if (a.date && !b.date) return -1;
      if (!a.date && b.date) return 1;

      // If neither has a date, maintain original order
      return 0;
    });
  }, [activities]);

  /**
   * Apply search filter
   */
  const filteredActivities = useMemo(() => {
    const filtered = filterBySearch(sortedActivities, searchTerm, ['title', 'description']);
    return filtered;
  }, [sortedActivities, searchTerm]);

  // Handle search change and reset pagination
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Rendering!
  return (
    <section className="mt-10 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Header & Description */}
          <div>
            <h2 className="themed-title mb-2 text-3xl font-bold">List of activities</h2>
            <p className="mb-4">Explore capacity building activities in {countryData.title}.</p>
          </div>

          {/* Search Bar aligned with header */}
          <div className="mt-4 lg:mt-0">
            <div className="relative w-full lg:w-72">
              <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="themed-input w-full rounded-md border bg-white py-2 pr-3 pl-10 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="mt-2 space-y-5 rounded-lg">
          {paginatedActivities.length > 0 ? (
            paginatedActivities.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))
          ) : (
            <p className="text-center">No activities found.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center space-x-4 text-sm font-medium">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`themed-link transition ${
                  currentPage === 1 ? 'cursor-not-allowed text-gray-300' : ''
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`border-b-2 px-1 pb-0.5 transition ${
                    currentPage === page
                      ? 'themed-pagination-active'
                      : 'themed-link border-transparent hover:border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`themed-link transition ${
                  currentPage === totalPages ? 'cursor-not-allowed text-gray-300' : ''
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}
