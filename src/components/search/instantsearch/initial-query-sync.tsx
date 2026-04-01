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

import { useSearchBox } from 'react-instantsearch';

/**
 * Reads the initial query and pushes it into InstantSearch once on mount.
 *
 * @component
 */
export function InitialQuerySync({ initialQuery }: { initialQuery: string }): null {
  const { refine } = useSearchBox();
  const synced = useRef(false);

  useEffect(() => {
    if (!synced.current && initialQuery) {
      refine(initialQuery);
      synced.current = true;
    }
  }, [initialQuery, refine]);

  return null;
}
