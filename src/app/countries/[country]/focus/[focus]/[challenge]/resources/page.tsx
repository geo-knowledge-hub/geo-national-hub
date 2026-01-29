/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { notFound } from 'next/navigation';
import { getCountry, getChallenge, getResourcesByCountryAndChallenge } from '@lib/typesense';
import { ResourcePageContent } from './content';

/**
 * Resource page props
 */
interface ResourcePageProps {
  params: Promise<{ country: string; focus: string; challenge: string }>;
}

/**
 * ResourcePage Component - Server component that fetches resources for a challenge
 *
 * @component
 * @param {ResourcePageProps} props - Component props.
 * @returns {Promise<JSX.Element>} The rendered ResourcePage component.
 */
export default async function ResourcePage({ params }: ResourcePageProps) {
  const { country, challenge } = await params;

  // Fetch data from Typesense
  const [countryData, challengeData, resources] = await Promise.all([
    getCountry(country),
    getChallenge(challenge),
    getResourcesByCountryAndChallenge(country, challenge),
  ]);

  // Return not found page if country or challenge is not found
  if (!countryData || !challengeData) {
    return notFound();
  }

  // Return not found page if no resources found
  if (resources.length === 0) {
    return notFound();
  }

  return (
    <ResourcePageContent
      countryData={countryData}
      challengeData={challengeData}
      resources={resources}
    />
  );
}
