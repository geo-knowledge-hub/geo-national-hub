/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import { useEffect, useRef } from 'react';

import { useRefinementList } from 'react-instantsearch';

/**
 * Props for InitialRefinementSync
 */
export interface InitialRefinementSyncProps {
  /** Typesense field to refine */
  attribute: string;
  /** Values to refine on mount */
  values: string[];
}

/**
 * Pre-selects facet values on mount.
 *
 * @component
 */
export function InitialRefinementSync({ attribute, values }: InitialRefinementSyncProps): null {
  const { refine } = useRefinementList({ attribute, limit: 50 });
  const synced = useRef(false);

  useEffect(() => {

    // If the values are not synced and there are values, refine the values
    if (!synced.current && values.length > 0) {
      values.forEach((v) => refine(v));
      synced.current = true;
    }

  }, [values, refine]);

  return null;
}
