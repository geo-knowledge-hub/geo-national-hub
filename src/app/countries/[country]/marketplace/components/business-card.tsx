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
import { ArrowRight } from 'lucide-react';

import { getAssetPath } from '@lib/utils';

import type { MarketplaceBusiness } from '@content-types/content';

/**
 * Properties expected for the BusinessCard component.
 */
interface BusinessCardProps {
  /** Business data */
  business: MarketplaceBusiness;
  /** Country ID for building the link */
  countryId: string;
}

/**
 * BusinessCard Component
 *
 * @component
 * @param {BusinessCardProps} props - Component props.
 * @returns {JSX.Element} The rendered BusinessCard component.
 */
export function BusinessCard({ business, countryId }: BusinessCardProps): JSX.Element {
  // Get number of applications
  const appCount = business.applications?.length || 0;

  return (
    <Link
      href={`/countries/${countryId}/marketplace/${business.id}`}
      className="group block h-full"
    >
      <div className="mp-card flex h-full flex-col items-center p-6 text-center">
        {/* Logo zone */}
        <div className="mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-transform duration-220 ease-in-out group-hover:scale-[1.04]">
          {business.logo ? (
            <Image
              src={getAssetPath(business.logo)}
              alt={business.name}
              width={80}
              height={80}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <div className="themed-bg flex h-full w-full items-center justify-center text-xl font-bold text-white opacity-80">
              {business.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900">{business.name}</h3>

        {/* Tagline */}
        <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{business.tagline}</p>

        {/* Focus tags */}
        {business.focus_areas && business.focus_areas.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
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

        {/* App count + arrow */}
        <div className="mt-auto flex items-center gap-1.5 pt-5 text-sm text-gray-400 transition-colors group-hover:text-(--theme-primary)">
          <span>
            {appCount === 0 ? 'Coming soon' : `${appCount} ${appCount === 1 ? 'app' : 'apps'}`}
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
