/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { notFound } from 'next/navigation';
import { getCountry, getResourcesByCountry, getChallenges, getFocusAreas } from '@lib/typesense';
import { ResourcesPageContent } from './content';

/**
 * Resources page props
 */
interface ResourcesPageProps {
  params: Promise<{ country: string }>;
  searchParams?: Promise<{ focus?: string; type?: string }>;
}

/**
 * Resources page component.
 *
 * @component
 * @param {ResourcesPageProps} props - Component props.
 * @returns {Promise<JSX.Element>} The rendered ResourcesPage component.
 */
export default async function ResourcesPage({ params, searchParams }: ResourcesPageProps) {
  // Get the country
  const { country } = await params;

  // Get the search params
  const resolvedSearch = searchParams ? await searchParams : {};

  // Fetch the data
  const [countryData, resources, challenges, focusAreas] = await Promise.all([
    getCountry(country),
    getResourcesByCountry(country),
    getChallenges(),
    getFocusAreas(),
  ]);

  // If the country is not found, return not found
  if (!countryData) {
    return notFound();
  }

  // If the resources are not found, return not found
  if (resources.length === 0) {
    return notFound();
  }

  return (
    <ResourcesPageContent
      countryData={countryData}
      resources={resources}
      challenges={challenges}
      focusAreas={focusAreas}
      initialFocus={resolvedSearch.focus}
      initialType={resolvedSearch.type}
    />
  );
}
