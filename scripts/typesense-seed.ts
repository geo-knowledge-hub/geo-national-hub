#!/usr/bin/env npx tsx
/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Typesense Seed Script
 *
 * Seeds Typesense collections with data from JSON files.
 *
 * Usage:
 *   npx tsx scripts/typesense-seed.ts          # Seed all collections
 *   npx tsx scripts/typesense-seed.ts --reset  # Drop and recreate collections first
 *
 * Environment variables:
 *   TYPESENSE_HOST     - Typesense host (default: localhost)
 *   TYPESENSE_PORT     - Typesense port (default: 8108)
 *   TYPESENSE_PROTOCOL - Protocol (default: http)
 *   TYPESENSE_API_KEY  - API key (default: xyz)
 */

import fs from 'fs';
import path from 'path';
import Typesense from 'typesense';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import {
  countriesSchema,
  resourcesSchema,
  focusAreasSchema,
  focusAreaChallengesSchema,
  healthSchema,
} from '../src/lib/typesense/schemas';

// Parse command line arguments
const args = process.argv.slice(2);
const shouldReset = args.includes('--reset');

// Paths to JSON data files
const DATA_DIR = path.join(__dirname, '../data');
const GEO_JSON_PATH = path.join(DATA_DIR, 'geo.json');
const COUNTRIES_JSON_PATH = path.join(DATA_DIR, 'countries.json');
const RESOURCES_JSON_PATH = path.join(DATA_DIR, 'resources.json');

// JSON data types
interface GeoJsonData {
  focus_areas: Record<
    string,
    {
      id: string;
      name: string;
      logo: string;
    }
  >;
  challenges: Record<
    string,
    {
      id: string;
      title: string;
      description: string;
      tags: string[];
      logo: string;
    }
  >;
}

interface CountryJsonData {
  countries: Record<
    string,
    {
      id: string;
      title: string;
      flag: string;
      theme?: {
        primary_color: string;
        secondary_color?: string;
        accent_color?: string;
        hero_variant: string;
        background_image?: string;
      };
      managed_by?: {
        name: string;
        url?: string;
      };
      community_of_practice: {
        name: string;
        description: string;
        logo: string;
        link: string;
      } | null;
      mechanisms: Array<{
        name: string;
        description: string;
        link: string;
        logo: string;
      }>;
      capacity_building_activities: Array<{
        title: string;
        description: string;
        link: string;
        logo: string;
        date?: string;
        recurring?: boolean;
        source?: string;
      }>;
      partners: Array<{
        name: string;
        description: string;
        logo: string;
        link: string;
      }>;
      representatives: Array<{
        name: string;
        role: string;
        profile: string;
        avatar: string;
      }>;
    }
  >;
}

interface ResourceJsonData {
  resources: Array<{
    id: string;
    source?: string;
    country_id: string;
    country: string;
    name: string;
    type: string;
    uploaded: string;
    description: string;
    link: string;
    icon: string;
    challenges: string[];
    extras: string[];
    overview: string;
    license: string;
    subjects: string;
    organization: string;
    locations: string;
    geo_gwp?: string;
    geo_themes?: string[];
    target_audiences?: string[];
    contributors?: string[];
  }>;
}

// Create Typesense client
const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'localhost',
      port: parseInt(process.env.TYPESENSE_PORT || '8108', 10),
      protocol: (process.env.TYPESENSE_PROTOCOL || 'http') as 'http' | 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 10,
});

/**
 * Loads JSON data from a file
 */
function loadJsonFile<T>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

/**
 * Creates a collection if it doesn't exist
 */
async function createCollectionIfNotExists(schema: {
  name: string;
  fields: unknown[];
  enable_nested_fields?: boolean;
}): Promise<void> {
  try {
    await client.collections(schema.name).retrieve();

    console.log(`  Collection '${schema.name}' already exists`);
  } catch (error) {
    if ((error as { httpStatus?: number }).httpStatus === 404) {
      await client.collections().create(schema as CollectionCreateSchema);
      console.log(`  Created collection '${schema.name}'`);
    } else {
      throw error;
    }
  }
}

/**
 * Drops a collection if it exists
 */
async function dropCollectionIfExists(name: string): Promise<void> {
  try {
    await client.collections(name).delete();
    console.log(`  Dropped collection '${name}'`);
  } catch (error) {
    if ((error as { httpStatus?: number }).httpStatus === 404) {
      console.log(`  Collection '${name}' does not exist`);
    } else {
      throw error;
    }
  }
}

/**
 * Seeds focus areas collection from JSON
 */
async function seedFocusAreas(): Promise<void> {
  console.log('\nSeeding focus_areas...');

  const geoData = loadJsonFile<GeoJsonData>(GEO_JSON_PATH);
  const documents = Object.entries(geoData.focus_areas).map(([key, fa]) => ({
    id: fa.id,
    key,
    name: fa.name,
    logo: fa.logo,
  }));

  for (const doc of documents) {
    try {
      await client.collections('focus_areas').documents().upsert(doc);
    } catch (error) {
      console.error(`  Error upserting focus area '${doc.id}':`, error);
    }
  }

  console.log(`  Seeded ${documents.length} focus areas`);
}

/**
 * Seeds focus area challenges collection from JSON
 */
async function seedChallenges(): Promise<void> {
  console.log('\nSeeding focus_area_challenges...');

  const geoData = loadJsonFile<GeoJsonData>(GEO_JSON_PATH);

  // Load focus areas to get tag names
  const focusAreasMap = new Map<string, string>();
  for (const fa of Object.values(geoData.focus_areas)) {
    focusAreasMap.set(fa.id, fa.name);
  }

  const documents = Object.entries(geoData.challenges).map(([key, ch]) => ({
    id: ch.id,
    key,
    title: ch.title,
    description: ch.description,
    tags: ch.tags,
    tag_names: ch.tags.map((tagId) => focusAreasMap.get(tagId) || tagId),
    logo: ch.logo,
  }));

  for (const doc of documents) {
    try {
      await client.collections('focus_area_challenges').documents().upsert(doc);
    } catch (error) {
      console.error(`  Error upserting challenge '${doc.id}':`, error);
    }
  }

  console.log(`  Seeded ${documents.length} challenges`);
}

/**
 * Fetches existing country configs from Typesense to preserve them during re-seeding
 */
async function fetchExistingCountryConfigs(): Promise<Map<string, unknown[]>> {
  const configsMap = new Map<string, unknown[]>();

  try {
    const result = await client.collections('countries').documents().search({
      q: '*',
      per_page: 250,
    });

    for (const hit of result.hits || []) {
      const doc = hit.document as { id: string; component_configs?: unknown[] };
      if (doc.component_configs && doc.component_configs.length > 0) {
        configsMap.set(doc.id, doc.component_configs);
      }
    }

    if (configsMap.size > 0) {
      console.log(`  Found existing configs for ${configsMap.size} countries (will preserve)`);
    }
  } catch (error) {
    // Collection might not exist yet, that's okay
    console.log('  No existing country configs to preserve');
  }

  return configsMap;
}

/**
 * Seeds countries collection from JSON
 * Preserves existing component_configs from Typesense
 */
async function seedCountries(): Promise<void> {
  console.log('\nSeeding countries...');

  // Fetch existing configs before seeding
  const existingConfigs = await fetchExistingCountryConfigs();

  const countryData = loadJsonFile<CountryJsonData>(COUNTRIES_JSON_PATH);
  const documents = Object.values(countryData.countries).map((country) => {
    // Preserve existing component_configs if any
    const existingComponentConfigs = existingConfigs.get(country.id);

    return {
      ...country,
      // Preserve existing configs, otherwise undefined (not included in doc)
      ...(existingComponentConfigs && { component_configs: existingComponentConfigs }),
    };
  });

  for (const doc of documents) {
    try {
      await client.collections('countries').documents().upsert(doc);
    } catch (error) {
      console.error(`  Error upserting country '${doc.id}':`, error);
    }
  }

  console.log(`  Seeded ${documents.length} countries`);
}

/**
 * Seeds resources collection from JSON
 */
async function seedResources(): Promise<void> {
  console.log('\nSeeding resources...');

  const resourceData = loadJsonFile<ResourceJsonData>(RESOURCES_JSON_PATH);
  const documents = resourceData.resources.map((resource) => resource);

  for (const doc of documents) {
    try {
      await client.collections('resources').documents().upsert(doc);
    } catch (error) {
      console.error(`  Error upserting resource '${doc.id}':`, error);
    }
  }

  console.log(`  Seeded ${documents.length} resources`);
}

/**
 * Main seed function
 */
async function main(): Promise<void> {
  console.log('Typesense Seed Script');
  console.log('=====================');
  console.log(
    `Host: ${process.env.TYPESENSE_HOST || 'localhost'}:${process.env.TYPESENSE_PORT || '8108'}`,
  );
  console.log(`Data directory: ${DATA_DIR}\n`);

  // Verify JSON files exist
  const requiredFiles = [GEO_JSON_PATH, COUNTRIES_JSON_PATH, RESOURCES_JSON_PATH];
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      console.error(`ERROR: Missing required file: ${file}`);
      process.exit(1);
    }
  }
  console.log('All JSON data files found');

  try {
    // Test connection
    await client.health.retrieve();
    console.log('Connected to Typesense');
  } catch (error) {
    console.error('ERROR: Failed to connect to Typesense:', error);
    process.exit(1);
  }

  // Reset collections if requested
  if (shouldReset) {
    console.log('\nResetting collections...');
    await dropCollectionIfExists('resources');
    await dropCollectionIfExists('countries');
    await dropCollectionIfExists('focus_area_challenges');
    await dropCollectionIfExists('focus_areas');
    await dropCollectionIfExists('health');
  }

  // Create collections
  console.log('\nCreating collections...');
  await createCollectionIfNotExists(focusAreasSchema);
  await createCollectionIfNotExists(focusAreaChallengesSchema);
  await createCollectionIfNotExists(countriesSchema);
  await createCollectionIfNotExists(resourcesSchema);
  await createCollectionIfNotExists(healthSchema);

  // Seed data
  await seedFocusAreas();
  await seedChallenges();
  await seedCountries();
  await seedResources();

  console.log('\nSeeding complete!');
}

// Run the script
main().catch((error) => {
  console.error('ERROR: Seed script failed:', error);
  process.exit(1);
});
