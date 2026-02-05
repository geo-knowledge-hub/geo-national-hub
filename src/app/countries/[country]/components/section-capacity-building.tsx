/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';

import imageCapacityBuildingConcept from '@public/content/concepts/capacity-building/concept.svg';

import { CallToActionCard } from '@components/global';

import type { Country } from '@content-types/content';

/**
 * Properties expected for the CapacityBuilding component.
 */
interface CapacityBuildingSectionProps {
  countryData: Country;
}

/**
 * Capacity building section component
 * @param {CapacityBuildingSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the capacity building section.
 */
export function CapacityBuildingSection({
  countryData,
}: CapacityBuildingSectionProps): JSX.Element {
  // Build link
  const capacityBuildingPageLink = `${countryData.id}/capacity-building/activities`;

  // Only show countries with capacity building activities
  const showCapacityBuildingBlock =
    countryData.capacity_building_activities && countryData.capacity_building_activities.length > 0;

  // Rendering!
  return (
    <>
      {showCapacityBuildingBlock && (
        <section id="learn" className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Header & Description */}
              <div>
                <h2 className="themed-title mb-2 text-3xl font-bold">Learn</h2>
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
}
