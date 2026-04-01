/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import type { Resource } from '@content-types/content';
import { formatDate } from './utils';

/**
 * Metadata header component.
 *
 * Renders the resource type badge, publication date, title, and creators.
 *
 * @param resource - The resource to display.
 * @param fallbackTitle - Fallback title when resource.name is empty.
 *
 * @component
 */
export function MetadataHeader({
  resource,
  fallbackTitle,
}: {
  resource: Resource;
  fallbackTitle: string;
}) {
  const creatorNames = (resource.creators ?? []).map((c) => c.person_or_org.name);

  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-center gap-2">
        {/* Resource type title */}
        {resource.resource_type?.name && (
          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
            {resource.resource_type.name}
          </span>
        )}

        {/* Publication date */}
        {resource.publication_date && (
          <span className="text-sm text-gray-500">
            Published {formatDate(resource.publication_date)}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
        {resource.name || fallbackTitle}
      </h2>

      {/* Creator names */}
      {creatorNames.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">{creatorNames.join(' · ')}</p>
      )}
    </div>
  );
}
