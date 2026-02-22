/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX } from 'react';

import type { MarketplaceBusiness } from '@content-types/content';

import { BusinessCard } from './business-card';

/**
 * Properties expected for the BusinessGrid component.
 */
interface BusinessGridProps {
  /** Filtered list of businesses to display */
  businesses: MarketplaceBusiness[];
  /** Country ID for building links */
  countryId: string;
  /** Total unfiltered count */
  totalCount: number;
}

/**
 * BusinessGrid Component
 *
 * @component
 * @param {BusinessGridProps} props - Component props.
 * @returns {JSX.Element} The rendered BusinessGrid component.
 */
export function BusinessGrid({
  businesses,
  countryId,
  totalCount,
}: BusinessGridProps): JSX.Element {
  // If no businesses, show message
  if (businesses.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-gray-500">No businesses match your search</p>
        <p className="mt-2 text-sm text-gray-400">Try different keywords or clear your filters</p>
      </div>
    );
  }

  // Otherwise, show list of businesses
  return (
    <div>
      {/* Grid header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{businesses.length}</span>
          {businesses.length !== totalCount && <span> of {totalCount}</span>}{' '}
          {businesses.length === 1 ? 'business' : 'businesses'}
        </p>
      </div>

      {/* Business cards grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} countryId={countryId} />
        ))}
      </div>
    </div>
  );
}
