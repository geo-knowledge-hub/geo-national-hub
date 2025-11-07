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

import { Country, CapacityBuildingActivity } from '@data/content/resources';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

/**
 * Properties expected for the ``ContentSection`` component.
 */
interface CapacityBuildingSectionProps {
  countryData: Country;
}

/**
 * Properties of the ``NavItem`` .
 */
interface ActivityItemProps {
  activity: CapacityBuildingActivity;
}

/**
 * ResourceCard Component
 *
 * @component
 * @param {ActivityItemProps} params Component params.
 * @returns {JSX.Element} The rendered ``ResourceCard`` component.
 */
const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
}: ActivityItemProps): JSX.Element => {
  // Define challenge icon (in this early-stage version, we are using icons. We will change this soon)
  const ActivityLogo = activity.logo;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex-1 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 transition hover:text-gray-700">
          <Link href={activity.link}>{activity.title}</Link>
        </h3>
        <p className="mt-1 text-sm text-gray-600">{activity.description}</p>

        <Link
          href={activity.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block font-medium text-gray-800 transition hover:text-gray-900"
        >
          Explore →
        </Link>
      </div>
      <div className={'rounded-md bg-gray-100 p-5'}>
        <ActivityLogo className="flex h-6 w-6 items-center justify-center rounded-lg" />
      </div>
    </div>
  );
};

/**
 * CapacityBuildingSection Component - Displays capacity building associated to a country.
 *
 * @component
 * @param {CapacityBuildingSectionProps} params Component params.
 * @returns {JSX.Element} The rendered HomePage component.
 */
export const CapacityBuildingSection: React.FC<CapacityBuildingSectionProps> = ({
  countryData,
}: CapacityBuildingSectionProps): JSX.Element => {
  /**
   * Extract base data
   */
  const capacityBuildingActivities = countryData.capacityBuildingActivities;

  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredChallenges, setFilteredChallenges] = useState<CapacityBuildingActivity[]>(
    capacityBuildingActivities,
  );
  const [miniSearch, setMiniSearch] = useState<MiniSearch<CapacityBuildingActivity> | null>(null);

  // Pagination state
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);

  /**
   * Side effects - Initialize MiniSearch
   */
  useEffect(() => {
    // Initialize MiniSearch
    const miniSearchInstance = new MiniSearch<CapacityBuildingActivity>({
      fields: ['id', 'title', 'description'],
      storeFields: ['id', 'title', 'description', 'logo', 'link'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Index records
    miniSearchInstance.addAll(
      capacityBuildingActivities.map((resource, index) => ({ id: index, ...resource })),
    );

    setMiniSearch(miniSearchInstance);
  }, [capacityBuildingActivities]);

  /**
   * Side effects - Search content.
   */
  useEffect(() => {
    if (!miniSearch || searchTerm.trim() === '') {
      setFilteredChallenges(capacityBuildingActivities);
    } else {
      const results = miniSearch.search(searchTerm).map((result) => result);
      // @ts-expect-error Convertion error
      setFilteredChallenges(results);
    }

    // Reset pagination on new search
    setCurrentPage(1);
  }, [searchTerm, miniSearch, capacityBuildingActivities]);

  const totalPages = Math.ceil(filteredChallenges.length / itemsPerPage);

  const paginatedActivities = filteredChallenges.slice(
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
            <h2 className="mb-2 text-3xl font-bold text-gray-900">List of activities</h2>
            <p className="mb-4 text-gray-600">
              Explore capacity building activities in {countryData.title}.
            </p>
          </div>

          {/* Search Bar aligned with header */}
          <div className="mt-4 lg:mt-0">
            <div className="relative w-full lg:w-72">
              <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm outline-none focus:border-gray-400 focus:shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="mt-2 space-y-5 rounded-lg">
          {paginatedActivities.length > 0 ? (
            paginatedActivities.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))
          ) : (
            <p className="text-center text-gray-500">No activites found.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center space-x-4 text-sm font-medium text-gray-600">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`transition hover:text-gray-900 ${
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
                      ? 'border-gray-600 text-gray-900'
                      : 'border-transparent hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`transition hover:text-gray-900 ${
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
};
