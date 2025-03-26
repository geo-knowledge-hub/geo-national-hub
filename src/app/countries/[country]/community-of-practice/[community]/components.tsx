/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useEffect, useState, JSX } from 'react';

import MiniSearch from 'minisearch';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import Link from 'next/link';
import Image from 'next/image';

import { Representative } from '@data/content/resources';
import { RepresentativesTable } from '@components/global';

/**
 * Properties expected for the ``ActivityCard`` component.
 */
interface ActivityCardProps {
  title: string;
  description: string;
}

/**
 * Properties expected for the ``DocumentCardProps`` component.
 */
interface DocumentCardProps {
  title: string;
  description: string;
  date: string;
  link: string;
}

/**
 * Properties expected for the ``DocumentCardProps`` component.
 */
interface EngagementBlockProps {
  title: string;
  description: string;
  buttonLabel: string;
  buttonLink: string;
  imageSrc: string;
}

/**
 * Properties expected for the ``CoPRepresenttivesSection`` component.
 */
interface CoPRepresentativesSectionProps {
  communityName: string;
  representatives: Representative[];
}

/**
 * Activity Card Component
 *
 * @component
 * @param {ActivityCardProps} params Component params.
 * @returns {JSX.Element} The rendered ``ActivityCard`` component.
 */
export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  description,
}: ActivityCardProps): JSX.Element => (
  <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg">
    <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

/**
 * Document Card Component
 *
 * @component
 * @param {DocumentCardProps} params Component params.
 * @returns {JSX.Element} The rendered ``DocumentCard`` component.
 */
export const DocumentCard = ({
  title,
  description,
  date,
  link,
}: DocumentCardProps): JSX.Element => (
  <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg">
    <div className="mb-3 flex flex-wrap gap-2">
      <span className="rounded-full bg-gray-900 px-3 py-1 text-xs text-white">Document</span>
      <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">{date}</span>
    </div>
    <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mb-4 text-sm text-gray-600">{description}</p>
    <Link
      href={link}
      className="inline-flex items-center gap-1 font-semibold text-gray-900 hover:underline"
    >
      View →
    </Link>
  </div>
);

/**
 * Engagement Block Component
 *
 * @component
 * @param {EngagementBlockProps} params Component params.
 * @returns {JSX.Element} The rendered ``EngagementBlock`` component.
 */
export const EngagementBlock = ({
  title,
  description,
  buttonLabel,
  buttonLink,
  imageSrc,
}: EngagementBlockProps): JSX.Element => (
  <div className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg">
    <Image src={imageSrc} width={50} height={50} alt={title} />
    <div>
      <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-3 text-sm text-gray-600">{description}</p>
      <a
        href={buttonLink}
        // target="_blank"
        // rel="noopener noreferrer"
        className="inline-block rounded-full bg-gray-900 px-4 py-2 text-sm text-white transition hover:bg-gray-800"
      >
        {buttonLabel}
      </a>
    </div>
  </div>
);

/**
 * CoP representative section component
 * @param {CoPRepresentativesSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of resources.
 */
export const CoPRepresentativesSection: React.FC<CoPRepresentativesSectionProps> = ({
  communityName,
  representatives,
}): JSX.Element => {
  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredRepresentatives, setFilteredRepresentatives] =
    useState<Representative[]>(representatives);
  const [miniSearch, setMiniSearch] = useState<MiniSearch<Representative> | null>(null);

  /**
   * Side effects - Initialize ``MiniSearch``
   */
  useEffect(() => {
    const miniSearchInstance = new MiniSearch<Representative>({
      fields: ['name', 'description', 'role', 'contact'],
      storeFields: ['name', 'description', 'avatar', 'role', 'contact'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Index records
    miniSearchInstance.addAll(
      representatives.map((representative, index) => ({
        id: index,
        ...representative,
      })),
    );

    setMiniSearch(miniSearchInstance);
  }, [representatives]);

  /**
   * Side effects - Search content.
   */
  useEffect(() => {
    if (!miniSearch || searchTerm.trim() === '') {
      setFilteredRepresentatives(representatives);
    } else {
      const results = miniSearch.search(searchTerm).map((result) => result);
      // @ts-expect-error Convertion error
      setFilteredRepresentatives(results);
    }
  }, [searchTerm, miniSearch, representatives]);

  /**
   * Base validation - Is to show component ?
   */
  const showComponent = representatives.length > 0;

  if (!showComponent) {
    return <></>;
  }

  // Rendering!
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Header & Description */}
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Representatives</h2>
            <p className="mb-4 text-gray-600">
              Meet the people facilitating the {communityName} activities
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

        {/* Representatives List */}
        <div className="mt-2">
          <RepresentativesTable members={filteredRepresentatives} />
        </div>
      </div>
    </section>
  );
};
