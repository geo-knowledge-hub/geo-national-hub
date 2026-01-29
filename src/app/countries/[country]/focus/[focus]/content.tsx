/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX } from 'react';
import { usePathname } from 'next/navigation';

import { HeroTopic } from '@components/global';

import type { Country, FocusArea, FocusAreaChallenge } from '@content-types/content';

import { ChallengeSection } from './components';

/**
 * Properties expected for the FocusPageContent component.
 */
interface FocusPageContentProps {
  countryId: string;
  countryData: Country;
  focusAreaData: FocusArea;
  challenges: FocusAreaChallenge[];
}

/**
 * FocusPageContent Component - Client component for focus area page
 *
 * @component
 * @param {FocusPageContentProps} props - Component props.
 * @returns {JSX.Element} The rendered FocusPageContent component.
 */
export function FocusPageContent({
  countryId,
  countryData,
  focusAreaData,
  challenges,
}: FocusPageContentProps): JSX.Element {
  // Get current path
  const pathname = usePathname();

  return (
    <div className={'mt-10'}>
      <HeroTopic
        title={`${focusAreaData.name}`}
        description={`Challenges in ${countryData.title}`}
        imageSrc={focusAreaData.logo}
        imageAlt={`${focusAreaData.name} logo`}
        imageClass="h-full w-full object-fit"
      />

      <ChallengeSection countryData={countryData} challenges={challenges} basePath={pathname} />
    </div>
  );
}
