/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, useState, useMemo } from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import type { MarketplaceApplication } from '@content-types/content';

import { ApplicationCard } from './application-card';

/**
 * Properties expected for the ApplicationGrid component.
 */
interface ApplicationGridProps {
  /** List of applications */
  applications: MarketplaceApplication[];
  /** Business name for display */
  businessName: string;
  /** Callback when an application card is clicked */
  onSelectApp: (appId: string) => void;
}

/**
 * ApplicationGrid Component - Grid of application cards with local search
 *
 * @component
 * @param {ApplicationGridProps} props - Component props.
 * @returns {JSX.Element} The rendered ApplicationGrid component.
 */
export function ApplicationGrid({
  applications,
  businessName,
  onSelectApp,
}: ApplicationGridProps): JSX.Element {
  // State - search term
  const [searchTerm, setSearchTerm] = useState('');

  // Filter applications by search
  const filteredApps = useMemo(() => {
    // If no search term, return all applications
    // default GKH behavior
    if (!searchTerm.trim()) {
      return applications;
    }

    // Otherwise, filter applications by search term
    const term = searchTerm.toLowerCase();
    return applications.filter(
      (app) =>
        app.title.toLowerCase().includes(term) || app.description.toLowerCase().includes(term),
    );
  }, [applications, searchTerm]);

  // If no applications, return empty
  if (applications.length === 0) {
    return <></>;
  }

  return (
    <section className="mt-10">
      {/* Header */}
      <div>
        <h2 className="themed-title text-2xl font-bold">Applications</h2>
        <p className="mt-1 text-sm text-gray-500">
          EO tools and platforms offered by {businessName}
        </p>
      </div>

      {/* Search */}
      <div className="relative mt-4 w-full">
        <MagnifyingGlassIcon className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glass-input w-full py-2.5 pr-4 pl-10 text-sm outline-none"
        />
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <ApplicationCard key={app.id} application={app} onClick={() => onSelectApp(app.id)} />
          ))
        ) : (
          <p className="col-span-full py-8 text-center text-gray-500">
            No matches for &ldquo;{searchTerm}&rdquo; — try different keywords
          </p>
        )}
      </div>
    </section>
  );
}
