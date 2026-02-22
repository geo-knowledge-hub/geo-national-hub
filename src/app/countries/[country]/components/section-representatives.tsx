/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';

import Image from 'next/image';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

import { getAssetPath } from '@lib/utils';

import type { Country } from '@content-types/content';

/**
 * Properties expected for the KeyRepresentatives component.
 */
interface KeyRepresentativesSectionProps {
  countryData: Country;
}

/**
 * Key representative section component
 *
 * @param {KeyRepresentativesSectionProps} props - The properties containing country data.
 * @returns {JSX.Element} - A JSX element displaying the list of representatives.
 */
export function KeyRepresentativesSection({
  countryData,
}: KeyRepresentativesSectionProps): JSX.Element {
  const representatives = countryData.representatives || [];

  // Base validation - Is to show component?
  const showComponent = representatives.length > 0;

  if (!showComponent) {
    return <></>;
  }

  // Rendering!
  return (
    <section id="representatives" className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header — left-aligned like other sections */}
        <div>
          <h2 className="themed-title text-3xl font-bold">Key representatives</h2>
          <p className="mt-2 text-gray-600">
            The representatives supporting the National GKH activities and collaboration.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {representatives.map((rep, index) => (
            <div
              key={index}
              className="group flex flex-col items-center rounded-xl border border-gray-100 bg-white p-5 text-center transition hover:border-gray-200 hover:shadow-md"
            >
              {/* Avatar */}
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-gray-100 shadow-sm">
                <Image
                  src={getAssetPath(rep.avatar)}
                  alt={rep.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Name */}
              <h3 className="mt-3 text-sm font-bold text-gray-900">{rep.name}</h3>

              {/* Role */}
              <p className="mt-0.5 text-xs text-gray-500">{rep.role}</p>

              {/* Profile link */}
              <a
                href={rep.profile}
                target="_blank"
                rel="noopener noreferrer"
                className="themed-title mt-3 inline-flex items-center gap-1 text-xs font-medium transition hover:opacity-80"
              >
                View profile
                <ArrowTopRightOnSquareIcon className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
