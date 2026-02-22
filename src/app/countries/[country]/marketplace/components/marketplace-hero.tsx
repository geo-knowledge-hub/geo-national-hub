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

import { BuildingStorefrontIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

import { BackButton } from '@components/global';

/**
 * Properties expected for the MarketplaceHero component.
 */
interface MarketplaceHeroProps {
  /** Country title for display */
  countryTitle: string;
  /** Optional custom intro text */
  introText?: string;
  /** Theme primary color */
  primaryColor: string;
  /** Total number of businesses */
  businessCount: number;
  /** Total number of applications */
  appCount: number;
  /** Total number of focus areas */
  focusAreaCount: number;
}

/**
 * MarketplaceHero Component
 *
 * @component
 * @param {MarketplaceHeroProps} props - Component props.
 * @returns {JSX.Element} The rendered MarketplaceHero component.
 */
export function MarketplaceHero({
  countryTitle,
  introText,
  primaryColor,
  businessCount,
  appCount,
  focusAreaCount,
}: MarketplaceHeroProps): JSX.Element {
  return (
    <div className="mp-hero relative -mx-6 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, color-mix(in srgb, ${primaryColor} 8%, #ffffff) 0%, color-mix(in srgb, ${primaryColor} 14%, #f8f9fb) 100%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(color-mix(in srgb, ${primaryColor} 15%, transparent) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Bottom border accent */}
      <div
        className="absolute right-0 bottom-0 left-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)`,
          opacity: 0.25,
        }}
      />

      {/* Back button */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-6 md:pt-8">
        <BackButton />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-10 pb-12 text-center md:px-10 md:pt-14 md:pb-14 lg:pt-16 lg:pb-16">
        {/* Overline badge */}
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-widest text-white uppercase"
          style={{ backgroundColor: primaryColor }}
        >
          <BuildingStorefrontIcon className="h-3.5 w-3.5" />
          Marketplace
        </span>

        {/* Title */}
        <h1 className="mt-5 max-w-xl text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
          EO Solutions for <span className="themed-title">{countryTitle}</span>
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-500 md:text-lg">
          {introText ||
            'Browse solutions from certified organizations delivering Earth Observation tools and services tailored to your priorities.'}
        </p>

        {/* Stats row */}
        <div className="mt-8 flex items-center gap-6 md:gap-10">
          <div className="text-center">
            <span className="themed-title text-3xl font-bold">{businessCount}</span>
            <p className="mt-0.5 text-[11px] font-medium tracking-wider text-gray-400 uppercase">
              {businessCount === 1 ? 'Business' : 'Businesses'}
            </p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-center">
            <span className="themed-title text-3xl font-bold">{appCount}</span>
            <p className="mt-0.5 text-[11px] font-medium tracking-wider text-gray-400 uppercase">
              {appCount === 1 ? 'Application' : 'Applications'}
            </p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-center">
            <span className="themed-title text-3xl font-bold">{focusAreaCount}</span>
            <p className="mt-0.5 text-[11px] font-medium tracking-wider text-gray-400 uppercase">
              Focus Areas
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-6">
        <button
          onClick={() => {
            const content = document.getElementById('mp-content');
            content?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group flex flex-col items-center gap-1 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Scroll to content"
        >
          <span className="text-[11px] font-medium tracking-wider uppercase">Explore</span>

          <ChevronDownIcon className="h-5 w-5 animate-bounce" />
        </button>
      </div>
    </div>
  );
}
