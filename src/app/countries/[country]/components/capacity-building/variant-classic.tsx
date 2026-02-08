/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

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
 * Displays a CTA card with an illustration linking to the full
 * capacity building page.
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
  if (!activities || activities.length === 0) return null;

  const capacityBuildingPageLink = `${countryId}/capacity-building/activities`;

  return (
    <section id="learn" className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="themed-title mb-2 text-3xl font-bold">Learn</h2>
            <p className="mb-4 text-gray-600">
              Learn more and grow with capacity building content from {countryTitle}
            </p>
          </div>
        </div>

        {showExploreLink && (
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
        )}
      </div>
    </section>
  );
}
