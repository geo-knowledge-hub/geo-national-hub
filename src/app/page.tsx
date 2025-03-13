/*
 * This file is part of GEO-Country-Profile.
 * Copyright (C) 2025 GEO Knowledge Hub Developers.
 *
 * GEO-Country-Profile is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect, JSX } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import MiniSearch from 'minisearch';

import { HeroSearch } from './components';

import db, { Country } from '@data/db';

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
  }, [searchTerm, miniSearch]);

  // Pagination
  const paginatedCountries = filteredCountries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Rendering!
  return (
    <div className="mt-10 min-h-screen bg-gray-50 p-6">
      {/* Page Title */}
      <HeroSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Country Grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {paginatedCountries.length > 0 ? (
          paginatedCountries.map((countryKey) => {
            const country = db.countries[countryKey];
            const isGhana = countryKey === "ghana";
            const countryLink = isGhana ? `/countries/${countryKey}` : "#";

            return (
              <Link key={countryKey} href={countryLink} className="group block">
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                  <div className="relative h-40 w-full">
                    <Image
                      src={country.flag}
                      alt={`${country.title} flag`}
                      fill
                      className="rounded-t-lg"
                    />
                  </div>
                  <div className="flex items-center justify-between p-5">
                    <h5 className="text-md font-bold tracking-tight text-gray-900">
                      {country.title}
                    </h5>
                    <span className="text-gray-600 transition duration-200 group-hover:translate-x-1 group-hover:text-blue-600">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">No countries found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-10 flex justify-center space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage * ITEMS_PER_PAGE >= filteredCountries.length}
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
