/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { Suspense } from 'react';

import { getChallenges, getResourceFacets } from '@lib/typesense';
import { ExplorePageContent } from './content';

/**
 * ExplorePage Component
 *
 * @component
 */
export default async function ExplorePage() {
  const [challenges, facets] = await Promise.all([getChallenges(), getResourceFacets()]);

  const resourceTypeFacet = facets['resource_type.id'] ?? [];
  const countryFacet = facets['country'] ?? [];

  const heroStats = {
    totalResources: resourceTypeFacet.reduce((sum, f) => sum + f.count, 0),
    totalResourceTypes: resourceTypeFacet.length,
    totalCountries: countryFacet.length,
  };

  return (
    <Suspense>
      <ExplorePageContent challenges={challenges} heroStats={heroStats} />
    </Suspense>
  );
}
