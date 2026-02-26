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
 * Properties expected for the PartnersSection component.
 */
interface PartnersSectionProps {
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
 * Partners section component
 * @param {PartnersSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of partners.
 */
export function PartnersSection({ countryData }: PartnersSectionProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const partners = countryData.partners || [];

  // Apply search filter
  const filteredPartners = useMemo(() => {
    const filtered = filterBySearch(partners, searchTerm, ['name', 'description']);

    // Reset pagination when search changes
    return filtered;
  }, [partners, searchTerm]);

  // Reset pagination when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const showComponent = partners.length > 0;
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);

  const paginatedPartners = filteredPartners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (!showComponent) return <></>;

  return (
    <section id="stakeholders" className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="themed-title mb-2 text-3xl font-bold">Stakeholders</h2>
            <p className="mb-4 text-gray-600">
              Stakeholders supporting EO Data and Knowledge in {countryData.title}
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="relative w-full lg:w-72">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="glass-input w-full py-2.5 pr-3 pl-10 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedPartners.length > 0 ? (
            paginatedPartners.map((partner, index) => (
              <FeatureCard
                key={index}
                image={partner.logo}
                imageAlt={partner.name}
                imageClass="mb-6 h-32 w-32"
                title={partner.name}
                href={partner.link}
                external={true}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No stakeholders found.</p>
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
