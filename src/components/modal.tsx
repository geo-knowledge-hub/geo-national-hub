/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';
import { Resource } from '@data/content/resources';

/**
 * Define the properties for the ``ResourceMetadataModal`` component.
 */
interface ResourceMetadataModalProps {
  open: boolean;
  onClose: () => void;
  data: Resource;
}

/**
 * Resource metadata modal component.
 *
 * @component
 * @param {ResourceMetadataModalProps} props - Component props.
 * @param {boolean} props.open - Variable to control if the modal is open or closed.
 * @param {Function} props.onClose - Function called when modal is closed.
 * @param {Resource} props.data - Modal content.
 * @returns {JSX.Element} The rendered Badge component.
 */
export const ResourceMetadataModal: React.FC<ResourceMetadataModalProps> = ({
  open,
  onClose,
  data,
}: ResourceMetadataModalProps): JSX.Element | null => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative mx-auto max-h-full w-full max-w-4xl">
        <div className="relative rounded-lg bg-white p-6 shadow md:p-8">
          <div className="mb-6 flex items-start justify-between">
            <h3 className="text-2xl font-semibold text-gray-900">Overview - {data.name}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 text-sm text-gray-800 md:grid-cols-2">
            <div>
              <h4 className="mb-1 font-semibold text-gray-700">Name</h4>
              <p>{data.name}</p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-gray-700">License</h4>
              <p>{data.license || 'Not specified'}</p>
            </div>

            <div className="md:col-span-2">
              <h4 className="mb-1 font-semibold text-gray-700">Overview</h4>
              <p>{data.overview}</p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-gray-700">Contributors</h4>
              <p>
                {data?.contributors !== undefined ? (
                  <>{data?.contributors.join(',')}</>
                ) : (
                  'Not specified'
                )}{' '}
              </p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-gray-700">Subjects</h4>
              <p>{data.subjects || 'Not specified'}</p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-gray-700">
                Associated GEO Work Programme Activity
              </h4>
              <p>{data.geoGWP || 'Not specified'}</p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-gray-700">Target Audience</h4>
              <p>
                {data?.targetAudiences !== undefined ? (
                  <>{data?.targetAudiences.join(', ')}</>
                ) : (
                  'Not specified'
                )}
              </p>
            </div>

            <div className="md:col-span-2">
              <h4 className="mb-1 font-semibold text-gray-700">SDGs / GEO Focus Areas</h4>
              <div className="mt-2 flex flex-wrap gap-4">
                {data?.geoThemes
                  ? data.geoThemes.map((theme, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span>{theme}</span>
                      </div>
                    ))
                  : 'Not specified'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
