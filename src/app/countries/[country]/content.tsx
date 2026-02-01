/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, Suspense } from 'react';

import { useEditMode } from './context/edit-mode';
import { useTheme } from './context/theme-context';
import { componentRegistry } from './registry/components';
import { renderHeroComponent } from './utils/hero-renderer';

import type { Country, Resource, FocusArea, FocusAreaChallenge } from '@content-types/content';

import {
  EditableSection,
  EditModeToggle,
  GEOFocusAreaSection,
  CapacityBuildingSection,
  PartnersSection,
  CommunityOfPracticeSection,
  KeyRepresentativesSection,
  EnablingMechanisms,
} from './components';

/**
 * Properties expected for the CountryPageContent component.
 */
interface CountryPageContentProps {
  countryId: string;
  countryData: Country;
  resources: Resource[];
  focusAreas: FocusArea[];
  challenges: FocusAreaChallenge[];
}

/**
 * CountryPageContent Component - Client component for country page
 *
 * @component
 * @param {CountryPageContentProps} props - Component props.
 * @returns {JSX.Element} The rendered CountryPageContent component.
 */
export function CountryPageContent({
  countryId,
  countryData,
  resources,
  focusAreas,
  challenges,
}: CountryPageContentProps): JSX.Element {
  const { componentConfigs, previewVariant } = useEditMode();
  const { getEffectiveTheme } = useTheme();

  // Get the effective theme (preview > saved > default)
  const effectiveTheme = getEffectiveTheme();

  // Use context values if available (from edit mode), otherwise use country data
  const activeComponentConfigs = componentConfigs.length > 0 ? componentConfigs : undefined;

  // Get preview variant for hero if it's being previewed
  const heroPreviewVariant =
    previewVariant?.componentId === 'hero' ? previewVariant.variantId : undefined;

  // Render hero based on configuration or preview variant
  // The overrideVariant takes precedence when user is hovering over options
  const heroComponent = renderHeroComponent({
    countryId,
    title: `${countryData.title} Knowledge Hub`,
    description: `Discover the EO solutions available in ${countryData.title}`,
    imageSrc: countryData.flag,
    imageAlt: `${countryData.title} flag`,
    componentConfigs: activeComponentConfigs,
    theme: effectiveTheme,
    overrideVariant: heroPreviewVariant,
    managedBy: countryData.managed_by?.name,
    managedByLink: countryData.managed_by?.url,
  });

  return (
    <div className="relative -mt-24 -ml-[calc(50vw-50%)] min-h-screen w-screen pt-24">
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <Suspense fallback={null}>
          <EditModeToggle
            countryId={countryId}
            countryTheme={countryData.theme}
            componentConfig={countryData.component_configs}
          />
        </Suspense>

        <EditableSection
          componentId="hero"
          componentName="Hero Section"
          componentRegistry={componentRegistry.hero}
        >
          {heroComponent}
        </EditableSection>

        {/* GEO Focus Areas section */}
        <GEOFocusAreaSection
          countryData={countryData}
          focusAreas={focusAreas}
          challenges={challenges}
          resources={resources}
        />

        {/* GEO Partners in the country */}
        <PartnersSection countryData={countryData} />

        {/* Enabling mechanisms */}
        <EnablingMechanisms countryData={countryData} />

        {/* Community of practice section */}
        <CommunityOfPracticeSection countryData={countryData} />

        {/* Capacity building activities in the country */}
        <CapacityBuildingSection countryData={countryData} />

        {/* Key GEO representatives in the country */}
        <KeyRepresentativesSection countryData={countryData} />
      </div>
    </div>
  );
}
