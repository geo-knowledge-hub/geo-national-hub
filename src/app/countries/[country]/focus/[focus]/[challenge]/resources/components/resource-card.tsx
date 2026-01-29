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

import { ResourceMetadataModal } from '@components/global';

import type { Resource } from '@content-types/content';
import { getAssetPath } from '@lib/utils';

/**
 * Properties of the ResourceCardProps component.
 */
interface ResourceCardProps {
  resource: Resource;
}

/**
 * ResourceCard Component
 *
 * @component
 * @param {ResourceCardProps} params Component params.
 * @returns {JSX.Element} The rendered ResourceCard component.
 */
export function ResourceCard({ resource }: ResourceCardProps): JSX.Element {
  /**
   * State to manage the metadata modal.
   */
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="glass-card group flex items-center justify-between p-6">
        <div className="flex-1 space-y-3">
          <div className="mb-2 flex items-center space-x-2 text-sm">
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
          <p className="mt-1 text-sm text-gray-600">{resource.description}</p>

          <div className="mt-4 flex items-center gap-4">
            {resource.overview && (
              <button
                onClick={() => setIsOpen(true)}
                className="cursor-pointer text-sm font-medium text-gray-700 transition hover:text-gray-900 focus:outline-none"
              >
                Overview
              </button>
            )}
            <Link
              href={resource.link}
              target="_blank"
              className="text-sm font-medium text-gray-700 transition hover:text-gray-900 focus:outline-none"
            >
              Access →
            </Link>
          </div>
        </div>
        <div className="rounded-md bg-gray-100 p-5 transition group-hover:bg-gray-200/80">
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

      <ResourceMetadataModal open={isOpen} onClose={() => setIsOpen(false)} data={resource} />
    </>
  );
}
