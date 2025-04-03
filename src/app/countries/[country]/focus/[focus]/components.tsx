/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect, JSX } from 'react';

import Link from 'next/link';

import MiniSearch from 'minisearch';

import { Country } from '@data/content/resources';
import { GEOFocusAreaChallenge } from '@data/content/geo';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

/**
 * Properties expected for the ``ContentSection`` component.
 */
interface ContentSectionProps {
  basePath: string;
  countryData: Country;
  challenges: GEOFocusAreaChallenge[];
}

/**
 * Properties of the ``NavItem`` .
 */
interface ResourceCardProps {
  basePath: string;
  challenge: GEOFocusAreaChallenge;
}

/**
 * ResourceCard Component
 *
 * @component
 * @param {ResourceCardProps} params Component params.
 * @returns {JSX.Element} The rendered ``ResourceCard`` component.
 */
const SocioEnviromentalIssue: React.FC<ResourceCardProps> = ({
  challenge,
  basePath,
}: ResourceCardProps): JSX.Element => {
  // Define link to access resources associated to this challenge
  const linkForResources = `${basePath}/${challenge.id}/resources`;

  // Define challenge icon (in this early-stage version, we are using icons. We will change this soon)
  const ChallengeIcon = challenge.logo;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex-1 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 transition hover:text-gray-700">
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
      <div className={'rounded-md bg-gray-100 p-5'}>
        <ChallengeIcon className="flex h-6 w-6 items-center justify-center rounded-lg" />
      </div>
    </div>
  );
};

/**
 * ContentSection Component - Displays resource content of a specific topic.
 *
 * @component
 * @param {ContentSectionProps} params Component params.
 * @returns {JSX.Element} The rendered HomePage component.
 */
export const ChallengeSection: React.FC<ContentSectionProps> = ({
  countryData,
  challenges,
  basePath,
}: ContentSectionProps): JSX.Element => {
  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredChallenges, setFilteredChallenges] = useState<GEOFocusAreaChallenge[]>(challenges);
  const [miniSearch, setMiniSearch] = useState<MiniSearch<GEOFocusAreaChallenge> | null>(null);

  /**
   * Side effects - Initialize MiniSearch
   */
  useEffect(() => {
    // Initialize MiniSearch
    const miniSearchInstance = new MiniSearch<GEOFocusAreaChallenge>({
      fields: ['id', 'title', 'description'],
      storeFields: ['id', 'title', 'description', 'logo'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Index records
    miniSearchInstance.addAll(challenges.map((resource) => ({ ...resource })));

    setMiniSearch(miniSearchInstance);
  }, [challenges]);

  /**
   * Side effects - Search content.
   */
  useEffect(() => {
    if (!miniSearch || searchTerm.trim() === '') {
      setFilteredChallenges(challenges);
    } else {
      const results = miniSearch.search(searchTerm).map((result) => result);
      // @ts-expect-error Convertion error
      setFilteredChallenges(results);
    }
  }, [searchTerm, miniSearch, challenges]);

  // Rendering!
  return (
    <section className="mt-10 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Header & Description */}
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">List of challenges</h2>
            <p className="mb-4 text-gray-600">
              Explore challenges in {countryData.title} and the Open EO resources tackling them.
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
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge, index) => (
              <SocioEnviromentalIssue key={index} challenge={challenge} basePath={basePath} />
            ))
          ) : (
            <p className="text-center text-gray-500">No challenges found.</p>
          )}
        </div>
      </div>
    </section>
  );
};
