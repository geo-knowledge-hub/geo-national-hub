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

import Link from 'next/link';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

import type { Country, FocusAreaChallenge } from '@content-types/content';
import { getIcon } from '@lib/icons';

/**
 * Properties expected for the ChallengeSection component.
 */
interface ChallengeSectionProps {
  basePath: string;
  countryData: Country;
  challenges: FocusAreaChallenge[];
}

/**
 * Properties of the ChallengeCard component.
 */
interface ChallengeCardProps {
  basePath: string;
  challenge: FocusAreaChallenge;
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
 * ChallengeCard Component
 *
 * @component
 * @param {ChallengeCardProps} params Component params.
 * @returns {JSX.Element} The rendered ChallengeCard component.
 */
function ChallengeCard({ challenge, basePath }: ChallengeCardProps): JSX.Element {
  // Define link to access resources associated to this challenge
  const linkForResources = `${basePath}/${challenge.id}/resources`;

  // Get challenge icon from registry
  const ChallengeIcon = getIcon(challenge.logo) || ExclamationCircleIcon;

  return (
    <div className="glass-card group flex items-center justify-between p-6">
      <div className="flex-1 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          <Link href={linkForResources}>{challenge.title}</Link>
        </h3>
        <p className="mt-1 text-sm text-gray-600">{challenge.description}</p>

        <Link
          href={linkForResources}
          className="mt-2 inline-block font-medium text-gray-800 transition hover:text-gray-900"
        >
          Explore resources →
        </Link>
      </div>
      <div className="rounded-md bg-gray-100 p-5 transition group-hover:bg-gray-200/80">
        <ChallengeIcon className="flex h-6 w-6 items-center justify-center rounded-lg" />
      </div>
    </div>
  );
}

/**
 * ChallengeSection Component - Displays challenge content of a specific focus area.
 *
 * @component
 * @param {ChallengeSectionProps} params Component params.
 * @returns {JSX.Element} The rendered ChallengeSection component.
 */
export function ChallengeSection({
  countryData,
  challenges,
  basePath,
}: ChallengeSectionProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Apply search filter
  const filteredChallenges = useMemo(() => {
    return filterBySearch(challenges, searchTerm, ['id', 'title', 'description']);
  }, [challenges, searchTerm]);

  // Rendering!
  return (
    <section className="mt-10 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Header & Description */}
          <div>
            <h2 className="themed-title mb-2 text-3xl font-bold">List of challenges</h2>
            <p className="mb-4 text-gray-600">
              Explore challenges in {countryData.title} and the Open EO resources tackling them.
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

        {/* Challenges List */}
        <div className="mt-2 space-y-5 rounded-lg">
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge, index) => (
              <ChallengeCard key={index} challenge={challenge} basePath={basePath} />
            ))
          ) : (
            <p className="text-center text-gray-500">No challenges found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
