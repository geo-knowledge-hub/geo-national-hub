/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, use } from 'react';

import { notFound } from 'next/navigation';
import { usePathname } from 'next/navigation';

import _map from 'lodash/map';
import _includes from 'lodash/includes';

import { HeroTopic } from '@components/global';

import db from '@data/db';
import { FocusAreas } from '@data/content/geo';

import { ChallengeSection } from './components';

/**
 * Properties expected for the ``CountryPage`` component.
 */
interface CountryPageProps {
  params: Promise<{ country: string; focus: string }>;
}

/**
 * CountryPage Component
 *
 * @component
 * @param {CountryPageProps} props - Component props.
 * @returns {JSX.Element} The rendered HeroSearch component.
 */
const CountryPage: React.FC<CountryPageProps> = ({ params }: CountryPageProps): JSX.Element => {
  // Get current path
  const pathname = usePathname();

  // Get selected content
  const { focus, country } = use(params);

  // Get ``country`` and ``focus area`` data
  const countryData = db.countries[country];
  const focusAreaData = Object.values(FocusAreas).filter((x) => x.id === focus);

  // If not found return user to an error page
  if (!countryData || !focusAreaData) {
    return notFound();
  }

  // Get ``focus areas`` metadata
  const focusAreasMetadata = focusAreaData[0];

  // Get focus areas challenges
  const focusAreasChallenges = countryData.challenges.filter((challenge) => {
    // Get all focus areas from the challenge
    const challengeFocusAreas = _map(challenge.tags, 'id');

    // Check if the current focus area is in the challenge
    return _includes(challengeFocusAreas, focus);
  });

  return (
    <div className={'mt-10'}>
      <HeroTopic
        title={`${focusAreasMetadata.name}`}
        description={`Challenges in ${countryData.title}`}
        imageSrc={focusAreasMetadata.logo}
        imageAlt={`${focusAreasMetadata.name} logo`}
        imageClass="h-full w-full object-fit"
      />

      <ChallengeSection
        countryData={countryData}
        challenges={focusAreasChallenges}
        basePath={pathname}
      />
    </div>
  );
};

export default CountryPage;
