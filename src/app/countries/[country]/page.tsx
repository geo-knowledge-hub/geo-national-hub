/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { notFound } from 'next/navigation';
import { getCountry, getResourcesByCountry, getFocusAreas, getChallenges } from '@lib/typesense';
import { CountryPageContent } from './content';

/**
 * Properties expected for the CountryPage component.
 */
interface CountryPageProps {
  params: Promise<{ country: string }>;
}

/**
 * CountryPage Component - Server component that fetches country data
 *
 * @component
 * @param {CountryPageProps} props - Component props.
 * @returns {Promise<JSX.Element>} The rendered CountryPage component.
 */
export default async function CountryPage({ params }: CountryPageProps) {
  const { country } = await params;

  // Fetch country data from Typesense
  const countryData = await getCountry(country);

  // If not found return user to an error page
  if (!countryData) {
    return notFound();
  }

  // Fetch additional data needed for the page
  const [resources, focusAreas, challenges] = await Promise.all([
    getResourcesByCountry(country),
    getFocusAreas(),
    getChallenges(),
  ]);

  return (
    <CountryPageContent
      countryId={country}
      countryData={countryData}
      resources={resources}
      focusAreas={focusAreas}
      challenges={challenges}
    />
  );
}
