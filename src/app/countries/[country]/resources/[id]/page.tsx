/*
 * This file is part of GEO-Country-Profile.
 * Copyright (C) 2025 GEO Knowledge Hub Developers.
 *
 * GEO-Country-Profile is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import db from '@data/db';
import { notFound } from 'next/navigation';

import { ContentSection } from './components';
import { BackButton } from '@app/components';

interface ResourcePageProps {
  params: Promise<{ id: string; country: string }>;
}

const ResourcePage: React.FC<ResourcePageProps> = async ({ params }) => {
  /**
   * Params
   */
  const { country, id } = await params;

  /**
   * Reusable variables
   */
  let resourceData = null;

  /**
   * Get data of the selected country
   */
  const countryData = db.countries[country];

  if (!countryData) {
    return notFound();
  }

  /**
   * Get resource
   */
  const foundResource = countryData.resources.find((res) => res.link === id);
  if (foundResource) {
    resourceData = foundResource;
  }

  // Return not found page if country is not available.
  if (!resourceData) {
    return notFound();
  }

  return (
    <div className={'mt-10'}>
      {/* Country presentation - flag / name */}
      <section>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <BackButton href={`/countries/${countryData.id}`} className={'h-10 w-23'} />

          <h1 className="text-3xl leading-tight font-extrabold text-gray-900">
            Resources related to {resourceData.title} in {countryData.title}
          </h1>
        </div>
      </section>

      {/* Local Resources */}
      <ContentSection title="Resources in Ghana" resources={resourceData.content.local} />

      {/* Global Resources */}
      <ContentSection title="Global Resources" resources={resourceData.content.global} />
    </div>
  );
};

export default ResourcePage;
