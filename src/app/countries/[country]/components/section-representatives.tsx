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

import { RepresentativesTable } from '@components/global';

import type { Country } from '@content-types/content';

/**
 * Properties expected for the KeyRepresentatives component.
 */
interface KeyRepresentativesSectionProps {
  countryData: Country;
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
 * Key representative section component
 * @param {KeyRepresentativesSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of representatives.
 */
export function KeyRepresentativesSection({
  countryData,
}: KeyRepresentativesSectionProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const representatives = countryData.representatives || [];

  // Apply search filter
  const filteredRepresentatives = useMemo(() => {
    return filterBySearch(representatives, searchTerm, ['name', 'role']);
  }, [representatives, searchTerm]);

  // Base validation - Is to show component?
  const showComponent = representatives.length > 0;

  if (!showComponent) {
    return <></>;
  }

  // Rendering!
  return (
    <section id="representatives" className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Header & Description */}
          <div>
            <h2 className="themed-title mb-2 text-3xl font-bold">Key Representatives</h2>
            <p className="mb-4 text-gray-600">
              Meet the people facilitating activities in {countryData.title} and feel free to reach
              out
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

        {/* Representatives List */}
        <div className="mt-2">
          <RepresentativesTable members={filteredRepresentatives} />
        </div>
      </div>
    </section>
  );
}
