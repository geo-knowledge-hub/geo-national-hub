/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

/**
 * The collection name used as the InstantSearch index
 */
export const INSTANT_SEARCH_INDEX = 'resources';

/**
 * Typesense InstantSearch adapter instance.
 */
const typesenseAdapter = new TypesenseInstantSearchAdapter({
  server: {
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || 'localhost',
        port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || '8108', 10),
        protocol: (process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'http') as 'http' | 'https',
      },
    ],
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY || 'xyz',
    connectionTimeoutSeconds: 5,
  },
  additionalSearchParameters: {
    query_by: 'name,description,organization,subjects,creators.person_or_org.name',
    max_facet_values: 50,
  },
  geoLocationField: 'locations.centroid',
});

/**
 * The search client compatible with React InstantSearch.
 */
export const searchClient = typesenseAdapter.searchClient;
