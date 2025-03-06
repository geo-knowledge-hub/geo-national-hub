/*
 * This file is part of GEO-Country-Profile.
 * Copyright (C) 2025 GEO Knowledge Hub Developers.
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
            {countryData.title} Profile
          </h1>
        </div>
      </section>

      {/* Country key facts */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Key facts</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {countryData.keyFacts.map((keyFactor, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                <h3 className="text-lg font-semibold">{keyFactor.type}</h3>
                <p className="text-gray-700">{keyFactor.value}</p>
              </div>
            ))}
          </div>
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
