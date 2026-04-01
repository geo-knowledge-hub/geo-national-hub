/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Typesense Library Exports
 *
 * Provides a unified interface for Typesense operations.
 */

// Client
export { getTypesenseClient, createTypesenseClient, COLLECTIONS } from './client';
export type { CollectionName } from './client';

// Queries
export {
  // Countries
  getCountry,
  getAllCountries,
  // Resources
  getResourcesByCountry,
  getResourcesByCountryAndChallenge,
  searchResources,
  getResourceFacets,
  getResourceCountByCountry,
  getChallengesByCountry,
  // Reference data
  getFocusAreas,
  getFocusArea,
  getChallenges,
  getChallenge,
  getChallengesByFocusArea,
} from './queries';

export type { SearchResult, FacetCount, FacetsResult, ResourceFilters } from './queries';
