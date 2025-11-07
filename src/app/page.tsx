/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect, JSX } from 'react';

import Link from 'next/link';

import MiniSearch from 'minisearch';

import { HeroSearch } from './components';

import db from '@data/db';
import { Country } from '@data/content/resources';

/**
 * Number of items displayed per page in the search results.
 */
const ITEMS_PER_PAGE = 12;

/**
 * HomePage Component - Displays a list of countries with search and pagination.
 *
 * @component
 * @returns {JSX.Element} The rendered HomePage component.
 */
const HomePage: React.FC = (): JSX.Element => {
  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredCountries, setFilteredCountries] = useState<string[]>(Object.keys(db.countries));
  const [miniSearch, setMiniSearch] = useState<MiniSearch<Country> | null>(null);

  /**
   * Side effects - Initialize MiniSearch
   */
  useEffect(() => {
    const miniSearchInstance = new MiniSearch<Country>({
      fields: ['title'],
      storeFields: ['title', 'flag'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Index all countries
    const countryEntries = Object.entries(db.countries).map(([key, value]) => {
      return {
        ...value,
        id: key,
      };
    });
    miniSearchInstance.addAll(countryEntries);

    setMiniSearch(miniSearchInstance);
  }, []);

  /**
   * Side effects - Search content.
   */
  useEffect(() => {
    if (!miniSearch || searchTerm.trim() === '') {
      setFilteredCountries(Object.keys(db.countries));
    } else {
      const results = miniSearch.search(searchTerm).map((res) => res.id);
      setFilteredCountries(results);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, miniSearch]);

  // Pagination
  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
  const paginatedCountries = filteredCountries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Rendering!
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <HeroSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Results Section */}
      <div className="mx-auto max-w-7xl px-6 pb-12">
        {/* Country Grid */}
        {paginatedCountries.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedCountries.map((countryKey) => {
              const country = db.countries[countryKey];
              const isAllowed = countryKey === 'ghana' || countryKey === 'south-africa';
              const countryLink = isAllowed ? `/countries/${countryKey}` : '#';

              return (
                <Link
                  key={countryKey}
                  href={countryLink}
                  className={`group block transition-transform duration-200 hover:scale-[1.02] ${
                    !isAllowed ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <div
                    className={`relative h-full overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 ${
                      isAllowed
                        ? 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                        : 'border-gray-200 opacity-75'
                    }`}
                  >
                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h5 className="text-lg font-bold tracking-tight text-gray-900">
                          {country.title}
                        </h5>
                        {isAllowed && (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-all duration-200 group-hover:translate-x-1 group-hover:bg-blue-100">
                            →
                          </span>
                        )}
                      </div>
                      {isAllowed ? (
                        <p className="mt-3 text-xs font-medium text-blue-600">Already available</p>
                      ) : (
                        <p className="mt-3 text-xs text-gray-500">Coming soon</p>
                      )}
                    </div>

                    {/* Hover Overlay Effect */}
                    {isAllowed && (
                      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/0 to-blue-50/0 transition-all duration-200 group-hover:from-blue-50/50 group-hover:to-transparent" />
                    )}
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
};

export default HomePage;
