/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
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
  /** Filters on `resource_type.id` */
  resource_type_id?: string | string[];
  challenges?: string[];
  /** Filters on `geo_work_programme_activity.id` */
  geo_work_programme_activity_id?: string;
  /** Filters on `engagement_priorities.id` */
  engagement_priority_ids?: string[];
  /** Filters on `target_audiences.id` */
  target_audience_ids?: string[];
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

  // Handle resource_type_id (supports single or multiple)
  if (filters?.resource_type_id) {
    const types = Array.isArray(filters.resource_type_id)
      ? filters.resource_type_id
      : [filters.resource_type_id];

    if (types.length === 1) {
      filterParts.push(`resource_type.id:=${types[0]}`);
    } else if (types.length > 1) {
      filterParts.push(`resource_type.id:[${types.join(',')}]`);
    }
  }

  // Handle challenges
  if (filters?.challenges?.length) {
    filterParts.push(`challenges:[${filters.challenges.join(',')}]`);
  }

  if (filters?.geo_work_programme_activity_id) {
    filterParts.push(`geo_work_programme_activity.id:=${filters.geo_work_programme_activity_id}`);
  }

  // Handle engagement_priority_ids
  if (filters?.engagement_priority_ids?.length) {
    filterParts.push(`engagement_priorities.id:[${filters.engagement_priority_ids.join(',')}]`);
  }

  // Handle target_audience_ids
  if (filters?.target_audience_ids?.length) {
    filterParts.push(`target_audiences.id:[${filters.target_audience_ids.join(',')}]`);
  }

  if (filters?.organization) filterParts.push(`organization:${filters.organization}`);

  const result = await client
    .collections(COLLECTIONS.RESOURCES)
    .documents()
    .search({
      q: query || '*',
      query_by: 'name,description,organization,subjects,creators.person_or_org.name',
      filter_by: filterParts.length > 0 ? filterParts.join(' && ') : undefined,
      facet_by:
        'resource_type.id,country,challenges,engagement_priorities.id,target_audiences.id,geo_work_programme_activity.id,organization,source',
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
 * Gets facet counts for resources
 */
export async function getResourceFacets(countryId?: string): Promise<FacetsResult> {
  const client = getTypesenseClient();
  const result = await client
    .collections(COLLECTIONS.RESOURCES)
    .documents()
    .search({
      q: '*',
      filter_by: countryId ? `country_id:${countryId}` : undefined,
      facet_by:
        'resource_type.id,challenges,geo_work_programme_activity.id,organization,country,engagement_priorities.id,target_audiences.id',
      per_page: 0,
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
 * Gets the count of resources
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
 * Gets unique challenges
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
