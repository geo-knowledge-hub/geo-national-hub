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
import { renderCapacityBuildingComponent } from './utils/capacity-building-renderer';
import { renderStakeholdersComponent } from './utils/stakeholders-renderer';
import { getAvailableSections } from './utils/sections';

import type { Country, Resource, FocusArea, FocusAreaChallenge } from '@content-types/content';

import {
  EditableSection,
  EditModeToggle,
  GEOFocusAreaSection,
  CommunityOfPracticeSection,
  MarketplaceSection,
  KeyRepresentativesSection,
  EnablingMechanisms,
  StickyNavBar,
  FeedbackWidget,
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

  // Get preview variant for capacity building if it's being previewed
  const cbPreviewVariant =
    previewVariant?.componentId === 'capacity-building' ? previewVariant.variantId : undefined;

  // Get preview variant for stakeholders if it's being previewed
  const stakeholdersPreviewVariant =
    previewVariant?.componentId === 'stakeholders' ? previewVariant.variantId : undefined;

  // Calculate available sections for quick access navigation
  const hasResources = resources.length > 0;
  const quickAccessSections = getAvailableSections(countryData, hasResources);

  // Get theme primary color for sticky nav
  const primaryColor = effectiveTheme?.primary_color || '#526479';

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

  const capacityBuildingComponent = renderCapacityBuildingComponent({
    countryId,
    countryTitle: countryData.title,
    activities: countryData.capacity_building_activities,
    componentConfigs: activeComponentConfigs,
    overrideVariant: cbPreviewVariant,
  });

  const stakeholdersComponent = renderStakeholdersComponent({
    countryData,
    componentConfigs: activeComponentConfigs,
    overrideVariant: stakeholdersPreviewVariant,
  });

  return (
    <div className="relative -mt-24 min-h-screen pt-24">
      {/* Feedback widget */}
      <FeedbackWidget feedbackUrl={countryData.feedback_url} countryName={countryData.title} />

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

        {/* Quick Access Navigation Bar */}
        <StickyNavBar sections={quickAccessSections} primaryColor={primaryColor} />

        {/* GEO Focus Areas section */}
        <GEOFocusAreaSection
          countryData={countryData}
          focusAreas={focusAreas}
          challenges={challenges}
          resources={resources}
        />

        {/* Enabling mechanisms */}
        <EnablingMechanisms countryData={countryData} />

        {/* Community of practice section */}
        <CommunityOfPracticeSection countryData={countryData} />

        {/* Capacity building activities in the country */}
        {countryData.capacity_building_activities?.length > 0 && (
          <EditableSection
            componentId="capacity-building"
            componentName="Capacity Building"
            componentRegistry={componentRegistry['capacity-building']}
          >
            {capacityBuildingComponent}
          </EditableSection>
        )}

        {/* GEO Partners / Stakeholders in the country */}
        {(countryData.partners?.length ?? 0) > 0 && (
          <EditableSection
            componentId="stakeholders"
            componentName="Stakeholders"
            componentRegistry={componentRegistry['stakeholders']}
          >
            {stakeholdersComponent}
          </EditableSection>
        )}

        {/* Key GEO representatives in the country */}
        <KeyRepresentativesSection countryData={countryData} />

        {/* Marketplace section */}
        <MarketplaceSection countryId={countryId} countryData={countryData} />

        {/* Bottom spacing to ensure last section can be scrolled to properly */}
        <div className="h-28" aria-hidden="true" />
      </div>
    </div>
  );
}
