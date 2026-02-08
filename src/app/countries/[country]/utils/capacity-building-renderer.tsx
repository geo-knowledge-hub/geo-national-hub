/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';

import type { CountryComponentConfig, CapacityBuildingActivity } from '@content-types/content';
import { componentRegistry } from '../registry/components';
import { renderComponent } from './hero-renderer';

/**
 * Props for the capacity building renderer
 */
interface CapacityBuildingRendererProps {
  countryId: string;
  countryTitle: string;
  activities: CapacityBuildingActivity[];
  componentConfigs?: CountryComponentConfig[];
  /** Override variant - used for live preview when hovering over options */
  overrideVariant?: string;
  /** Whether to show the "Explore Activities" link. Defaults to true. */
  showExploreLink?: boolean;
}

/**
 * Renders the appropriate capacity building component based on country configuration.
 * Uses the component registry for dynamic rendering.
 *
 * @param {CapacityBuildingRendererProps} props - Renderer props.
 * @returns {JSX.Element} The rendered capacity building component.
 */
export function renderCapacityBuildingComponent({
  countryId,
  countryTitle,
  activities,
  componentConfigs,
  overrideVariant,
  showExploreLink = true,
}: CapacityBuildingRendererProps): JSX.Element {
  // Get capacity building config from country configuration
  const cbConfig = componentConfigs?.find((c) => c.componentId === 'capacity-building');

  // Override variant takes precedence (used for live preview)
  const variantId =
    overrideVariant || cbConfig?.variantId || componentRegistry['capacity-building'].defaultVariant;

  // Build props for the capacity building component
  const cbProps = {
    countryId,
    countryTitle,
    activities,
    showExploreLink,
    // Include any custom props from configuration
    ...cbConfig?.customProps,
  };

  // Use the generic renderer
  const rendered = renderComponent({
    registryEntry: componentRegistry['capacity-building'],
    variantId,
    props: cbProps,
  });

  // Fallback in case rendering fails
  if (!rendered) {
    return (
      <div className="p-8 text-center text-gray-500">Capacity building component not found</div>
    );
  }

  return rendered;
}
