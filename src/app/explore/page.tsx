/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { searchResources, getResourceFacets, getChallenges } from '@lib/typesense';
import { ExplorePageContent } from './content';

/**
 * ExplorePage Component - Server component that fetches initial data
 *
 * @component
 * @returns {Promise<JSX.Element>} The rendered ExplorePage component.
 */
export default async function ExplorePage() {
  // Fetch initial resources and facets server-side
  const [initialResults, facets, challenges] = await Promise.all([
    searchResources('*', undefined, 1, 5),
    getResourceFacets(),
    getChallenges(),
  ]);

  return (
    <ExplorePageContent
      initialResources={initialResults.hits}
      initialTotal={initialResults.found}
      facets={facets}
      challenges={challenges}
    />
  );
}
