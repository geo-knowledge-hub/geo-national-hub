/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import Image from 'next/image';

import imageCapacityBuildingConcept from '@public/content/concepts/capacity-building/concept.svg';

import { CallToActionCard } from '@components/global';

import type { CapacityBuildingActivity } from '@content-types/content';

/**
 * Properties expected for the CapacityBuildingClassic variant.
 */
interface CapacityBuildingClassicProps {
  countryId: string;
  countryTitle: string;
  activities: CapacityBuildingActivity[];
  /** Hide the CTA card link when already on the CB page. */
  showExploreLink?: boolean;
}

/**
 * Capacity Building Variant: Classic
 *
 * When used on the country overview page (`showExploreLink=true`), renders
 * a CTA card with an illustration linking to the capacity building page.
 *
 * When used on the dedicated CB page (`showExploreLink=false`), renders a
 * proper hero section with title, description, activity count, and the
 * illustration.
 *
 * @component
 * @param {CapacityBuildingClassicProps} props - Component props.
 * @returns {JSX.Element | null} The rendered variant or null if no activities.
 */
export function CapacityBuildingClassic({
  countryId,
  countryTitle,
  activities,
  showExploreLink = true,
}: CapacityBuildingClassicProps) {
  // If no activities, return null
  if (!activities || activities.length === 0) {
    return null;
  }

  const capacityBuildingPageLink = `${countryId}/capacity-building/activities`;

  if (!showExploreLink) {
    return (
      <div id="learn" className="grid items-center gap-12 md:grid-cols-[1fr_1fr] lg:gap-20">
        {/* Left column — text */}
        <div>
          <span className="themed-muted text-xs font-semibold tracking-widest uppercase">
            Learn. Engage. Create.
          </span>

          <h2 className="themed-title mt-3 text-3xl leading-tight font-bold lg:text-4xl">
            Capacity building in {countryTitle}
          </h2>

          <p className="mt-4 max-w-md text-base leading-relaxed text-gray-600">
            Join capacity-building activities in {countryTitle} to learn, connect, and drive change
            with Earth Observation.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <span className="themed-title text-5xl font-extrabold">{activities.length}</span>
            <span className="text-sm leading-snug text-gray-500">
              {activities.length === 1 ? 'activity' : 'activities'}
              <br />
              available
            </span>
          </div>
        </div>

        {/* Right column */}
        <div className="hidden md:flex md:justify-end">
          <Image
            src={imageCapacityBuildingConcept}
            alt="Capacity building"
            width={320}
            height={320}
            className="h-auto w-72 object-contain opacity-80 lg:w-80"
          />
        </div>
      </div>
    );
  }

  // Country overview page — render CTA card
  return (
    <section id="learn" className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="themed-title mb-2 text-3xl font-bold">Learn</h2>
            <p className="mb-4 text-gray-600">
              Learn more and grow with capacity building content from {countryTitle}
            </p>
          </div>
        </div>

        <div className="mt-2">
          <CallToActionCard
            title={`Capacity building in ${countryTitle}`}
            subtitle={'Learn. Engage. Create.'}
            description={`Join capacity-building activities in ${countryTitle} to learn, connect, and drive change with Earth Observation.`}
            buttonText={'Access'}
            buttonLink={capacityBuildingPageLink}
            illustration={imageCapacityBuildingConcept}
          />
        </div>
      </div>
    </section>
  );
}
