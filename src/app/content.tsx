/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect, useRef, useMemo, JSX } from 'react';
import Link from 'next/link';

import { searchCountriesAction } from '@lib/typesense/actions';
import type { Country } from '@content-types/content';

import { HeroSearch } from './components';

/**
 * Number of items displayed per page in the search results.
 */
const ITEMS_PER_PAGE = 12;

/**
 * Debounce delay in milliseconds
 */
const DEBOUNCE_DELAY = 400;

/**
 * IDs of countries that are currently available (have content)
 */
const AVAILABLE_COUNTRY_IDS = new Set(['ghana', 'south-africa']);

/**
 * Checks if a country is available (has content)
 * ToDo: Replace with API call to check if country has content
 */
function isCountryAvailable(countryId: string): boolean {
  return AVAILABLE_COUNTRY_IDS.has(countryId);
}

/**
 * Sorts countries with available ones first, maintaining alphabetical order within groups
 */
function sortCountriesAvailableFirst(countries: Country[]): Country[] {
  return [...countries].sort((a, b) => {
    const aAvailable = isCountryAvailable(a.id);
    const bAvailable = isCountryAvailable(b.id);

    // Available countries come first
    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;

    // Within same group, sort alphabetically by title
    return a.title.localeCompare(b.title);
  });
}

/**
 * Props for HomePageContent component
 */
interface HomePageContentProps {
  initialCountries: Country[];
}

/**
 * HomePageContent Component - Client component for country list with search and pagination.
 *
 * @component
 * @param {HomePageContentProps} props - Component props.
 * @returns {JSX.Element} The rendered HomePageContent component.
 */
export function HomePageContent({ initialCountries }: HomePageContentProps): JSX.Element {
  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  /**
   * Refs for debounce and initial data
   */
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const initialCountriesRef = useRef(initialCountries);

  /**
   * Side effects - Debounced search when term changes
   */
  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // If empty search, reset immediately without API call
    if (searchTerm.trim() === '') {
      setCountries(initialCountriesRef.current);
      setIsSearching(false);
      return;
    }

    // Set debounce timeout
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await searchCountriesAction(searchTerm);
        if (response.success && response.data) {
          setCountries(response.data);
        }
      } catch (error) {
        console.error('Search error:', error);
        setCountries(initialCountriesRef.current);
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_DELAY);

    // Cleanup on unmount or when searchTerm changes
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  /**
   * Reset to first page when search changes
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Sort countries with available ones first
  const sortedCountries = useMemo(() => sortCountriesAvailableFirst(countries), [countries]);

  // Pagination
  const totalPages = Math.ceil(sortedCountries.length / ITEMS_PER_PAGE);
  const paginatedCountries = sortedCountries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Rendering!
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <HeroSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Results Section */}
      <div className="results-section mx-auto max-w-7xl px-6 pb-12">
        {/* Loading indicator */}
        {isSearching && <div className="mb-4 text-center text-sm text-gray-500">Searching...</div>}

        {/* Country Grid */}
        {paginatedCountries.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedCountries.map((country) => {
              const countryKey = country.id;
              const isAvailable = isCountryAvailable(countryKey);
              const countryLink = isAvailable ? `/countries/${countryKey}` : '#';

              return (
                <Link
                  key={countryKey}
                  href={countryLink}
                  className={`group block ${!isAvailable ? 'cursor-not-allowed' : ''}`}
                >
                  <div
                    className={`glass-card relative h-full overflow-hidden ${
                      isAvailable ? 'animate-pulse-border' : 'opacity-60'
                    }`}
                  >
                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h5 className="text-lg font-bold tracking-tight text-gray-900">
                          {country.title}
                        </h5>
                        {isAvailable && (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#526479]/10 text-[#526479] transition-all duration-200 group-hover:translate-x-1 group-hover:bg-[#526479]/20">
                            →
                          </span>
                        )}
                      </div>
                      {isAvailable ? (
                        <p className="mt-3 text-xs font-medium text-[#526479]">Already available</p>
                      ) : (
                        <p className="mt-3 text-xs text-gray-500">Coming soon</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="rounded-full bg-gray-100 p-6">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-900">No countries found</p>
            <p className="mt-2 text-sm text-gray-600">
              Try adjusting your search terms or{' '}
              <button
                onClick={() => setSearchTerm('')}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                clear your search
              </button>
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current
                    return (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    );
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if there's a gap
                    const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && <span className="px-2 text-gray-400">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                              ? 'bg-gray-900 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
              >
                Next
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
