/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX } from 'react';

import type { Country } from '@content-types/content';

import { renderCapacityBuildingComponent } from '../../utils/capacity-building-renderer';
import { CapacityBuildingSection } from './components';

/**
 * Properties expected for the CapacityBuildingPageContent component.
 */
interface CapacityBuildingPageContentProps {
  countryData: Country;
}

/**
 * CapacityBuildingPageContent Component - Client component for capacity building page
 *
 * @component
 * @param {CapacityBuildingPageContentProps} props - Component props.
 * @returns {JSX.Element} The rendered CapacityBuildingPageContent component.
 */
export function CapacityBuildingPageContent({
  countryData,
}: CapacityBuildingPageContentProps): JSX.Element {
  // Render the user-configured capacity building variant
  const heroContent = renderCapacityBuildingComponent({
    countryId: countryData.id,
    countryTitle: countryData.title,
    activities: countryData.capacity_building_activities,
    componentConfigs: countryData.component_configs,
    showExploreLink: false,
  });

  return (
    <div className="relative -mt-24 min-h-screen pt-24">
      <CapacityBuildingSection countryData={countryData} heroContent={heroContent} />
    </div>
  );
}
