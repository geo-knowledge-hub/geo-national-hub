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

import Link from 'next/link';

import { HeroTopic } from '@components/global';

import type { Country, FocusAreaChallenge, Resource } from '@content-types/content';

import { ContentSection } from './components';

/**
 * Resource page content props
 */
interface ResourcePageContentProps {
  countryData: Country;
  challengeData: FocusAreaChallenge;
  resources: Resource[];
}

/**
 * ResourcePageContent Component - Client component for resource page
 *
 * @component
 * @param {ResourcePageContentProps} props - Component props.
 * @returns {JSX.Element} The rendered ResourcePageContent component.
 */
export function ResourcePageContent({
  countryData,
  challengeData,
  resources,
}: ResourcePageContentProps): JSX.Element {
  return (
    <div className="relative -mt-24 min-h-screen pt-34">
      <HeroTopic
        title={`${challengeData.title}`}
        description={`EO Applications in ${countryData.title}`}
        ctaLabel="Explore more content"
        ctaLink="/explore"
        ctaMessage="Interested in other countries?"
      />

      {/* Resources */}
      <ContentSection resources={resources} challenge={challengeData} />

      {/* Bottom CTA — mobile only */}
      <div className="mx-auto max-w-7xl px-6 py-10 text-center md:hidden">
        <p className="mb-3 text-sm text-gray-600">Interested in other countries?</p>
        <Link
          href="/explore"
          className="glass-button inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium shadow-sm transition-all hover:border-gray-400 hover:shadow-md"
        >
          Explore more content
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
