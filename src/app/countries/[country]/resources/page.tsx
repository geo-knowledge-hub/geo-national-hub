/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { notFound } from 'next/navigation';
import { getCountry, getChallenges, getFocusAreas } from '@lib/typesense';
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
 */
export default async function ResourcesPage({ params, searchParams }: ResourcesPageProps) {
  const { country } = await params;
  const resolvedSearch = searchParams ? await searchParams : {};

  const [countryData, challenges, focusAreas] = await Promise.all([
    getCountry(country),
    getChallenges(),
    getFocusAreas(),
  ]);

  if (!countryData) {
    return notFound();
  }

  return (
    <ResourcesPageContent
      countryId={country}
      countryData={countryData}
      challenges={challenges}
      focusAreas={focusAreas}
      initialFocus={resolvedSearch.focus}
      initialType={resolvedSearch.type}
    />
  );
}
