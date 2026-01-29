/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Typesense Query Functions
 *
 * Provides typed query functions for fetching data from Typesense collections.
 * These functions are designed for server-side usage in Server Components and Server Actions.
 */

import { getTypesenseClient, COLLECTIONS } from './client';
import type { Country, Resource, FocusArea, FocusAreaChallenge } from '@content-types/content';

/**
 * Type for Typesense search hit
 */
interface SearchHit<T> {
  document: T;
  highlight?: Record<string, unknown>;
  highlights?: unknown[];
  text_match?: number;
}

/**
 * Search result with pagination info and optional facets
 */
export interface SearchResult<T> {
  hits: T[];
  found: number;
  page: number;
  per_page: number;
  facets?: FacetsResult;
}

/**
 * Facet count result
 */
export interface FacetCount {
  value: string;
  count: number;
}

/**
 * Facets result from search
 */
export interface FacetsResult {
  [field: string]: FacetCount[];
}

/**
 * Resource search filters - supports single values or arrays for multi-select
 */
export interface ResourceFilters {
  country_id?: string | string[];
  country?: string | string[];
  type?: string | string[];
  challenges?: string[];
  geo_gwp?: string;
  geo_themes?: string[];
  organization?: string;
}

/**
 * Gets a single country by ID
 */
export async function getCountry(id: string): Promise<Country | null> {
  try {
    const client = getTypesenseClient();
    const result = await client.collections(COLLECTIONS.COUNTRIES).documents(id).retrieve();
    return result as Country;
  } catch (error) {
    // Document not found returns 404
    if ((error as { httpStatus?: number }).httpStatus === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Gets all countries
 */
export async function getAllCountries(): Promise<Country[]> {
  const client = getTypesenseClient();
  const result = await client.collections(COLLECTIONS.COUNTRIES).documents().search({
    q: '*',
    per_page: 250,
  });

  const hits = result.hits as SearchHit<Country>[] | undefined;
  return (hits || []).map((hit) => hit.document);
}

/**
 * Searches countries by query string
 */
export async function searchCountries(query: string): Promise<Country[]> {
  const client = getTypesenseClient();
  const result = await client.collections(COLLECTIONS.COUNTRIES).documents().search({
    q: query,
    query_by: 'title,partners.name,representatives.name',
    per_page: 50,
  });

  const hits = result.hits as SearchHit<Country>[] | undefined;
  return (hits || []).map((hit) => hit.document);
}

/**
 * Gets all resources for a country
 */
export async function getResourcesByCountry(countryId: string): Promise<Resource[]> {
  const client = getTypesenseClient();
  const result = await client
    .collections(COLLECTIONS.RESOURCES)
    .documents()
    .search({
      q: '*',
      filter_by: `country_id:${countryId}`,
      per_page: 250,
    });

  const hits = result.hits as SearchHit<Resource>[] | undefined;
  return (hits || []).map((hit) => hit.document);
}

/**
 * Gets resources for a country filtered by challenge
 */
export async function getResourcesByCountryAndChallenge(
  countryId: string,
  challengeId: string,
): Promise<Resource[]> {
  const client = getTypesenseClient();
  const result = await client
    .collections(COLLECTIONS.RESOURCES)
    .documents()
    .search({
      q: '*',
      filter_by: `country_id:${countryId} && challenges:${challengeId}`,
      per_page: 250,
    });

  const hits = result.hits as SearchHit<Resource>[] | undefined;
  return (hits || []).map((hit) => hit.document);
}

/**
 * Searches resources with optional filters
 */
export async function searchResources(
  query: string,
  filters?: ResourceFilters,
  page: number = 1,
  perPage: number = 20,
): Promise<SearchResult<Resource>> {
  const client = getTypesenseClient();

  // Build filter string - supports arrays for multi-select filtering
  const filterParts: string[] = [];

  // Handle country_id (supports single or multiple)
  if (filters?.country_id) {
    const ids = Array.isArray(filters.country_id) ? filters.country_id : [filters.country_id];
    if (ids.length === 1) {
      filterParts.push(`country_id:${ids[0]}`);
    } else if (ids.length > 1) {
      filterParts.push(`country_id:[${ids.join(',')}]`);
    }
  }

  // Handle country name (supports single or multiple)
  if (filters?.country) {
    const countries = Array.isArray(filters.country) ? filters.country : [filters.country];
    if (countries.length === 1) {
      filterParts.push(`country:=${countries[0]}`);
    } else if (countries.length > 1) {
      filterParts.push(`country:[${countries.map((c) => `${c}`).join(',')}]`);
    }
  }

  // Handle type (supports single or multiple)
  if (filters?.type) {
    const types = Array.isArray(filters.type) ? filters.type : [filters.type];
    if (types.length === 1) {
      filterParts.push(`type:=${types[0]}`);
    } else if (types.length > 1) {
      filterParts.push(`type:[${types.join(',')}]`);
    }
  }

  // Handle challenges (always array)
  if (filters?.challenges?.length) {
    filterParts.push(`challenges:[${filters.challenges.join(',')}]`);
  }

  if (filters?.geo_gwp) filterParts.push(`geo_gwp:${filters.geo_gwp}`);
  if (filters?.organization) filterParts.push(`organization:${filters.organization}`);

  const result = await client
    .collections(COLLECTIONS.RESOURCES)
    .documents()
    .search({
      q: query || '*',
      query_by: 'name,description,overview,organization',
      filter_by: filterParts.length > 0 ? filterParts.join(' && ') : undefined,
      facet_by: 'type,country,challenges',
      max_facet_values: 50,
      page,
      per_page: perPage,
    });

  const hits = result.hits as SearchHit<Resource>[] | undefined;

  // Parse facet counts from result
  const facets: FacetsResult = {};
  for (const facetResult of result.facet_counts || []) {
    facets[facetResult.field_name] = facetResult.counts.map(
      (c: { value: string; count: number }) => ({
        value: c.value,
        count: c.count,
      }),
    );
  }

  return {
    hits: (hits || []).map((hit) => hit.document),
    found: result.found,
    page,
    per_page: perPage,
    facets,
  };
}

/**
 * Gets facet counts for resources (optionally filtered by country)
 */
export async function getResourceFacets(countryId?: string): Promise<FacetsResult> {
  const client = getTypesenseClient();
  const result = await client
    .collections(COLLECTIONS.RESOURCES)
    .documents()
    .search({
      q: '*',
      filter_by: countryId ? `country_id:${countryId}` : undefined,
      facet_by: 'type,challenges,geo_gwp,organization,country',
      per_page: 0, // Only need facets, not documents
    });

  const facets: FacetsResult = {};
  for (const facetResult of result.facet_counts || []) {
    facets[facetResult.field_name] = facetResult.counts.map(
      (c: { value: string; count: number }) => ({
        value: c.value,
        count: c.count,
      }),
    );
  }

  return facets;
}

/**
 * Gets the count of resources for a country
 */
export async function getResourceCountByCountry(countryId: string): Promise<number> {
  const client = getTypesenseClient();
  const result = await client
    .collections(COLLECTIONS.RESOURCES)
    .documents()
    .search({
      q: '*',
      filter_by: `country_id:${countryId}`,
      per_page: 0,
    });

  return result.found;
}

/**
 * Gets unique challenges used by a country's resources
 */
export async function getChallengesByCountry(countryId: string): Promise<string[]> {
  const facets = await getResourceFacets(countryId);
  return (facets.challenges || []).map((c) => c.value);
}

/**
 * Gets all focus areas
 */
export async function getFocusAreas(): Promise<FocusArea[]> {
  const client = getTypesenseClient();
  const result = await client.collections(COLLECTIONS.FOCUS_AREAS).documents().search({
    q: '*',
    per_page: 50,
  });

  const hits = result.hits as SearchHit<FocusArea>[] | undefined;
  return (hits || []).map((hit) => hit.document);
}

/**
 * Gets a focus area by ID
 */
export async function getFocusArea(id: string): Promise<FocusArea | null> {
  try {
    const client = getTypesenseClient();
    const result = await client.collections(COLLECTIONS.FOCUS_AREAS).documents(id).retrieve();
    return result as FocusArea;
  } catch (error) {
    if ((error as { httpStatus?: number }).httpStatus === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Gets all focus area challenges
 */
export async function getChallenges(): Promise<FocusAreaChallenge[]> {
  const client = getTypesenseClient();
  const result = await client.collections(COLLECTIONS.FOCUS_AREA_CHALLENGES).documents().search({
    q: '*',
    per_page: 50,
  });

  const hits = result.hits as SearchHit<FocusAreaChallenge>[] | undefined;
  return (hits || []).map((hit) => hit.document);
}

/**
 * Gets a challenge by ID
 */
export async function getChallenge(id: string): Promise<FocusAreaChallenge | null> {
  try {
    const client = getTypesenseClient();
    const result = await client
      .collections(COLLECTIONS.FOCUS_AREA_CHALLENGES)
      .documents(id)
      .retrieve();
    return result as FocusAreaChallenge;
  } catch (error) {
    if ((error as { httpStatus?: number }).httpStatus === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Gets challenges that belong to a specific focus area
 */
export async function getChallengesByFocusArea(focusAreaId: string): Promise<FocusAreaChallenge[]> {
  const client = getTypesenseClient();
  const result = await client
    .collections(COLLECTIONS.FOCUS_AREA_CHALLENGES)
    .documents()
    .search({
      q: '*',
      filter_by: `tags:${focusAreaId}`,
      per_page: 50,
    });

  const hits = result.hits as SearchHit<FocusAreaChallenge>[] | undefined;
  return (hits || []).map((hit) => hit.document);
}

/**
 * Gets search suggestions based on prefix matching
 * Uses Typesense's prefix search for autocomplete functionality
 */
export async function getSuggestions(prefix: string, limit: number = 5): Promise<string[]> {
  if (!prefix || prefix.trim().length < 2) {
    return [];
  }

  const client = getTypesenseClient();
  const result = await client.collections(COLLECTIONS.RESOURCES).documents().search({
    q: prefix,
    query_by: 'name',
    prefix: true,
    per_page: limit,
    num_typos: 1,
  });

  const hits = result.hits as SearchHit<Resource>[] | undefined;
  // Return unique resource names
  const names = (hits || []).map((hit) => hit.document.name);
  return [...new Set(names)];
}

/**
 * Attempts to find a typo-corrected query when the original search returns no results
 * Returns the corrected query or null if no correction found
 */
export async function getTypoCorrectedQuery(query: string): Promise<string | null> {
  if (!query || query.trim().length < 2) {
    return null;
  }

  const client = getTypesenseClient();
  const result = await client.collections(COLLECTIONS.RESOURCES).documents().search({
    q: query,
    query_by: 'name,description',
    num_typos: 2,
    per_page: 1,
  });

  if (result.found > 0 && result.hits && result.hits.length > 0) {
    // Return the name of the first matching document as the suggestion
    const firstHit = result.hits[0] as SearchHit<Resource>;
    return firstHit.document.name;
  }

  return null;
}

export default {
  // Countries
  getCountry,
  getAllCountries,
  searchCountries,
  // Resources
  getResourcesByCountry,
  getResourcesByCountryAndChallenge,
  searchResources,
  getResourceFacets,
  getResourceCountByCountry,
  getChallengesByCountry,
  getSuggestions,
  getTypoCorrectedQuery,
  // Reference data
  getFocusAreas,
  getFocusArea,
  getChallenges,
  getChallenge,
  getChallengesByFocusArea,
};
