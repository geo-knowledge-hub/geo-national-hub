/*
 * This file is part of GEO-Country-Profile.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-Country-Profile is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect, JSX } from 'react';

import Link from 'next/link';
import MiniSearch from 'minisearch';

import { ResourceContentItem } from '@data/db';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

/**
 * Properties expected for the ``ContentSection`` component.
 */
interface ContentSectionProps {
  title: string;
  resources: ResourceContentItem[];
}

interface ResourceCardProps {
  resource: ResourceContentItem;
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
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-6 shadow-md transition hover:shadow-lg bg-white">
      <div className="flex-1 space-y-3">
        <div className="mb-2 flex items-center space-x-2 text-sm">
          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
            Open
          </span>
          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
            {resource.uploaded}
          </span>
          <span className="rounded-full bg-gray-300 px-3 py-1 text-xs font-medium text-gray-800">
            {resource.type}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 transition hover:text-gray-700">
          <Link href={resource.link}>{resource.title}</Link>
        </h3>
        <p className="mt-1 text-sm text-gray-600">{resource.description}</p>

        <Link
          href={resource.link}
          target="_blank"
          className="mt-2 inline-block font-medium text-gray-800 transition hover:text-gray-900"
        >
          Access →
        </Link>
      </div>
      <div className={'rounded-md bg-gray-100 p-5'}>
        <Image
          src={resource.icon}
          alt={`${resource.type} icon`}
          className="flex h-6 w-6 items-center justify-center rounded-lg"
        />
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
export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  resources,
}: ContentSectionProps): JSX.Element => {
  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredResources, setFilteredResources] = useState<ResourceContentItem[]>(resources);
  const [miniSearch, setMiniSearch] = useState<MiniSearch<ResourceContentItem> | null>(null);

  /**
   * Side effects - Initialize MiniSearch
   */
  useEffect(() => {
    // Initialize MiniSearch
    const miniSearchInstance = new MiniSearch<ResourceContentItem>({
      fields: ['title', 'description', 'type', 'uploaded'],
      storeFields: ['title', 'description', 'type', 'uploaded', 'link', 'icon'],
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
        {/* Title + Search Bar */}
        <div className="relative mb-6 flex flex-wrap items-center justify-center gap-3 lg:gap-0">
          <h2 className="text-center text-2xl font-bold text-gray-900">{title}</h2>

          {/* Search Bar (Right-Aligned on Desktop, Full Width on Mobile) */}
          <div className="w-full lg:absolute lg:right-0 lg:w-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-1 pr-3 pl-10 text-sm transition-all duration-300 ease-in-out outline-none focus:border-gray-400 focus:shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mt-10 space-y-10 rounded-lg">
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
