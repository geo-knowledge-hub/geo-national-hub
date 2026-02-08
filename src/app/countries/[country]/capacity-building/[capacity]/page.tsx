/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { notFound } from 'next/navigation';
import { getCountry } from '@lib/typesense';
import { CapacityBuildingPageContent } from './content';

/**
 * Properties expected for the CapacityBuildingPage component.
 */
interface CapacityBuildingPageProps {
  params: Promise<{ country: string }>;
}

/**
 * CapacityBuildingPage Component - Server component that fetches country data
 *
 * @component
 * @param {CapacityBuildingPageProps} props - Component props.
 * @returns {Promise<JSX.Element>} The rendered CapacityBuildingPage component.
 */
export default async function CapacityBuildingPage({ params }: CapacityBuildingPageProps) {
  const { country } = await params;

  // Fetch country data from Typesense
  const countryData = await getCountry(country);

  // If not found return user to an error page
  if (!countryData) {
    return notFound();
  }

  return <CapacityBuildingPageContent countryData={countryData} />;
}
