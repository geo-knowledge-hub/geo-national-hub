/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, useState, useMemo, useCallback } from 'react';

import { Search } from 'lucide-react';

import type { Country } from '@content-types/content';

import { useTheme } from '../context/theme-context';
import { MarketplaceHero, FeaturedBanner, BusinessGrid, FocusAreaPills } from './components';

/**
 * Properties expected for the MarketplaceLandingContent component.
 */
interface MarketplaceLandingContentProps {
  countryId: string;
  countryData: Country;
}

/**
 * MarketplaceLandingContent Component
 *
 * @component
 * @param {MarketplaceLandingContentProps} props - Component props.
 * @returns {JSX.Element} The rendered MarketplaceLandingContent component.
 */
export function MarketplaceLandingContent({
  countryId,
  countryData,
}: MarketplaceLandingContentProps): JSX.Element {
  // Get theme
  const { theme } = useTheme();

  // Get marketplace data
  const marketplace = countryData.marketplace;
  const businesses = marketplace?.businesses || [];
  const config = marketplace?.config;

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);

  // Collect all unique focus areas from businesses
  const allFocusAreas = useMemo(() => {
    // Define areas set
    const areas = new Set<string>();

    // Add areas from businesses
    businesses.forEach((b) => b.focus_areas?.forEach((a) => areas.add(a)));

    // Return sorted array
    return Array.from(areas).sort();
  }, [businesses]);

  // Toggle a focus area in the selection
  const handleToggleFocusArea = useCallback((area: string) => {
    // Enable / disbable focus area filter
    setSelectedFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }, []);

  // Filter businesses by search term and selected focus areas
  const filteredBusinesses = useMemo(() => {
    let result = businesses;

    // Filter by search term (searches business names, taglines, and application titles)
    if (searchTerm.trim()) {
      // Get search term
      const term = searchTerm.toLowerCase();

      // Filter businesses
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(term) ||
          b.tagline.toLowerCase().includes(term) ||
          b.applications?.some((app) => app.title.toLowerCase().includes(term)),
      );
    }

    // Filter by selected focus areas
    if (selectedFocusAreas.length > 0) {
      // Filter businesses
      result = result.filter((b) =>
        b.focus_areas?.some((area) => selectedFocusAreas.includes(area)),
      );
    }

    return result;
  }, [businesses, searchTerm, selectedFocusAreas]);

  // Find featured business
  const featuredBusiness = useMemo(() => {
    if (!config?.featured_business) {
      return null;
    }

    // Find featured business
    return businesses.find((b) => b.id === config.featured_business) || null;
  }, [businesses, config?.featured_business]);

  // Compute total app count for hero stats
  const totalAppCount = useMemo(
    () => businesses.reduce((sum, b) => sum + (b.applications?.length || 0), 0),
    [businesses],
  );

  return (
    <div className="mp-wrapper relative -mt-24 min-h-screen pt-24">
      {/* Hero */}
      <MarketplaceHero
        countryTitle={countryData.title}
        introText={config?.intro_text}
        primaryColor={theme.primary_color}
        businessCount={businesses.length}
        appCount={totalAppCount}
        focusAreaCount={allFocusAreas.length}
      />

      {/* Content section */}
      <div id="mp-content" className="mx-auto max-w-7xl px-6 pt-10">
        {/* Featured business banner */}
        {featuredBusiness && (
          <div className="mb-10">
            <FeaturedBanner business={featuredBusiness} countryId={countryId} />
          </div>
        )}

        {/* Search & filter toolbar */}
        <div className="mb-8">
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search businesses or applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full py-2.5 pr-4 pl-10 text-sm outline-none"
            />
          </div>

          {allFocusAreas.length > 0 && (
            <div className="mt-3">
              <FocusAreaPills
                focusAreas={allFocusAreas}
                selected={selectedFocusAreas}
                onToggle={handleToggleFocusArea}
              />
            </div>
          )}
        </div>

        {/* Business grid */}
        <BusinessGrid
          businesses={filteredBusinesses}
          countryId={countryId}
          totalCount={businesses.length}
        />

        {/* Bottom spacing */}
        <div className="h-28" aria-hidden="true" />
      </div>
    </div>
  );
}
