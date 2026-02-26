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
import { Calendar, MapPin, ExternalLink, Tag } from 'lucide-react';

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
  const appCount = business.applications?.length || 0;
  const focusAreaCount = business.focus_areas?.length || 0;

  // Primary color from country theme
  const primaryColor = countryData.theme?.primary_color || '#526479';

  const stats = [
    { value: appCount, label: appCount === 1 ? 'App' : 'Apps' },
    { value: focusAreaCount, label: 'Focus Areas' },
  ];

  return (
    <div className="mp-business-hero relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
      {/* Header band */}
      <div
        className="relative px-8 py-10 md:px-10 md:py-14"
        style={{
          background: `linear-gradient(150deg, color-mix(in srgb, ${primaryColor} 80%, white) 0%, color-mix(in srgb, ${primaryColor} 88%, black) 100%)`,
        }}
      >
        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
          {/* Logo, name, and tagline */}
          <div className="flex min-w-0 items-start gap-5">
            {/* Logo */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/25 bg-white shadow-2xl ring-4 ring-white/10 md:h-24 md:w-24">
              {business.logo ? (
                <Image
                  src={getAssetPath(business.logo)}
                  alt={business.name}
                  width={96}
                  height={96}
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

            {/* Name and tagline */}
            <div className="min-w-0 pt-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-4xl xl:text-5xl">
                {business.name}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                {business.tagline}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 md:shrink-0 md:pt-1">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex-1 rounded-xl px-4 py-3 text-center md:min-w-[72px] md:flex-initial"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <p className="text-2xl font-bold text-white md:text-3xl">{stat.value}</p>
                <p className="mt-0.5 text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-gray-100 bg-gray-50/50 px-8 py-4 md:px-10">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          {countryData.title}
        </span>

        {business.established && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            Est. {business.established}
          </span>
        )}

        {business.focus_areas && business.focus_areas.length > 0 && (
          <>
            <div className="hidden h-4 w-px bg-gray-200 sm:block" />
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag className="h-4 w-4 text-gray-400" />
              {business.focus_areas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-gray-200/70 bg-white px-3 py-1 text-[11px] font-semibold"
                  style={{ color: primaryColor }}
                >
                  {area}
                </span>
              ))}
            </div>
          </>
        )}

        <div className="hidden flex-1 sm:block" />

        {business.website_url && (
          <a
            href={business.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
            style={{ backgroundColor: primaryColor }}
          >
            Visit website
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Description */}
      <div className="bg-white px-8 py-8 md:px-10 md:py-10">
        <div className="space-y-4 text-[15px] leading-[1.85] text-gray-600">
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
