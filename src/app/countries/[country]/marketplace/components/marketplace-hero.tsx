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

import { Store, ChevronDown } from 'lucide-react';

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
  const stats = [
    { value: businessCount, label: businessCount === 1 ? 'Business' : 'Businesses' },
    { value: appCount, label: appCount === 1 ? 'Application' : 'Applications' },
    { value: focusAreaCount, label: 'Focus Areas' },
  ];

  return (
    <div className="mp-hero relative -mx-6 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            // Large warm bloom
            `radial-gradient(ellipse 85% 110% at 96% 0%, color-mix(in srgb, ${primaryColor} 20%, transparent) 0%, transparent 60%)`,
            // Medium secondary bloom
            `radial-gradient(ellipse 60% 70% at 2% 100%, color-mix(in srgb, ${primaryColor} 9%, transparent) 0%, transparent 55%)`,
            // Faint center bloom
            `radial-gradient(ellipse 70% 60% at 55% 55%, color-mix(in srgb, ${primaryColor} 4%, transparent) 0%, transparent 65%)`,
            // Warm white base
            `#faf9f7`,
          ].join(', '),
        }}
      />

      <div
        className="absolute right-0 bottom-0 left-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, color-mix(in srgb, ${primaryColor} 55%, transparent) 35%, color-mix(in srgb, ${primaryColor} 55%, transparent) 65%, transparent 100%)`,
        }}
      />

      {/* Back button */}
      <div className="relative z-10 mx-auto max-w-7xl px-10 pt-6 md:pt-8">
        <BackButton />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-7xl px-10 pt-10 pb-10 md:px-10 md:pt-14 md:pb-12 lg:pt-18 lg:pb-16">
        <div className="grid items-end gap-8 md:grid-cols-[1.4fr_1fr] lg:gap-12">
          {/* Left */}
          <div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-widest text-white uppercase"
              style={{ backgroundColor: primaryColor }}
            >
              <Store className="h-3.5 w-3.5" />
              Marketplace
            </span>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              EO Solutions for <span className="themed-title">{countryTitle}</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-500 md:text-lg">
              {introText ||
                'Browse solutions from certified organizations delivering Earth Observation tools and services tailored to your priorities.'}
            </p>
          </div>

          {/* Right */}
          <div className="flex gap-3 md:justify-end">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex-1 rounded-2xl px-4 py-5 text-center transition-all duration-200 hover:scale-[1.02] md:min-w-[100px] md:flex-initial md:px-6"
                style={{
                  background: `color-mix(in srgb, ${primaryColor} 5%, rgba(255,255,255,0.85))`,
                  border: `1px solid color-mix(in srgb, ${primaryColor} 18%, transparent)`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span
                  className="block text-3xl font-bold md:text-4xl"
                  style={{ color: primaryColor }}
                >
                  {stat.value}
                </span>
                <p className="mt-1.5 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </button>
      </div>
    </div>
  );
}
