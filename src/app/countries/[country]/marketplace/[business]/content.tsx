/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { BackButton } from '@components/global';

import { useTheme } from '../../context/theme-context';
import type { Country, MarketplaceBusiness } from '@content-types/content';

import { BusinessHero, ApplicationGrid, ApplicationModal } from './components';

/**
 * Properties expected for the BusinessDetailContent component.
 */
interface BusinessDetailContentProps {
  countryId: string;
  countryData: Country;
  business: MarketplaceBusiness;
}

/**
 * BusinessDetailContent Component
 *
 * @component
 * @param {BusinessDetailContentProps} props - Component props.
 * @returns {JSX.Element} The rendered BusinessDetailContent component.
 */
export function BusinessDetailContent({
  countryId,
  countryData,
  business,
}: BusinessDetailContentProps): JSX.Element {
  // Hooks - get theme
  const { theme } = useTheme();

  // Hooks - navigation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Application modal state — driven by `?app=slug` query param
  // The idea is to allow users to share the link to a specific application
  const [selectedAppId, setSelectedAppId] = useState<string | null>(searchParams.get('app'));

  // Sync state with URL query param
  useEffect(() => {
    setSelectedAppId(searchParams.get('app'));
  }, [searchParams]);

  // Open application modal
  const handleSelectApp = useCallback(
    (appId: string) => {
      // Update state
      setSelectedAppId(appId);

      // Prepare URL search object
      const params = new URLSearchParams(searchParams.toString());
      params.set('app', appId);

      // Replace URL
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // Close application modal
  const handleCloseModal = useCallback(() => {
    // Update state
    setSelectedAppId(null);

    // Replace URL
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // Find the selected application
  const selectedApp = selectedAppId
    ? business.applications?.find((a) => a.id === selectedAppId) || null
    : null;

  // Render
  return (
    <div className="mp-wrapper relative -mt-24 min-h-screen pt-24">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Back button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Business hero */}
        <BusinessHero business={business} countryData={countryData} />

        {/* Applications grid */}
        <ApplicationGrid
          applications={business.applications || []}
          businessName={business.name}
          onSelectApp={handleSelectApp}
        />

        {/* Application modal */}
        <ApplicationModal
          application={selectedApp}
          businessName={business.name}
          onClose={handleCloseModal}
        />

        {/* Bottom spacing */}
        <div className="h-28" aria-hidden="true" />
      </div>
    </div>
  );
}
