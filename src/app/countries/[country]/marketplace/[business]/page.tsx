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
import { BusinessDetailContent } from './content';

/**
 * Properties expected for the BusinessDetailPage component.
 */
interface BusinessDetailPageProps {
  params: Promise<{ country: string; business: string }>;
}

/**
 * BusinessDetailPage Component
 *
 * @component
 * @param {BusinessDetailPageProps} props - Component props.
 * @returns {Promise<JSX.Element>} The rendered BusinessDetailPage component.
 */
export default async function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  const { country, business: businessSlug } = await params;

  // Fetch country data
  const countryData = await getCountry(country);

  // If not found return user to an error page
  if (!countryData) {
    return notFound();
  }

  // Find the business by slug
  const business = countryData.marketplace?.businesses?.find((b) => b.id === businessSlug);

  if (!business) {
    return notFound();
  }

  return (
    <BusinessDetailContent countryId={country} countryData={countryData} business={business} />
  );
}
