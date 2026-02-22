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
import {
  CalendarIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

import { getAssetPath } from '@lib/utils';

import type { MarketplaceBusiness, Country } from '@content-types/content';

/**
 * Properties expected for the BusinessHero component.
 */
interface BusinessHeroProps {
  /** Business data */
  business: MarketplaceBusiness;
  /** Country data for context */
  countryData: Country;
}

/**
 * BusinessHero Component
 *
 * @component
 * @param {BusinessHeroProps} props - Component props.
 * @returns {JSX.Element} The rendered BusinessHero component.
 */
export function BusinessHero({ business, countryData }: BusinessHeroProps): JSX.Element {
  // count apps
  const appCount = business.applications?.length || 0;

  return (
    <div className="mp-business-hero relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
      {/* Themed header band */}
      <div
        className="relative px-8 py-8 md:px-10 md:py-10"
        style={{ background: 'color-mix(in srgb, var(--theme-primary, #526479) 80%, #6b7280)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Logo */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/30 bg-white shadow-lg">
            {business.logo ? (
              <Image
                src={getAssetPath(business.logo)}
                alt={business.name}
                width={80}
                height={80}
                className="h-full w-full object-contain p-2.5"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-50 text-2xl font-bold text-gray-400">
                {business.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>

          {/* Name + tagline */}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              {business.name}
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
              {business.tagline}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex shrink-0 gap-6 sm:gap-8">
            {/* Apps */}
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{appCount}</p>
              <p className="mt-0.5 text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                {appCount === 1 ? 'App' : 'Apps'}
              </p>
            </div>

            {/* Focus Areas */}
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{business.focus_areas?.length || 0}</p>
              <p className="mt-0.5 text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                Focus Areas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-gray-100 bg-gray-50/60 px-8 py-4 md:px-10">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600">
          <MapPinIcon className="h-4 w-4 text-gray-400" />
          {countryData.title}
        </span>

        {business.established && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            Est. {business.established}
          </span>
        )}

        {business.focus_areas && business.focus_areas.length > 0 && (
          <>
            <div className="hidden h-4 w-px bg-gray-200 sm:block" />
            <div className="flex flex-wrap items-center gap-1.5">
              <TagIcon className="h-4 w-4 text-gray-400" />
              {business.focus_areas.map((area) => (
                <span
                  key={area}
                  className="themed-title rounded-full border border-gray-200/60 bg-white px-3 py-0.5 text-[11px] font-semibold"
                >
                  {area}
                </span>
              ))}
            </div>
          </>
        )}

        <div className="hidden flex-1 sm:block" />

        {/* CTA */}
        {business.website_url && (
          <a
            href={business.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="themed-bg inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Visit website
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Body */}
      <div className="bg-white px-8 py-6 md:px-10 md:py-8">
        <div className="space-y-2 text-sm leading-relaxed text-gray-600 md:text-base">
          {business.description
            .split('\n')
            .filter((p) => p.trim())
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>
      </div>
    </div>
  );
}
