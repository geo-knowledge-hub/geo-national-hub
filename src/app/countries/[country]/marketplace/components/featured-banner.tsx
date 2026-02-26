/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

import { getAssetPath } from '@lib/utils';

import type { MarketplaceBusiness } from '@content-types/content';

/**
 * Properties expected for the FeaturedBanner component.
 */
interface FeaturedBannerProps {
  /** The featured business data */
  business: MarketplaceBusiness;
  /** Country ID for building the link */
  countryId: string;
}

/**
 * FeaturedBanner Component - Full-width featured business banner
 *
 * @component
 * @param {FeaturedBannerProps} props - Component props.
 * @returns {JSX.Element} The rendered FeaturedBanner component.
 */
export function FeaturedBanner({ business, countryId }: FeaturedBannerProps): JSX.Element {
  // Render
  return (
    <Link href={`/countries/${countryId}/marketplace/${business.id}`} className="group block">
      <div className="mp-featured-banner relative overflow-hidden rounded-xl p-6 md:p-8">
        {/* Theme accent stripe */}
        <div className="themed-bg absolute top-0 left-0 h-full w-1" />

        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          {/* Logo */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            {business.logo ? (
              <Image
                src={getAssetPath(business.logo)}
                alt={business.name}
                width={96}
                height={96}
                className="h-full w-full object-contain p-3"
              />
            ) : (
              <div className="themed-bg flex h-full w-full items-center justify-center text-2xl font-bold text-white opacity-80">
                {business.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="themed-title mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
              <Star className="h-3.5 w-3.5" />
              Featured Partner
            </div>

            <h3 className="text-xl font-bold text-gray-900">{business.name}</h3>
            <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-gray-600">{business.tagline}</p>

            {/* Focus tags */}
            {business.focus_areas && business.focus_areas.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {business.focus_areas.map((area) => (
                  <span
                    key={area}
                    className="themed-title rounded-full border border-gray-200/60 bg-white/60 px-2.5 py-0.5 text-[11px] font-semibold"
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="themed-title flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors group-hover:underline">
            View solutions
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
