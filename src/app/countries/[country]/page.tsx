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
import { notFound } from 'next/navigation';

import { HeroCountry } from '@components/global';

import db from '@data/db';

import {
  GEOFocusAreaSection,
  CapacityBuildingSection,
  PartnersSection,
  CommunityOfPracticeSection,
  KeyRepresentativesSection,
  EnablingMechanisms,
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
      <HeroCountry
        title={`${countryData.title} Knowledge Hub`}
        description={`Discover the resources available in ${countryData.title}`}
        imageSrc={countryData.flag}
        imageAlt={`${countryData.flag} flag`}
      />

      {/* GEO Focus Areas section */}
      <GEOFocusAreaSection countryData={countryData} />

      {/* GEO Partners in the country */}
      <PartnersSection countryData={countryData} />

      {/* Enabling mechanisms */}
      <EnablingMechanisms countryData={countryData} />

      {/* Community of practice section */}
      <CommunityOfPracticeSection countryData={countryData} />

      {/* Capacity building activities in the country */}
      <CapacityBuildingSection countryData={countryData} />

      {/* Key GEO representatives in the country */}
      <KeyRepresentativesSection countryData={countryData} />
    </div>
  );
};

export default CountryPage;
