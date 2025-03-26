/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, use } from 'react';

import Image from 'next/image';

import { BackButton } from '@components/global';

import db from '@data/db';

import { CapacityBuildingSection } from './components';
import { Country } from '@data/content/resources';

import imageCapacityBuildingConcept from '@public/content/concepts/capacity-building/concept.svg';

/**
 * Properties expected for the ``CapacityBuildingPage`` component.
 */
interface CountryPageProps {
  params: Promise<{ country: string }>;
}

/**
 * CountryPage Component
 *
 * @component
 * @param {CountryPageProps} props - Component props.
 * @returns {JSX.Element} The rendered HeroSearch component.
 */
const CapacityBuildingPage: React.FC<CountryPageProps> = ({
  params,
}: CountryPageProps): JSX.Element => {
  // Get selected content
  const { country } = use(params);

  // Get ``country`` and ``focus area`` data
  const countryData: Country = db.countries[country];

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-20">
          <BackButton />
        </div>

        {/* Goal (Hero block) */}
        <section className="mb-20">
          <div className="grid items-center gap-10 md:grid-cols-[2fr_1fr]">
            <div>
              <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">
                Capacity building activities
              </h1>
              <p className="mb-6 text-lg text-gray-600">
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
};

export default CapacityBuildingPage;
