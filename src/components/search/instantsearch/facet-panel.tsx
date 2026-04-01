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

import type { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';

import { InstantSearchFacetGroup } from './facet-group';

/**
 * Configuration for a single facet panel entry.
 */
export interface FacetConfig {
  /** Typesense field name to facet on */
  attribute: string;
  /** Human-readable title shown above the facet */
  title: string;
}

/**
 * Props for FacetPanel
 */
export interface FacetPanelProps {
  /** Array of facet configurations to render */
  facets: FacetConfig[];
  /** Transform lookup: attribute → transformItems function */
  transforms?: Record<string, (items: RefinementListItem[]) => RefinementListItem[]>;
}

/**
 * Renders all configured facets.
 *
 * @component
 */
export function FacetPanel({ facets, transforms = {} }: FacetPanelProps): JSX.Element {
  return (
    <>
      {facets.map((facet) => (
        <InstantSearchFacetGroup
          key={facet.attribute}
          attribute={facet.attribute}
          title={facet.title}
          transformItems={transforms[facet.attribute]}
        />
      ))}
    </>
  );
}
