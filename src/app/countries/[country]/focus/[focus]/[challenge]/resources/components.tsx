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
import Image from 'next/image';

import MiniSearch from 'minisearch';

import { GEOFocusAreaChallenge } from '@data/content/geo';
import { Resource } from '@data/content/resources';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import { ResourceMetadataModal } from '@components/global';

/**
 * Properties expected for the ``ContentSection`` component.
 */
interface ContentSectionProps {
  challenge: GEOFocusAreaChallenge;
  resources: Resource[];
}

/**
 * Properties of the ``ResourceCardProps`` component.
 */
interface ResourceCardProps {
  resource: Resource;
}

/**
 * ResourceCard Component
 *
 * @component
 * @param {ResourceCardProps} params Component params.
 * @returns {JSX.Element} The rendered ``ResourceCard`` component.
 */
const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
}: ResourceCardProps): JSX.Element => {
  /**
   * State to manage the metadata modal.
   */
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="flex-1 space-y-3">
          <div className="mb-2 flex items-center space-x-2 text-sm">
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
              Open
            </span>
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
              {resource.uploaded}
            </span>
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
              {resource.type}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 transition hover:text-gray-700">
            <Link href={resource.link}>{resource.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-gray-600">{resource.description}</p>

          <div className="mt-4 flex items-center gap-4">
            {resource.overview && (
              <button
                onClick={() => setIsOpen(true)}
                className="cursor-pointer text-sm font-medium text-gray-700 transition hover:text-blue-600 focus:outline-none"
              >
                Overview
              </button>
            )}
            <Link
              href={resource.link}
              target="_blank"
              className="text-sm font-medium text-gray-700 transition hover:text-blue-600 focus:outline-none"
            >
              Access →
            </Link>
          </div>
        </div>
        <div className={'rounded-md bg-gray-100 p-5'}>
          <Image
            src={resource.icon}
            alt="Resource icon"
            className="flex h-6 w-6 items-center justify-center rounded-lg"
          />
        </div>
      </div>

      <ResourceMetadataModal open={isOpen} onClose={() => setIsOpen(false)} data={resource} />
    </>
  );
};

/**
 * ContentSection Component - Displays resource content of a specific topic.
 *
 * @component
 * @param {ContentSectionProps} params Component params.
 * @returns {JSX.Element} The rendered HomePage component.
 */
export const ContentSection: React.FC<ContentSectionProps> = ({
  challenge,
  resources,
}: ContentSectionProps): JSX.Element => {
  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources);
  const [miniSearch, setMiniSearch] = useState<MiniSearch<Resource> | null>(null);

  /**
   * Side effects - Initialize MiniSearch
   */
  useEffect(() => {
    // Initialize MiniSearch
    const miniSearchInstance = new MiniSearch<Resource>({
      fields: ['name', 'description', 'type', 'uploaded'],
      storeFields: [
        'name',
        'description',
        'type',
        'uploaded',
        'link',
        'icon',
        'license',
        'overview',
        'contributors',
        'subjects',
        'geoGWP',
        'targetAudiences',
      ],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Index records
    miniSearchInstance.addAll(resources.map((resource, index) => ({ id: index, ...resource })));

    setMiniSearch(miniSearchInstance);
  }, [resources]);

  /**
   * Side effects - Search content.
   */
  useEffect(() => {
    if (!miniSearch || searchTerm.trim() === '') {
      setFilteredResources(resources);
    } else {
      const results = miniSearch.search(searchTerm).map((result) => result);
      // @ts-expect-error Convertion error
      setFilteredResources(results);
    }
  }, [searchTerm, miniSearch, resources]);

  // Rendering!
  return (
    <section className="mt-10 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Title + Search Bar Container */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Header & Description */}
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Resources available</h2>
            <p className="mb-4 text-gray-600">
              Discover resources addressing {challenge.title} challenges.
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

        {/* Resources Grid */}
        <div className="mt-2 space-y-5 rounded-lg">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))
          ) : (
            <p className="text-center text-gray-500">No resources found.</p>
          )}
        </div>
      </div>
    </section>
  );
};
