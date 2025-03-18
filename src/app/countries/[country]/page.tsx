/*
 * This file is part of GEO-Country-Profile.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-Country-Profile is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { BackButton } from '@app/components';
import db from '@data/db';

import {
  ResourcesSection,
  CapacityBuildingSection,
  PartnersSection,
  KeyRepresentativesSection,
} from './components';

/**
 * Properties expected for the ``CountryPage`` component.
 */
interface CountryPageProps {
  params: Promise<{ country: string }>;
}

/**
 * CountryPage Component
 *
 * @component
 * @param {object} props - Component props.
 * @returns {JSX.Element} The rendered HeroSearch component.
 */
const CountryPage: React.FC<CountryPageProps> = ({ params }: CountryPageProps): JSX.Element => {
  // Get country data.
  const { country } = use(params);
  const countryData = db.countries[country];

  // If not found return user to an error page
  if (!countryData) {
    return notFound();
  }

  return (
    <div className={'mt-10'}>
      {/* Country presentation - flag / name */}
      <section>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <BackButton href={'/'} className={'h-10 w-23'} />
          <div className={'flex'}>
            <Image
              src={countryData.flag}
              alt={`${countryData.title} Logo`}
              className="mx-auto mb-4 h-auto w-36"
            />
          </div>

          <div className="mb-4 rounded-full px-4 py-2 text-sm"></div>

          <h1 className="text-4xl leading-tight font-extrabold text-gray-900">
            {countryData.title} Knowledge Hub
          </h1>
        </div>
      </section>

      {/* Socio-environmental issues and solutions in the country */}
      <ResourcesSection countryData={countryData} />

      {/* Capacity building activities in the country */}
      <CapacityBuildingSection countryData={countryData} />

      {/* GEO Partners in the country */}
      <PartnersSection countryData={countryData} />

      {/* Key GEO representatives in the country */}
      <KeyRepresentativesSection countryData={countryData} />
    </div>
  );
};

export default CountryPage;
