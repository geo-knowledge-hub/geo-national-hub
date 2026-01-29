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

import { HeroTopic } from '@components/global';

import type { Country, FocusAreaChallenge, Resource } from '@content-types/content';

import { ContentSection } from './components';

/**
 * Resource page content props
 */
interface ResourcePageContentProps {
  countryData: Country;
  challengeData: FocusAreaChallenge;
  resources: Resource[];
}

/**
 * ResourcePageContent Component - Client component for resource page
 *
 * @component
 * @param {ResourcePageContentProps} props - Component props.
 * @returns {JSX.Element} The rendered ResourcePageContent component.
 */
export function ResourcePageContent({
  countryData,
  challengeData,
  resources,
}: ResourcePageContentProps): JSX.Element {
  return (
    <div className={'mt-10'}>
      <HeroTopic
        title={`${challengeData.title}`}
        description={`EO Applications in ${countryData.title}`}
        ctaLabel="Explore more content"
        ctaLink="/explore"
        ctaMessage="Interested in other countries?"
      />

      {/* Resources */}
      <ContentSection resources={resources} challenge={challengeData} />
    </div>
  );
}
