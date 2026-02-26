/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState, useMemo, JSX } from 'react';

import { Search } from 'lucide-react';

import { FeatureCard } from '@components/global';

import type { Country } from '@content-types/content';

/**
 * Properties expected for the EnablingMechanismsSection component.
 */
interface EnablingMechanismsSectionProps {
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
 * Enabling mechanism section component
 * @param {EnablingMechanismsSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of mechanisms.
 */
export function EnablingMechanisms({ countryData }: EnablingMechanismsSectionProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const mechanisms = countryData.mechanisms || [];

  // Apply search filter
  const filteredMechanisms = useMemo(() => {
    return filterBySearch(mechanisms, searchTerm, ['name', 'description']);
  }, [mechanisms, searchTerm]);

  // Base validation - Is to show component?
  const showComponent = mechanisms.length > 0;

  if (!showComponent) {
    return <></>;
  }

  // Rendering!
  return (
    <>
      {showComponent && (
        <section id="mechanisms" className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Header */}
              <div>
                <h2 className="themed-title mb-2 text-3xl font-bold">Enabling mechanisms</h2>
                <p className="mb-4 text-gray-600">
                  Check the mechanisms supporting Open EO Data and Knowledge in {countryData.title}
                </p>
              </div>

              {/* Search bar */}
              <div className="mt-4 lg:mt-0">
                <div className="relative w-full lg:w-72">
                  <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
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

            {/* List */}
            <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMechanisms.length > 0 ? (
                filteredMechanisms.map((mechanism, index) => {
                  return (
                    <FeatureCard
                      key={index}
                      image={mechanism.logo}
                      imageAlt={mechanism.name}
                      title={mechanism.name}
                      href={mechanism.link}
                      external={true}
                    />
                  );
                })
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No enabling mechanisms found.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
