/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { notFound } from 'next/navigation';
import {
  getCountry,
  getFocusArea,
  getChallengesByFocusArea,
  getResourcesByCountry,
} from '@lib/typesense';
import { FocusPageContent } from './content';

/**
 * Properties expected for the FocusPage component.
 */
interface FocusPageProps {
  params: Promise<{ country: string; focus: string }>;
}

/**
 * FocusPage Component - Server component that fetches focus area data
 *
 * @component
 * @param {FocusPageProps} props - Component props.
 * @returns {Promise<JSX.Element>} The rendered FocusPage component.
 */
export default async function FocusPage({ params }: FocusPageProps) {
  const { country, focus } = await params;

  // Fetch data from Typesense
  const [countryData, focusAreaData, allChallenges, resources] = await Promise.all([
    getCountry(country),
    getFocusArea(focus),
    getChallengesByFocusArea(focus),
    getResourcesByCountry(country),
  ]);

  // If not found return user to an error page
  if (!countryData || !focusAreaData) {
    return notFound();
  }

  // Get challenge IDs that have resources for this country
  const resourceChallengeIds = new Set<string>();
  resources.forEach((r) => r.challenges?.forEach((c) => resourceChallengeIds.add(c)));

  // Filter challenges to only show those with resources
  const challengesWithResources = allChallenges.filter((c) => resourceChallengeIds.has(c.id));

  return (
    <FocusPageContent
      countryId={country}
      countryData={countryData}
      focusAreaData={focusAreaData}
      challenges={challengesWithResources}
    />
  );
}
