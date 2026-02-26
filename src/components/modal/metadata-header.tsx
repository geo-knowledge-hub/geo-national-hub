/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import type { MetadataFields } from './types';
import { formatDate } from './utils';

/**
 * Metadata header component.
 *
 * @param fields - Metadata fields.
 * @param fallbackTitle - Fallback title.
 * @returns Metadata header element.
 *
 * @component
 */
export function MetadataHeader({
  fields,
  fallbackTitle,
}: {
  fields: MetadataFields;
  fallbackTitle: string;
}) {
  // Get the creator names
  const creatorNames = fields.creators.map((c) => c.person_or_org.name);

  // Render!
  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-center gap-2">
        {/* Resource type title */}
        {fields.resourceTypeTitle && (
          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
            {fields.resourceTypeTitle}
          </span>
        )}

        {/* Publication date */}
        {fields.publicationDate && (
          <span className="text-sm text-gray-500">
            Published {formatDate(fields.publicationDate)}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
        {fields.title ?? fallbackTitle}
      </h2>

      {/* Creator names */}
      {creatorNames.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">{creatorNames.join(' · ')}</p>
      )}

      {/* Contact persons */}
      {fields.contactPersons.length > 0 && (
        <p className="mt-1 text-sm text-gray-500">
          <span className="font-medium">Contact persons:</span>{' '}
          {fields.contactPersons.map((c) => c.person_or_org.name).join(' · ')}
        </p>
      )}

      {/* Other contributors */}
      {fields.otherContributors.length > 0 && (
        <p className="mt-1 text-sm text-gray-500">
          <span className="font-medium">Others:</span>{' '}
          {fields.otherContributors.map((c) => c.person_or_org.name).join(' · ')}
        </p>
      )}
    </div>
  );
}
