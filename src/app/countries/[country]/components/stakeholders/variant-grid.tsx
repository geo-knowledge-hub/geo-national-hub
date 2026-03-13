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

import { Button } from '@ui/button';

import { FeatureCard } from '@components/global';

import { filterBySearch } from '@lib/search/utils';
import type { Partner } from '@content-types/content';

/**
 * Properties expected for the StakeholdersGrid variant.
 */
interface StakeholdersGridProps {
  partners: Partner[];
  countryTitle: string;
}

const ITEMS_PER_PAGE = 6;

/**
 * Stakeholders Variant: Grid
 *
 * @component
 */
export function StakeholdersGrid({ partners, countryTitle }: StakeholdersGridProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    setCurrentPage(1);
    return filterBySearch(partners, searchTerm, ['name', 'description']);
  }, [partners, searchTerm]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <section id="stakeholders" className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="themed-title mb-2 text-3xl font-bold">Stakeholders</h2>
            <p className="mb-4 text-gray-600">
              Organizations supporting EO data and knowledge in {countryTitle}
            </p>
          </div>

          {/* Search */}
          <div className="mt-4 lg:mt-0">
            <div className="relative w-full lg:w-72">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
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

        {/* Grid */}
        <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.length > 0 ? (
            paginated.map((partner, i) => (
              <FeatureCard
                key={i}
                image={partner.logo}
                imageAlt={partner.name}
                title={partner.name}
                href={partner.link && partner.link !== '#' ? partner.link : undefined}
                external={true}
              />
            ))
          ) : (
            <p className="col-span-full py-12 text-center text-sm text-gray-400">
              No stakeholders found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}
