/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState, useMemo, JSX } from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import { FeatureCard } from '@components/global';

import type { Country, FocusArea, FocusAreaChallenge, Resource } from '@content-types/content';

/**
 * Properties expected for the GEOFocusAreaSection component.
 */
interface GEOFocusAreaSectionProps {
  countryData: Country;
  focusAreas: FocusArea[];
  challenges: FocusAreaChallenge[];
  resources: Resource[];
}

/**
 * Simple search filter function
 */
function filterBySearch<T>(items: T[], searchTerm: string, fields: (keyof T)[]): T[] {
  if (!searchTerm.trim()) return items;
  const term = searchTerm.toLowerCase();
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
 * GEO Focus Area section component
 * @param {GEOFocusAreaSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of focus areas.
 */
export function GEOFocusAreaSection({
  countryData,
  focusAreas,
  challenges,
  resources,
}: GEOFocusAreaSectionProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Get unique challenge IDs from resources
  const resourceChallengeIds = useMemo(() => {
    const challengeSet = new Set<string>();
    resources.forEach((r) => r.challenges?.forEach((c) => challengeSet.add(c)));
    return challengeSet;
  }, [resources]);

  // Get unique focus area IDs from challenges that are used by resources
  const activeFocusAreaIds = useMemo(() => {
    const focusAreaSet = new Set<string>();
    challenges.forEach((challenge) => {
      if (resourceChallengeIds.has(challenge.id)) {
        challenge.tags?.forEach((tag) => focusAreaSet.add(tag));
      }
    });
    return focusAreaSet;
  }, [challenges, resourceChallengeIds]);

  // Filter focus areas to only show those with resources
  const availableFocusAreas = useMemo(() => {
    return focusAreas.filter((fa) => activeFocusAreaIds.has(fa.id));
  }, [focusAreas, activeFocusAreaIds]);

  // Apply search filter
  const filteredFocusAreas = useMemo(() => {
    return filterBySearch(availableFocusAreas, searchTerm, ['id', 'name']);
  }, [availableFocusAreas, searchTerm]);

  // Base validation - Is to show component?
  const showComponent = availableFocusAreas.length > 0;

  if (!showComponent) {
    return <></>;
  }

  // Rendering!
  return (
    <section className="mt-5 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Title + Search Bar Container */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Header & Description */}
          <div>
            <h2 className="themed-title mb-2 text-3xl font-bold">Explore</h2>
            <p className="mb-4 text-gray-600">
              Find EO solutions in {countryData.title} tackling the challenges of GEO Focus Areas
            </p>
          </div>

          {/* Search Bar aligned with header */}
          <div className="mt-4 lg:mt-0">
            <div className="relative w-full lg:w-72">
              <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input w-full py-2.5 pr-3 pl-10 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFocusAreas.length > 0 ? (
            filteredFocusAreas.map((focusArea, index) => {
              const focusAreaLink = `${countryData.id}/focus/${focusArea.id}`;

              return (
                <FeatureCard
                  key={index}
                  image={focusArea.logo}
                  imageClass={'mb-6 h-42 w-42'}
                  imageAlt={focusArea.name}
                  title={focusArea.name}
                  href={focusAreaLink}
                />
              );
            })
          ) : (
            <p className="col-span-full text-center text-gray-500">No resources found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
