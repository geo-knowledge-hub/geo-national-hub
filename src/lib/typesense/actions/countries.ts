/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use server';

import { getCountry, getAllCountries, searchCountries } from '../queries';
import type { Country } from '@content-types/content';
import type { ActionResponse } from './types';

/**
 * Gets a single country by ID
 */
export async function getCountryAction(id: string): Promise<ActionResponse<Country>> {
  try {
    const country = await getCountry(id);
    if (!country) {
      return { success: false, error: `Country '${id}' not found` };
    }
    return { success: true, data: country };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch country',
    };
  }
}

/**
 * Gets all countries
 */
export async function getAllCountriesAction(): Promise<ActionResponse<Country[]>> {
  try {
    const countries = await getAllCountries();
    return { success: true, data: countries };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch countries',
    };
  }
}

/**
 * Searches countries by query
 */
export async function searchCountriesAction(query: string): Promise<ActionResponse<Country[]>> {
  try {
    const countries = await searchCountries(query);
    return { success: true, data: countries };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search countries',
    };
  }
}
