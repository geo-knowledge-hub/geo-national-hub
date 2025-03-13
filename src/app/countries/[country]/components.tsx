/*
 * This file is part of GEO-Country-Profile.
 * Copyright (C) 2025 GEO Knowledge Hub Developers.
 *
 * GEO-Country-Profile is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState, useEffect, JSX } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import MiniSearch from 'minisearch';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import { CapacityBuildingActivity, Country, Partner, Representative, Resource } from '@data/db';

/**
 * Properties expected for the ``ResourcesSection`` component.
 */
interface ResourcesSectionProps {
  countryData: Country;
}

/**
 * Properties expected for the ``CapacityBuilding`` component.
 */
interface CapacityBuildingSectionProps {
  countryData: Country;
}

/**
 * Properties expected for the ``PartnersSection`` component.
 */
interface PartnersSectionProps {
  countryData: Country;
}

/**
 * Properties expected for the ``KeyRepresentatives`` component.
 */
interface KeyRepresentativesSectionProps {
  countryData: Country;
}

/**
 * Resources section component
 * @param {ResourcesSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of resources.
 */
export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  countryData,
}: ResourcesSectionProps): JSX.Element => {
  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredResources, setFilteredResources] = useState<Resource[]>(countryData.resources);
  const [miniSearch, setMiniSearch] = useState<MiniSearch<Resource> | null>(null);

  /**
   * Side effects - Initialize MiniSearch
   */
  useEffect(() => {
    const miniSearchInstance = new MiniSearch<Resource>({
      fields: ['title', 'description'],
      storeFields: ['title', 'description', 'link'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Index records
    miniSearchInstance.addAll(
      countryData.resources.map((resource, index) => ({ id: index, ...resource })),
    );

    setMiniSearch(miniSearchInstance);
  }, [countryData]);

  /**
   * Side effects - Search content.
   */
  useEffect(() => {
    if (!miniSearch || searchTerm.trim() === '') {
      setFilteredResources(countryData.resources);
    } else {
      const results = miniSearch.search(searchTerm).map((result) => result);
      // @ts-expect-error Convertion error
      setFilteredResources(results);
    }
  }, [searchTerm, miniSearch, countryData]);

  // Rendering!
  return (
    <section className="px-4 py-12 mt-5">
      <div className="mx-auto max-w-7xl">
        {/* Title + Search Bar Container */}
        <div className="relative mb-6 flex flex-wrap items-center justify-center gap-3 lg:gap-0">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Socio-environmental issues
          </h2>

          {/* Search Bar (Right-Aligned) */}
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
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, index) => {
              const resourceLink = resource.link !== "#" ? `${countryData.id}/resources/${resource.link}` : "#";

              return (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg"
                >
                  <h5 className="mb-2 text-xl font-semibold text-gray-900">{resource.title}</h5>
                  <p className="text-gray-600">{resource.description}</p>
                  <Link
                    href={resourceLink}
                    className="mt-4 inline-flex items-center font-medium text-gray-600 transition hover:text-gray-800"
                  >
                    View Resources →
                  </Link>
                </div>
              )
            })
          ) : (
            <p className="col-span-full text-center text-gray-500">No resources found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

/**
 * Capacity building section component
 * @param {ResourcesSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of resources.
 */
export const CapacityBuildingSection: React.FC<CapacityBuildingSectionProps> = ({
  countryData,
}: ResourcesSectionProps): JSX.Element => {
  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredActivities, setFilteredActivities] = useState<CapacityBuildingActivity[]>(
    countryData.capacityBuildingActivities,
  );
  const [miniSearch, setMiniSearch] = useState<MiniSearch<CapacityBuildingActivity> | null>(null);

  /**
   * Side effects - Initialize MiniSearch
   */
  useEffect(() => {
    const miniSearchInstance = new MiniSearch<CapacityBuildingActivity>({
      fields: ['title', 'description'],
      storeFields: ['title', 'description', 'link'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Index records
    miniSearchInstance.addAll(
      countryData.capacityBuildingActivities.map((activity, index) => ({ id: index, ...activity })),
    );

    setMiniSearch(miniSearchInstance);
  }, [countryData]);

  /**
   * Side effects - Search content.
   */
  useEffect(() => {
    if (!miniSearch || searchTerm.trim() === '') {
      setFilteredActivities(countryData.capacityBuildingActivities);
    } else {
      const results = miniSearch.search(searchTerm).map((result) => result);
      // @ts-expect-error Convertion error
      setFilteredActivities(results);
    }
  }, [searchTerm, miniSearch, countryData]);

  // Rendering!
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Title + Search Bar Container */}
        <div className="relative mb-6 flex flex-wrap items-center justify-center gap-3 lg:gap-0">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Capacity Building activities
          </h2>

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

        {/* Capacity Building Activities Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg"
              >
                <h5 className="mb-2 text-xl font-semibold text-gray-900">{activity.title}</h5>
                <p className="text-gray-600">{activity.description}</p>
                <Link
                  href={activity.link}
                  className="mt-4 inline-flex items-center font-medium text-gray-600 transition hover:text-gray-800"
                >
                  Access →
                </Link>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No Capacity Building activities found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

/**
 * Partners section component
 * @param {ResourcesSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of resources.
 */
export const PartnersSection: React.FC<PartnersSectionProps> = ({
  countryData,
}: ResourcesSectionProps): JSX.Element => {
  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>(countryData.partners);
  const [miniSearch, setMiniSearch] = useState<MiniSearch<Partner> | null>(null);

  /**
   * Side effects - Initialize ``MiniSearch``
   */
  useEffect(() => {
    const miniSearchInstance = new MiniSearch<Partner>({
      fields: ['name', 'description'],
      storeFields: ['name', 'description', 'logo'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Index records
    miniSearchInstance.addAll(
      countryData.partners.map((partner, index) => ({ id: index, ...partner })),
    );

    setMiniSearch(miniSearchInstance);
  }, [countryData]);

  /**
   * Side effects - Search content.
   */
  useEffect(() => {
    if (!miniSearch || searchTerm.trim() === '') {
      setFilteredPartners(countryData.partners);
    } else {
      const results = miniSearch.search(searchTerm).map((result) => result);
      // @ts-expect-error Convertion error
      setFilteredPartners(results);
    }
  }, [searchTerm, miniSearch, countryData]);

  // Rendering!
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Title + Search Bar Container */}
        <div className="relative mb-6 flex flex-wrap items-center justify-center gap-3 lg:gap-0">
          <h2 className="text-center text-2xl font-bold text-gray-900">GEO Partners</h2>

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

        {/* Partners List */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPartners.length > 0 ? (
            filteredPartners.map((partner, index) => (
              <div key={index} className="flex items-center rounded-lg bg-white p-4 shadow-md">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  className="mr-4 h-16 w-16 object-contain"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                  <p className="text-sm text-gray-600">{partner.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No partners found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export const KeyRepresentativesSection: React.FC<KeyRepresentativesSectionProps> = ({
  countryData,
}) => {
  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredRepresentatives, setFilteredRepresentatives] = useState<Representative[]>(
    countryData.representatives,
  );
  const [miniSearch, setMiniSearch] = useState<MiniSearch<Representative> | null>(null);

  /**
   * Side effects - Initialize ``MiniSearch``
   */
  useEffect(() => {
    const miniSearchInstance = new MiniSearch<Representative>({
      fields: ['name', 'description'],
      storeFields: ['name', 'description', 'logo'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Index records
    miniSearchInstance.addAll(
      countryData.representatives.map((representative, index) => ({
        id: index,
        ...representative,
      })),
    );

    setMiniSearch(miniSearchInstance);
  }, [countryData]);

  /**
   * Side effects - Search content.
   */
  useEffect(() => {
    if (!miniSearch || searchTerm.trim() === '') {
      setFilteredRepresentatives(countryData.representatives);
    } else {
      const results = miniSearch.search(searchTerm).map((result) => result);
      // @ts-expect-error Convertion error
      setFilteredRepresentatives(results);
    }
  }, [searchTerm, miniSearch, countryData]);

  // Rendering!
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Title + Search Bar Container */}
        <div className="relative mb-6 flex flex-wrap items-center justify-center gap-3 lg:gap-0">
          <h2 className="text-center text-2xl font-bold text-gray-900">Key Representatives</h2>

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

        {/* Representatives Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRepresentatives.length > 0 ? (
            filteredRepresentatives.map((representative, index) => (
              <div key={index} className="flex items-center rounded-lg bg-white p-5 shadow-md">
                <Image
                  src={representative.logo}
                  alt={representative.name}
                  className="mr-4 h-10 w-10"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{representative.name}</h3>
                  <p className="text-sm text-gray-600">
                    <a href={'mailto:' + representative.email}>{representative.email}</a>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No representatives found.</p>
          )}
        </div>
      </div>
    </section>
  );
};
