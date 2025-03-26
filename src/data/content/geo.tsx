/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { StaticImageData } from 'next/image';

import {
  GlobeAltIcon,
  CloudIcon,
  BugAntIcon,
  ExclamationTriangleIcon,
  ScissorsIcon,
  PercentBadgeIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

/**
 * GEO Focus Areas logo
 */
import logoHealth from '@public/content/geo/focus-areas/one-health/one-health.svg';
import logoClimate from '@public/content/geo/focus-areas/climate-energy-urban/climate-energy-urban.svg';
import logoWeather from '@public/content/geo/focus-areas/weather-hazard-disaster/weather-hazard-disaster.svg';
import logoWater from '@public/content/geo/focus-areas/water-land-sustainability/water-land-sustainability.svg';
import logoAgriculture from '@public/content/geo/focus-areas/agriculture-food-security/agriculture-food-security.svg';
import logoEcosystems from '@public/content/geo/focus-areas/ecosystems-biodiversity-carbon/ecosystems-biodiversity-carbon.svg';
import logoODOK from '@public/content/geo/focus-areas/open-data-knowledge-infra/open-data-knowledge-infra.svg';

/**
 * Icon type (Temporary)
 */
export type HeroIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

/**
 * GEO Focus Area item properties
 */
export interface GEOFocusArea {
  id: string;
  name: string;
  logo: StaticImageData | string;
}

/**
 * GEO Focus Areas properties
 */
export interface GEOFocusAreas {
  [key: string]: GEOFocusArea;
}

/**
 * GEO Focus Areas Challenge item properties
 */
export interface GEOFocusAreaChallenge {
  id: string;
  title: string;
  description: string;
  tags: GEOFocusArea[];
  logo: HeroIcon;
}

/**
 * GEO Focus Areas Challenges properties
 */
export interface GEOFocusAreaChallenges {
  [key: string]: GEOFocusAreaChallenge;
}

/**
 * GEO Focus Areas definition
 */
export const FocusAreas: GEOFocusAreas = {
  Agriculture: {
    id: 'agriculture-and-food-security',
    name: 'Agriculture	and	Food	Security',
    logo: logoAgriculture,
  },
  Water: {
    id: 'land-and-water-sustainability',
    name: 'Land	and	Water	Sustainability',
    logo: logoWater,
  },
  Ecosystem: {
    id: 'ecosystems-biodiversity-carbon',
    name: 'Ecosystems,	Biodiversity	and	Carbon Management',
    logo: logoEcosystems,
  },
  Weather: {
    id: 'weather-hazard-disaster-resilience',
    name: 'Weather,	Hazard	and Disaster	Resilience',
    logo: logoWeather,
  },
  Climate: {
    id: 'climate-energy-urbanization',
    name: 'Climate,	Energy,	and	Urbanization',
    logo: logoClimate,
  },
  Health: {
    id: 'one-health',
    name: 'One	Health',
    logo: logoHealth,
  },
  OpenKnowledge: {
    id: 'open-data-open-knowledge-infrastructure',
    name: 'Open Data, Open Knowledge, Infrastructure',
    logo: logoODOK,
  },
};

export const FocusAreasChallenges: GEOFocusAreaChallenges = {
  LandDegradation: {
    id: 'land-degradation',
    title: 'Land Degradation',
    description: 'Learn about soil erosion, overgrazing, and unsustainable farming.',
    tags: [FocusAreas.Agriculture, FocusAreas.Water],
    logo: GlobeAltIcon,
  },
  ClimateChange: {
    id: 'climate-change',
    title: 'Climate Change',
    description:
      'Explore mitigation strategies for rising temperatures and erratic weather patterns.',
    tags: [FocusAreas.Climate, FocusAreas.Weather],
    logo: CloudIcon,
  },
  LossBiodiversity: {
    id: 'loss-biodiversity',
    title: 'Loss of Biodiversity',
    description: 'Learn about efforts to protect wildlife and restore ecosystems.',
    tags: [FocusAreas.Health, FocusAreas.Ecosystem],
    logo: BugAntIcon,
  },
  IllegalMining: {
    id: 'illegal-mining',
    title: 'Illegal Mining',
    description: "Discover resources addressing the impacts of 'galamsey' on the environment.",
    tags: [FocusAreas.Water, FocusAreas.Ecosystem, FocusAreas.Health],
    logo: ExclamationTriangleIcon,
  },
  Deforestation: {
    id: 'deforestation',
    title: 'Deforestation',
    description: 'Understand deforestation trends and management strategies.',
    tags: [FocusAreas.Ecosystem, FocusAreas.Water],
    logo: ScissorsIcon,
  },
  Overfishing: {
    id: 'overfishing',
    title: 'Overfishing',
    description: 'Understand the consequences of unsustainable fishing practices on food security.',
    tags: [FocusAreas.Water, FocusAreas.Ecosystem, FocusAreas.Health],
    logo: PercentBadgeIcon,
  },
  Drought: {
    id: 'drought',
    title: 'Drought',
    description: 'Learn about resources for drought management and mitigation.',
    tags: [FocusAreas.Water, FocusAreas.Agriculture, FocusAreas.Weather],
    logo: ExclamationCircleIcon,
  },
  Flood: {
    id: 'flood',
    title: 'Flood',
    description: 'Explore resources related to flood risks and mitigation.',
    tags: [FocusAreas.Water, FocusAreas.Weather],
    logo: ExclamationTriangleIcon,
  },
  Pollution: {
    id: 'pollution',
    title: 'Pollution',
    description: 'Find resources to address air, water, and industrial pollution.',
    tags: [FocusAreas.Ecosystem, FocusAreas.Water, FocusAreas.Health],
    logo: ExclamationCircleIcon,
  },
};
