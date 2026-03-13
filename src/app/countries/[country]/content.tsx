/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, ReactNode, Suspense, useEffect, useMemo } from 'react';

import { useEditMode } from './context/edit-mode';
import { useTheme } from './context/theme-context';
import { componentRegistry } from './registry/components';
import { renderHeroComponent } from './utils/hero-renderer';
import { renderCapacityBuildingComponent } from './utils/capacity-building-renderer';
import { renderStakeholdersComponent } from './utils/stakeholders-renderer';
import { getAvailableSections, getAvailableSectionIds } from './utils/sections';
import { getOrderedSectionIds, type SectionId } from './utils/section-order';

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
  const { componentConfigs, previewVariant, setAvailableSectionIds } = useEditMode();
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
  const quickAccessSections = getAvailableSections(
    countryData,
    hasResources,
    activeComponentConfigs,
  );

  // Compute which section IDs are available (have data) for the layout panel
  const computedAvailableSectionIds = useMemo<SectionId[]>(
    () => getAvailableSectionIds(countryData, hasResources),
    [countryData, hasResources],
  );

  // Keep context in sync with available sections
  useEffect(() => {
    setAvailableSectionIds(computedAvailableSectionIds);
  }, [computedAvailableSectionIds, setAvailableSectionIds]);

  // Get theme primary color for sticky nav
  const primaryColor = effectiveTheme?.primary_color || '#526479';

  // Get section order from configs
  const sectionOrder = getOrderedSectionIds(activeComponentConfigs);

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

  /**
   * Renders a section by its ID. Returns null if the section has no data.
   */
  function renderSection(sectionId: SectionId): ReactNode {
    switch (sectionId) {
      case 'explore':
        return hasResources ? (
          <GEOFocusAreaSection
            countryData={countryData}
            focusAreas={focusAreas}
            challenges={challenges}
            resources={resources}
          />
        ) : null;

      case 'mechanisms':
        return countryData.mechanisms?.length > 0 ? (
          <EnablingMechanisms countryData={countryData} />
        ) : null;

      case 'capacity-building':
        return countryData.capacity_building_activities?.length > 0 ? (
          <EditableSection
            componentId="capacity-building"
            componentName="Capacity Building"
            componentRegistry={componentRegistry['capacity-building']}
          >
            {capacityBuildingComponent}
          </EditableSection>
        ) : null;

      case 'community':
        return countryData.community_of_practice ? (
          <CommunityOfPracticeSection countryData={countryData} />
        ) : null;

      case 'stakeholders':
        return (countryData.partners?.length ?? 0) > 0 ? (
          <EditableSection
            componentId="stakeholders"
            componentName="Stakeholders"
            componentRegistry={componentRegistry['stakeholders']}
          >
            {stakeholdersComponent}
          </EditableSection>
        ) : null;

      case 'representatives':
        return countryData.representatives?.length > 0 ? (
          <KeyRepresentativesSection countryData={countryData} />
        ) : null;

      case 'marketplace':
        return (countryData.marketplace?.businesses?.length ?? 0) > 0 ? (
          <MarketplaceSection countryId={countryId} countryData={countryData} />
        ) : null;

      default:
        return null;
    }
  }

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

        {/* Dynamic section rendering based on configured order */}
        {sectionOrder.map((id) => {
          const section = renderSection(id);
          return section ? <React.Fragment key={id}>{section}</React.Fragment> : null;
        })}

        {/* Bottom spacing to ensure last section can be scrolled to properly */}
        <div className="h-28" aria-hidden="true" />
      </div>
    </div>
  );
}
