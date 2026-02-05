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

import { BackButton } from '@components/global';

import type { Country } from '@content-types/content';

import { useTheme } from '../../context/theme-context';
import { CapacityBuildingSection } from './components';

import imageCapacityBuildingConcept from '@public/content/concepts/capacity-building/concept.svg';

/**
 * Properties expected for the CapacityBuildingPageContent component.
 */
interface CapacityBuildingPageContentProps {
  countryData: Country;
}

/**
 * CapacityBuildingPageContent Component - Client component for capacity building page
 *
 * @component
 * @param {CapacityBuildingPageContentProps} props - Component props.
 * @returns {JSX.Element} The rendered CapacityBuildingPageContent component.
 */
export function CapacityBuildingPageContent({
  countryData,
}: CapacityBuildingPageContentProps): JSX.Element {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-20">
          <BackButton />
        </div>

        {/* Goal (Hero block) */}
        <section className="mb-20">
          <div className="grid items-center gap-10 md:grid-cols-[2fr_1fr]">
            <div>
              <h1 className="themed-title mb-4 text-4xl font-extrabold md:text-5xl">
                Capacity building activities
              </h1>
              <p className="mb-6 text-lg">
                Explore capacity building activities in {countryData.title}
              </p>
            </div>
            <div className="hidden justify-center md:flex">
              <Image
                src={imageCapacityBuildingConcept}
                alt="Capacity Building logo"
                width={250}
                height={250}
              />
            </div>
          </div>
        </section>

        <CapacityBuildingSection countryData={countryData} />
      </div>
    </div>
  );
}
