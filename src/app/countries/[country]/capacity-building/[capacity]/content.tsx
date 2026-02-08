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

import Image from 'next/image';

import { BackButton } from '@components/global';

import type { Country } from '@content-types/content';

import { useTheme } from '../../context/theme-context';
import { useEditMode } from '../../context/edit-mode';
import { componentRegistry } from '../../registry/components';
import { renderCapacityBuildingComponent } from '../../utils/capacity-building-renderer';
import { EditableSection } from '../../components';
import { CapacityBuildingSection } from './components';

import imageCapacityBuildingConcept from '@public/content/concepts/capacity-building/concept.svg';

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
  const { theme } = useTheme();
  const { componentConfigs, previewVariant } = useEditMode();
  const activeComponentConfigs = componentConfigs.length > 0 ? componentConfigs : undefined;

  // Get preview variant for capacity building if it's being previewed
  const cbPreviewVariant =
    previewVariant?.componentId === 'capacity-building' ? previewVariant.variantId : undefined;

  // Define hero component
  const capacityBuildingComponent = renderCapacityBuildingComponent({
    countryId: countryData.id,
    countryTitle: countryData.title,
    activities: countryData.capacity_building_activities,
    componentConfigs: activeComponentConfigs,
    overrideVariant: cbPreviewVariant,
    showExploreLink: false,
  });

  return (
    <div className="relative -mt-24 min-h-screen pt-24">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <BackButton variant="hero" accentColor={theme.primary_color} />
        </div>

        {/* Customizable capacity building hero section */}
        {countryData.capacity_building_activities?.length > 0 && (
          <EditableSection
            componentId="capacity-building"
            componentName="Capacity Building"
            componentRegistry={componentRegistry['capacity-building']}
          >
            {capacityBuildingComponent}
          </EditableSection>
        )}

        {/* Activities list */}
        <CapacityBuildingSection countryData={countryData} />
      </div>
    </div>
  );
}
