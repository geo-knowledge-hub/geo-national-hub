/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState, useEffect, JSX } from 'react';

import MiniSearch from 'minisearch';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import imageCapacityBuildingConcept from '@public/content/concepts/capacity-building/concept.svg';
import imageCommunityOfPracticeConcept from '@public/content/concepts/community-of-practice/concept.svg';

import { FeatureCard, CallToActionCard, RepresentativesTable } from '@components/global';

import { GEOFocusArea } from '@data/content/geo';
import { Country, Partner, Mechanism, Representative } from '@data/content/resources';

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
 * Properties expected for the ``PartnersSection`` component.
 */
interface EnablingMechanismsSectionProps {
  countryData: Country;
}

/**
 * Properties expected for the ``KeyRepresentatives`` component.
 */
interface KeyRepresentativesSectionProps {
  countryData: Country;
}

/**
 * GEO Focus Area section component
 * @param {ResourcesSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of resources.
 */
export const GEOFocusAreaSection: React.FC<ResourcesSectionProps> = ({
  countryData,
}: ResourcesSectionProps): JSX.Element => {
  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredFocusAreas, setFilteredFocusAreas] = useState<GEOFocusArea[]>(
    countryData.focusAreas,
  );
  const [miniSearch, setMiniSearch] = useState<MiniSearch<GEOFocusArea> | null>(null);

  /**
   * Side effects - Initialize MiniSearch
   */
  useEffect(() => {
    const miniSearchInstance = new MiniSearch<GEOFocusArea>({
      fields: ['id', 'name'],
      storeFields: ['id', 'name', 'logo'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Index records
    miniSearchInstance.addAll(countryData.focusAreas.map((focusArea) => ({ ...focusArea })));

    setMiniSearch(miniSearchInstance);
  }, [countryData]);

  /**
   * Side effects - Search content.
   */
  useEffect(() => {
    if (!miniSearch || searchTerm.trim() === '') {
      setFilteredFocusAreas(countryData.focusAreas);
    } else {
      const results = miniSearch.search(searchTerm).map((result) => result);
      // @ts-expect-error Convertion error
      setFilteredFocusAreas(results);
    }
  }, [searchTerm, miniSearch, countryData]);

  /**
   * Base validation - Is to show component ?
   */
  const showComponent = countryData.focusAreas.length > 0;

  if (!showComponent) {
    return <></>;
  }

  // Rendering!
  return (
    <section className="mt-5 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Title + Search Bar Container */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Header & Description */}
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Explore</h2>
            <p className="mb-4 text-gray-600">
              Find solutions in {countryData.title} tackling the challenges of GEO Focus Areas
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
        <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFocusAreas.length > 0 ? (
            filteredFocusAreas.map((focusArea, index) => {
              const focusAreaLink = `${countryData.id}/focus/${focusArea.id}`;

              return (
                <FeatureCard
                  key={index}
                  image={focusArea.logo}
                  imageClass={'mb-6 h-42 w-42'}
                  imageAlt={focusArea.name}
                  title={focusArea.name}
                  href={focusAreaLink}
                />
              );
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
  // Build link
  const capacityBuildingPageLink = `${countryData.id}/capacity-building/example`;

  // Only show countries with capacity building activities
  const showCapacityBuildingBlock = countryData.capacityBuildingActivities.length > 0;

  // Rendering!
  return (
    <>
      {showCapacityBuildingBlock && (
        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Header & Description */}
              <div>
                <h2 className="mb-2 text-3xl font-bold text-gray-900">Learn</h2>
                <p className="mb-4 text-gray-600">
                  Learn more and grow with capacity building content from {countryData.title}
                </p>
              </div>
            </div>

            <div className="mt-2">
              <CallToActionCard
                title={`Capacity building in ${countryData.title}`}
                subtitle={'Learn. Engage. Create.'}
                description={`Join capacity-building activities in ${countryData.title} to learn, connect, and drive change with Earth Observation.`}
                buttonText={'Access'}
                buttonLink={capacityBuildingPageLink}
                illustration={imageCapacityBuildingConcept}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

/**
 * Community of Practice section component
 * @param {ResourcesSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of resources.
 */
export const CommunityOfPracticeSection: React.FC<CapacityBuildingSectionProps> = ({
  countryData,
}: ResourcesSectionProps): JSX.Element => {
  // Build link
  const communityOfPracticePageLink = `${countryData.id}/community-of-practice/example`;

  // Only show countries with capacity building activities
  const showCommunityOfPractice =
    countryData?.communityOfPractice && countryData.communityOfPractice.length > 0;

  // Rendering!
  return (
    <>
      {showCommunityOfPractice && (
        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Header & Description */}
              <div>
                <h2 className="mb-2 text-3xl font-bold text-gray-900">Community</h2>
                <p className="mb-4 text-gray-600">
                  Engage with experts and expand your network in {countryData.title}
                </p>
              </div>
            </div>

            <div className="mt-2">
              <CallToActionCard
                title={`Community of Practice in ${countryData.title}`}
                subtitle={'Join us'}
                description={`Collaborate with experts, tech leaders, and EO researchers. Together, we advance.`}
                buttonText={'Access'}
                buttonLink={communityOfPracticePageLink}
                illustration={imageCommunityOfPracticeConcept}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

/**
 * Enabling mechanism section component
 * @param {EnablingMechanismsSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of resources.
 */
export const EnablingMechanisms: React.FC<EnablingMechanismsSectionProps> = ({
  countryData,
}: EnablingMechanismsSectionProps): JSX.Element => {
  /**
   * States
   */
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredMechanisms, setFilteredMechanisms] = useState<Mechanism[]>(countryData.mechanisms);
  const [miniSearch, setMiniSearch] = useState<MiniSearch<Mechanism> | null>(null);

  /**
   * Side effects - Initialize MiniSearch
   */
  useEffect(() => {
    const miniSearchInstance = new MiniSearch<Mechanism>({
      fields: ['name', 'description'],
      storeFields: ['name', 'description', 'logo', 'link'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Index records
    miniSearchInstance.addAll(
      countryData.mechanisms.map((mechanism, index) => ({ id: index, ...mechanism })),
    );

    setMiniSearch(miniSearchInstance);
  }, [countryData]);

  /**
   * Side effects - Search content.
   */
  useEffect(() => {
    if (!miniSearch || searchTerm.trim() === '') {
      setFilteredMechanisms(countryData.mechanisms);
    } else {
      const results = miniSearch.search(searchTerm).map((result) => result);
      // @ts-expect-error Convertion error
      setFilteredMechanisms(results);
    }
  }, [searchTerm, miniSearch, countryData]);

  /**
   * Base validation - Is to show component ?
   */
  const showComponent = countryData.mechanisms.length > 0;

  if (!showComponent) {
    return <></>;
  }

  // Rendering!
  return (
    <>
      {showComponent && (
        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Header & Description */}
              <div>
                <h2 className="mb-2 text-3xl font-bold text-gray-900">Enabling mechanisms</h2>
                <p className="mb-4 text-gray-600">
                  Check the mechanisms supporting Open EO Data and Knowledge in {countryData.title}
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

            {/* Mechanism List */}
            <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMechanisms.length > 0 ? (
                filteredMechanisms.map((mechanism, index) => {
                  return (
                    <FeatureCard
                      key={index}
                      image={mechanism.logo}
                      imageAlt={mechanism.name}
                      title={mechanism.name}
                      href={mechanism.link}
                      external={true}
                    />
                  );
                })
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No enabling mechanisms found.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </>
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
   * Side effects - Initialize MiniSearch
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

  /**
   * Base validation - Is to show component ?
   */
  const showComponent = countryData.partners.length > 0;

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
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Partners</h2>
            <p className="mb-4 text-gray-600">
              Partners supporting EO Data and Knowledge in {countryData.title}
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

        {/* Partners Grid */}
        <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPartners.length > 0 ? (
            filteredPartners.map((partner, index) => {
              return (
                <FeatureCard
                  key={index}
                  image={partner.logo}
                  imageAlt={partner.name}
                  title={partner.name}
                  href={partner.link}
                  external={true}
                />
              );
            })
          ) : (
            <p className="col-span-full text-center text-gray-500">No partners found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

/**
 * Key representative section component
 * @param {KeyRepresentativesSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of resources.
 */
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

  /**
   * Base validation - Is to show component ?
   */
  const showComponent = countryData.representatives.length > 0;

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
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Key Representatives</h2>
            <p className="mb-4 text-gray-600">
              Meet the people facilitating activities in Ghana and feel free to reach out
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
