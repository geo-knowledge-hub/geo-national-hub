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

import type { FocusAreaChallenge, Resource } from '@content-types/content';
import { useGkhHealth } from '@lib/hooks/use-gkh-health';

import { ResourceCard } from './resource-card';

/**
 * Properties expected for the ContentSection component.
 */
interface ContentSectionProps {
  challenge: FocusAreaChallenge;
  resources: Resource[];
}

/**
 * Simple search filter function
 */
function filterBySearch<T>(items: T[], searchTerm: string, fields: (keyof T)[]): T[] {
  if (!searchTerm.trim()) {
    return items;
  }

  // Convert search term to lowercase
  const term = searchTerm.toLowerCase();

  // Filter items
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
 * ContentSection Component - Displays resource content of a specific topic.
 *
 * @component
 * @param {ContentSectionProps} params Component params.
 * @returns {JSX.Element} The rendered ContentSection component.
 */
export function ContentSection({ challenge, resources }: ContentSectionProps): JSX.Element {
  // State - Search term and GKH health
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { online: gkhOnline } = useGkhHealth();

  // Apply search filter
  const filteredResources = useMemo(() => {
    return filterBySearch(resources, searchTerm, ['name', 'description', 'type', 'uploaded']);
  }, [resources, searchTerm]);

  // Rendering!
  return (
    <section className="mt-10 py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Title + Search Bar Container */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Header & Description */}
          <div>
            <h2 className="themed-title mb-2 text-3xl font-bold">Resources available</h2>
            <p className="mb-4 text-gray-600">
              Discover EO solutions addressing {challenge.title} challenges.
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
                className="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm outline-none focus:border-[#526479] focus:shadow-sm focus:ring-1 focus:ring-[#526479]/20"
              />
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mt-2 space-y-5 rounded-lg">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} gkhOnline={gkhOnline} />
            ))
          ) : (
            <p className="text-center text-gray-500">No resources found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
