/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';

import type { Country, CountryComponentConfig } from '@content-types/content';
import { componentRegistry } from '../registry/components';
import { renderComponent } from './hero-renderer';

/**
 * Props for the stakeholders renderer
 */
interface StakeholdersRendererProps {
  countryData: Country;
  componentConfigs?: CountryComponentConfig[];
  /** Override variant - used for live preview when hovering over options */
  overrideVariant?: string;
}

/**
 * Renders the appropriate stakeholders component based on country configuration.
 * Uses the component registry for dynamic rendering.
 *
 * @param {StakeholdersRendererProps} props - Renderer props.
 * @returns {JSX.Element} The rendered stakeholders component.
 */
export function renderStakeholdersComponent({
  countryData,
  componentConfigs,
  overrideVariant,
}: StakeholdersRendererProps): JSX.Element {
  const config = componentConfigs?.find((c) => c.componentId === 'stakeholders');

  const variantId =
    overrideVariant || config?.variantId || componentRegistry['stakeholders'].defaultVariant;

  const props = {
    partners: countryData.partners ?? [],
    countryTitle: countryData.title,
    ...config?.customProps,
  };

  const rendered = renderComponent({
    registryEntry: componentRegistry['stakeholders'],
    variantId,
    props,
  });

  if (!rendered) {
    return <div className="p-8 text-center text-gray-500">Stakeholders component not found</div>;
  }

  return rendered;
}
