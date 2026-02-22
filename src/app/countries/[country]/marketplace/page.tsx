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
import { MarketplaceLandingContent } from './content';

/**
 * Properties expected for the MarketplacePage component.
 */
interface MarketplacePageProps {
  params: Promise<{ country: string }>;
}

/**
 * MarketplacePage Component
 *
 * @component
 * @param {MarketplacePageProps} props - Component props.
 * @returns {Promise<JSX.Element>} The rendered MarketplacePage component.
 */
export default async function MarketplacePage({ params }: MarketplacePageProps) {
  // Get country from params
  const { country } = await params;

  // Fetch country data from Typesense
  const countryData = await getCountry(country);

  // If not found return user to an error page
  if (!countryData) {
    return notFound();
  }

  // If no marketplace data, 404
  if (!countryData.marketplace?.businesses || countryData.marketplace.businesses.length === 0) {
    return notFound();
  }

  return <MarketplaceLandingContent countryId={country} countryData={countryData} />;
}
