/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useMemo, JSX } from 'react';
import Link from 'next/link';

import type { Country } from '@content-types/content';

import { HeroSearch } from './components';

/**
 * IDs of countries whose hubs are hosted on this platform (internal hubs)
 */
const INTERNAL_HUB_IDS = new Set(['ghana', 'south-africa']);

/**
 * Explicit display order for hub cards. Countries not in this list are
 * appended at the end in the order they arrive from the API.
 */
const HUB_DISPLAY_ORDER = ['south-africa', 'ghana', 'china'];

/**
 * Props for HomePageContent component
 */
interface HomePageContentProps {
  initialCountries: Country[];
}

/**
 * Shared card inner layout
 */
function CountryCardInner({
  country,
  index,
  isExternal,
}: {
  country: Country;
  index: number;
  isExternal: boolean;
}): JSX.Element {
  const color = country.theme?.primary_color || '#526479';
  const initials = country.title
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const num = String(index + 1).padStart(2, '0');

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md sm:min-h-[260px] sm:flex-row">
      {/* Color panel */}
      <div
        className="relative flex shrink-0 flex-row items-center justify-between overflow-hidden px-5 py-4 sm:w-[36%] sm:flex-col sm:items-start sm:justify-between sm:px-7 sm:py-7"
        style={{ backgroundColor: color }}
      >
        {/* Background number */}
        <span
          className="pointer-events-none absolute -right-2 -bottom-4 text-[80px] leading-none font-black select-none sm:-right-3 sm:-bottom-6 sm:text-[110px]"
          style={{ color: 'rgba(255,255,255,0.10)' }}
        >
          {num}
        </span>

        {/* Monogram */}
        <div className="relative z-10 flex items-baseline gap-3 sm:block">
          <span className="text-2xl font-black tracking-tight text-white/95 sm:text-3xl">
            {initials}
          </span>
          <span className="text-[10px] font-bold tracking-[0.18em] text-white/50 uppercase sm:mt-1.5 sm:block">
            Hub {num}
          </span>
        </div>

        {/* Status badge */}
        {isExternal ? (
          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            <svg
              className="h-3 w-3 text-white/65"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span className="text-[11px] font-semibold tracking-wider text-white/65 uppercase">
              External
            </span>
          </div>
        ) : (
          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <span className="text-[11px] font-semibold tracking-wider text-white/65 uppercase">
              Live
            </span>
          </div>
        )}
      </div>

      {/* Content panel */}
      <div className="flex flex-1 flex-col justify-between bg-white p-5 sm:p-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
            National GEO Knowledge Hub
          </p>
          <h3
            className="mt-2 text-xl font-bold tracking-tight text-gray-900 transition-colors duration-300 sm:mt-3 sm:text-3xl"
            style={{ ['--hover-color' as string]: color }}
          >
            <span className="transition-colors duration-300 group-hover:text-[var(--hover-color,#526479)]">
              {country.title}
            </span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:mt-3">
            {isExternal
              ? 'This country operates an independent national hub. You will be redirected to their platform.'
              : 'Country-specific Earth Observation resources, focus areas, and capacity building tools.'}
          </p>
        </div>

        {/* CTA row */}
        <div className="mt-4 flex items-center justify-between sm:mt-6">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white"
            style={{ backgroundColor: color }}
          >
            {isExternal ? 'Visit Hub' : 'Explore Hub'}
          </span>

          <span
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 group-hover:scale-110 sm:h-9 sm:w-9"
            style={{ borderColor: `${color}50`, color }}
          >
            {isExternal ? (
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            ) : (
              <svg
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * HomePageContent Component - Client component for country hub listing.
 *
 * @component
 * @param {HomePageContentProps} props - Component props.
 * @returns {JSX.Element} The rendered HomePageContent component.
 */
export function HomePageContent({ initialCountries }: HomePageContentProps): JSX.Element {
  // Define countries
  const displayedCountries = useMemo(() => {
    // Filter available / external hubs
    const filtered = initialCountries.filter((c) => INTERNAL_HUB_IDS.has(c.id) || !!c.external_hub);

    // Order based on `display order defined`
    return filtered.slice().sort((a, b) => {
      const ai = HUB_DISPLAY_ORDER.indexOf(a.id);
      const bi = HUB_DISPLAY_ORDER.indexOf(b.id);

      const aRank = ai === -1 ? Infinity : ai;
      const bRank = bi === -1 ? Infinity : bi;

      return aRank - bRank;
    });
  }, [initialCountries]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSearch searchTerm="" setSearchTerm={() => {}} />

      {/* National Hubs */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.32]"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 md:py-20">
          {/* Section header */}
          <div className="mb-10">
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#526479] uppercase">
              National Hubs
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-4xl">
              National GEO Knowledge Hubs
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-500">
              National portals in the GEO Knowledge Hub network, bringing Earth Observation
              knowledge to the national scale.
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            {displayedCountries.map((country, i) => {
              const isExternal = !!country.external_hub;

              if (isExternal) {
                return (
                  <a
                    key={country.id}
                    href={country.external_hub!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <CountryCardInner country={country} index={i} isExternal={true} />
                  </a>
                );
              }

              return (
                <Link key={country.id} href={`/countries/${country.id}`} className="group block">
                  <CountryCardInner country={country} index={i} isExternal={false} />
                </Link>
              );
            })}
          </div>

          {/* Footer note */}
          <p className="mt-12 text-center text-sm text-gray-400">
            Part of the global{' '}
            <a
              href="https://gkhub.earthobservations.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#526479] hover:underline"
            >
              GEO Knowledge Hub
            </a>{' '}
            initiative, more national hubs in development.
          </p>
        </div>
      </section>
    </div>
  );
}
