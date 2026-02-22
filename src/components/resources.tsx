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

import Link from 'next/link';

import type { Resource } from '@content-types/content';

/**
 * Properties of the ResourceActions component.
 */
interface ResourceActionsProps {
  /** The resource to display actions for. */
  resource: Resource;
  /** Whether the GKH is online. */
  gkhOnline?: boolean;
  /** Callback to open the overview modal. */
  onOpenOverview?: () => void;
  /** Callback to open the metadata modal. */
  onOpenMetadata?: () => void;
  /** Class name for the link. */
  linkClassName?: string;
  /** Class name for the button. */
  buttonClassName?: string;
}

/**
 * Default class name for the link.
 */
const defaultLinkClassName =
  'text-sm font-medium text-gray-700 transition focus:outline-none hover:text-gray-900';

/**
 * Default class name for the button.
 */
const defaultButtonClassName =
  'cursor-pointer text-sm font-medium text-gray-700 transition focus:outline-none hover:text-gray-900';

/**
 * Reusable action row for a resource: Overview + Access / View metadata / Unavailable.
 * When GKH is offline and the resource is from GKH, shows "View metadata" if sync metadata exists, else "Unavailable".
 *
 * @component
 */
export function ResourceActions({
  resource,
  gkhOnline = true,
  onOpenOverview,
  onOpenMetadata,
  linkClassName = defaultLinkClassName,
  buttonClassName = defaultButtonClassName,
}: ResourceActionsProps): JSX.Element {
  // Check if the resource is from the GKH.
  const isGkhSource = resource.source === 'geo-knowledge-hub';

  // Check if the resource has sync metadata.
  const hasSyncMetadata = !!resource.sync?.metadata;

  // Check if the resource should show access.
  const showAccess = gkhOnline || !isGkhSource;

  // Check if the resource should show view metadata.
  const showViewMetadata = !showAccess && hasSyncMetadata;

  // Render
  return (
    <div className="mt-4 flex items-center gap-4">
      {/* Overview button */}
      {resource.overview && onOpenOverview && (
        <button onClick={onOpenOverview} type="button" className={buttonClassName}>
          Overview
        </button>
      )}
      {/* Access link */}
      {showAccess ? (
        <Link
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          Access →
        </Link>
      ) : showViewMetadata && onOpenMetadata ? (
        // View metadata button
        <button onClick={onOpenMetadata} type="button" className={buttonClassName}>
          View metadata
        </button>
      ) : (
        // Unavailable span
        <span className="text-sm text-gray-400">Unavailable</span>
      )}
    </div>
  );
}
