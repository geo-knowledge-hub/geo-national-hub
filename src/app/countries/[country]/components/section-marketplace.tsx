/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';

import Link from 'next/link';
import { ArrowRight, Store, Box } from 'lucide-react';

import type { Country } from '@content-types/content';

/**
 * Properties expected for the MarketplaceSection component.
 */
interface MarketplaceSectionProps {
  countryId: string;
  countryData: Country;
}

/**
 * MarketplaceSection Component
 *
 * @component
 * @param {MarketplaceSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the marketplace teaser.
 */
export function MarketplaceSection({
  countryId,
  countryData,
}: MarketplaceSectionProps): JSX.Element {
  // Get marketplace data
  const marketplace = countryData.marketplace;

  // If country has no businesses, return empty section
  if (!marketplace?.businesses || marketplace.businesses.length === 0) {
    return <></>;
  }

  // Render!
  return (
    <section id="marketplace" className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden rounded-2xl shadow-lg"
          style={{ background: 'color-mix(in srgb, var(--theme-primary, #526479) 80%, #6b7280)' }}
        >
          {/* Decorative pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div
            className="absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-[0.1]"
            style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-8 py-10 text-center md:px-12 md:py-12">
            <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Want more? Explore the EO Business Marketplace
            </h2>

            <p className="mt-3 text-base leading-relaxed text-white/75 md:text-lg">
              Discover commercial EO applications and services
              <br className="hidden md:inline" />
              ready to support your priorities.
            </p>

            {/* CTA */}
            <Link
              href={`/countries/${countryId}/marketplace`}
              className="group mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-8 py-3.5 text-base font-bold shadow-lg transition hover:scale-105 hover:shadow-xl"
            >
              <span className="themed-title">Browse Marketplace</span>
              <ArrowRight className="themed-title h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
