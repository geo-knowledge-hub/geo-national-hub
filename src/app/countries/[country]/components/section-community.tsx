/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';

import { CallToActionCard } from '@components/global';

import type { Country } from '@content-types/content';

/**
 * Properties expected for the CommunityOfPracticeSection component.
 */
interface CommunityOfPracticeSectionProps {
  countryData: Country;
}

/**
 * Community of Practice section component
 * @param {CommunityOfPracticeSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the community of practice section.
 */
export function CommunityOfPracticeSection({
  countryData,
}: CommunityOfPracticeSectionProps): JSX.Element {
  // Get community of practice data
  const communityOfPracticeData = countryData?.community_of_practice;

  // Only show countries with community of practice
  const showCommunityOfPractice = communityOfPracticeData != null;

  // Rendering!
  return (
    <>
      {showCommunityOfPractice && communityOfPracticeData && (
        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Header & Description */}
              <div>
                <h2 className="themed-title mb-2 text-3xl font-bold">Community</h2>
                <p className="mb-4 text-gray-600">
                  Engage with experts and expand your network in {countryData.title}
                </p>
              </div>
            </div>

            <div className="mt-2">
              <CallToActionCard
                title={communityOfPracticeData.name}
                subtitle={'Join us'}
                description={communityOfPracticeData.description}
                buttonText={'Access'}
                buttonLink={communityOfPracticeData.link}
                buttonLinkTarget={'_blank'}
                illustration={communityOfPracticeData.logo}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
