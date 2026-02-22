/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, JSX } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { ResourceOverviewModal, GkhMetadataModal, ResourceActions } from '@components/global';

import type { Resource } from '@content-types/content';
import { getAssetPath } from '@lib/utils';

/**
 * Properties of the ResourceCardProps component.
 */
interface ResourceCardProps {
  resource: Resource;
  gkhOnline?: boolean;
}

/**
 * ResourceCard Component
 *
 * @component
 * @param {ResourceCardProps} params Component params.
 * @returns {JSX.Element} The rendered ResourceCard component.
 */
export function ResourceCard({ resource, gkhOnline = true }: ResourceCardProps): JSX.Element {
  /**
   * State to manage the metadata modal.
   */
  const [isOpen, setIsOpen] = useState(false);
  const [showSyncMetadata, setShowSyncMetadata] = useState(false);

  return (
    <>
      <div className="glass-card group flex items-center justify-between p-6">
        <div className="flex-1 space-y-3">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
              Open
            </span>
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
              {resource.uploaded}
            </span>
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
              {resource.type}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            <Link href={resource.link} target="_blank">
              {resource.name}
            </Link>
          </h3>

          <p className="mt-1 line-clamp-3 text-sm text-gray-600">{resource.description}</p>

          <ResourceActions
            resource={resource}
            gkhOnline={gkhOnline}
            onOpenOverview={() => setIsOpen(true)}
            onOpenMetadata={() => setShowSyncMetadata(true)}
            linkClassName="themed-link text-sm font-medium text-gray-700 transition focus:outline-none"
            buttonClassName="themed-link cursor-pointer text-sm font-medium text-gray-700 transition focus:outline-none"
          />
        </div>
        <div className="hidden rounded-md bg-gray-100 p-5 transition group-hover:bg-gray-200/80 md:block">
          {resource.icon && (
            <Image
              src={getAssetPath(resource.icon)}
              alt="Resource icon"
              width={24}
              height={24}
              className="flex h-6 w-6 items-center justify-center rounded-lg"
            />
          )}
        </div>
      </div>

      {/* Resource overview modal */}
      <ResourceOverviewModal open={isOpen} onClose={() => setIsOpen(false)} data={resource} />

      {/* GKH metadata modal */}
      {resource.sync?.metadata && (
        <GkhMetadataModal
          open={showSyncMetadata}
          onClose={() => setShowSyncMetadata(false)}
          data={resource}
          syncMetadata={resource.sync.metadata}
        />
      )}
    </>
  );
}
