/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect, useMemo, JSX } from 'react';

import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

import MiniSearch from 'minisearch';

import { Country, CapacityBuildingActivity } from '@data/content/resources';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import { Badge } from '@components/global';

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
  // Check if logo is an image (StaticImageData) or a component (HeroIcon)
  const isImageLogo = typeof activity.logo === 'object' && 'src' in activity.logo;
  const ActivityLogo = isImageLogo
    ? null
    : (activity.logo as React.ComponentType<React.SVGProps<SVGSVGElement>>);

  // Format date for display
  const formatDate = (dateString?: string): string | null => {
    if (!dateString) return null;
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return null;
    }
  };

  // Check if event is in the future
  const isFutureEvent = (dateString?: string): boolean => {
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
  };

  const formattedDate = formatDate(activity.date);
  const isFuture = isFutureEvent(activity.date);

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex-1 space-y-3">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {formattedDate && <Badge color="gray-900" textColor="white" label={formattedDate} />}
          {activity.recurring && (
            <Badge color="purple-100" textColor="purple-800" label="Recurring" />
          )}
          {isFuture && <Badge color="green-100" textColor="green-800" label="Upcoming" />}
        </div>

        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 transition hover:text-gray-700">
            <Link href={activity.link}>{activity.title}</Link>
          </h3>
        </div>
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
        {isImageLogo ? (
          <Image
            src={activity.logo as StaticImageData}
            alt="Activity icon"
            className="flex h-6 w-6 items-center justify-center rounded-lg"
            width={24}
            height={24}
          />
        ) : (
          ActivityLogo && (
            <ActivityLogo className="flex h-6 w-6 items-center justify-center rounded-lg" />
          )
        )}
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
   * Extract base data and sort by date (most recent first)
   */
  const sortedActivities = useMemo(() => {
    return [...countryData.capacityBuildingActivities].sort((a, b) => {
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
  }, [countryData.capacityBuildingActivities]);

  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredChallenges, setFilteredChallenges] =
    useState<CapacityBuildingActivity[]>(sortedActivities);
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
      storeFields: ['id', 'title', 'description', 'logo', 'link', 'date', 'recurring'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Index records
    miniSearchInstance.addAll(
      sortedActivities.map((resource, index) => ({ id: index, ...resource })),
    );

    setMiniSearch(miniSearchInstance);
  }, [sortedActivities]);

  /**
   * Side effects - Search content.
   */
  useEffect(() => {
    if (!miniSearch || searchTerm.trim() === '') {
      setFilteredChallenges(sortedActivities);
    } else {
      const results = miniSearch.search(searchTerm).map((result) => result);
      // @ts-expect-error Convertion error
      setFilteredChallenges(results);
    }

    // Reset pagination on new search
    setCurrentPage(1);
  }, [searchTerm, miniSearch, sortedActivities]);

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
