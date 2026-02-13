/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use server';

import {
  getResourcesByCountry,
  getResourcesByCountryAndChallenge,
  searchResources,
  getResourceFacets,
  getResourceCountByCountry,
  getChallengesByCountry,
  getSuggestions,
  getTypoCorrectedQuery,
  type ResourceFilters,
} from '../queries';
import type { Resource } from '@content-types/content';
import type { ActionResponse } from './types';

/**
 * Gets all resources for a country
 */
export async function getCountryResourcesAction(
  countryId: string,
): Promise<ActionResponse<Resource[]>> {
  try {
    const resources = await getResourcesByCountry(countryId);
    return { success: true, data: resources };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch resources',
    };
  }
}

/**
 * Gets resources for a country filtered by challenge
 */
export async function getCountryResourcesByChallengeAction(
  countryId: string,
  challengeId: string,
): Promise<ActionResponse<Resource[]>> {
  try {
    const resources = await getResourcesByCountryAndChallenge(countryId, challengeId);
    return { success: true, data: resources };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch resources',
    };
  }
}

/**
 * Searches resources with filters - returns results with dynamic facet counts
 */
export async function searchResourcesAction(
  query: string,
  filters?: ResourceFilters,
  page: number = 1,
  perPage: number = 20,
): Promise<
  ActionResponse<{
    hits: Resource[];
    found: number;
    page: number;
    per_page: number;
    facets?: {
      [field: string]: { value: string; count: number }[];
    };
  }>
> {
  try {
    const result = await searchResources(query, filters, page, perPage);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search resources',
    };
  }
}

/**
 * Gets resource facets for filtering
 */
export async function getResourceFacetsAction(countryId?: string): Promise<
  ActionResponse<{
    [field: string]: { value: string; count: number }[];
  }>
> {
  try {
    const facets = await getResourceFacets(countryId);
    return { success: true, data: facets };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch facets',
    };
  }
}

/**
 * Gets resource count for a country
 */
export async function getResourceCountAction(countryId: string): Promise<ActionResponse<number>> {
  try {
    const count = await getResourceCountByCountry(countryId);
    return { success: true, data: count };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch count',
    };
  }
}

/**
 * Gets challenges used by a country's resources
 */
export async function getCountryChallengesAction(
  countryId: string,
): Promise<ActionResponse<string[]>> {
  try {
    const challenges = await getChallengesByCountry(countryId);
    return { success: true, data: challenges };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch challenges',
    };
  }
}
