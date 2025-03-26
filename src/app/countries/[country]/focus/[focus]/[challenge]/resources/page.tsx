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

import _map from 'lodash/map';
import _head from 'lodash/head';
import _includes from 'lodash/includes';

import { HeroTopic } from '@components/global';

import { ContentSection } from './components';

import db from '@data/db';
import { Country } from '@data/content/resources';

/**
 * Resource page props
 */
interface ResourcePageProps {
  params: Promise<{ id: string; country: string; challenge: string }>;
}

/**
 * ResourcePage Component
 *
 * @component
 * @param {ResourcePageProps} props - Component props.
 * @returns {JSX.Element} The rendered HeroSearch component.
 */
const ResourcePage: React.FC<ResourcePageProps> = ({ params }: ResourcePageProps): JSX.Element => {
  /**
   * Params
   */
  // Get selected content
  const { country, challenge } = use(params);

  /**
   * Get data of the selected country
   */
  const countryData: Country = db.countries[country];

  if (!countryData) {
    return notFound();
  }

  /**
   * Get resource
   */
  const resourcesData = countryData.resources.filter((resource) => {
    // Get all challenges IDs
    const challenges = _map(resource.challenges, 'id');

    // Filter ones with the selected challenge
    return _includes(challenges, challenge);
  });

  // Return not found page if no resource is found
  if (!resourcesData) {
    return notFound();
  }

  // Get challenge metadata
  const challengeMetadata = _head(
    resourcesData[0].challenges.filter((obj) => obj.id === challenge),
  );

  // Return not found page if no challenge is found
  if (!challengeMetadata) {
    return notFound();
  }

  return (
    <div className={'mt-10'}>
      <HeroTopic
        title={`${challengeMetadata.title}`}
        description={`EO Applications in ${countryData.title}`}
        ctaLabel="Explore more content"
        ctaLink="/explore"
        ctaMessage="Interested in other countries?"
      />

      {/* Resources */}
      <ContentSection resources={resourcesData} challenge={challengeMetadata} />
    </div>
  );
};

export default ResourcePage;
