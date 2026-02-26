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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@ui/dialog';

import type { ResourceOverviewDialogProps } from './types';

/**
 * Resource overview dialog.
 *
 * @param open - Whether the dialog is visible.
 * @param onClose - Called when the dialog is dismissed.
 * @param data - Resource data to display.
 *
 * @returns The rendered dialog or null when closed.
 *
 * @component
 */
export function ResourceOverviewDialog({
  open,
  onClose,
  data,
}: ResourceOverviewDialogProps): JSX.Element {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">{data.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Overview details for {data.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 text-sm text-gray-800 md:grid-cols-2">
          {/* Name */}
          <div>
            <h4 className="mb-1 font-semibold text-gray-700">Name</h4>
            <p>{data.name}</p>
          </div>

          {/* License */}
          <div>
            <h4 className="mb-1 font-semibold text-gray-700">License</h4>
            <p>{data.license || 'Not specified'}</p>
          </div>

          {/* Overview */}
          <div className="md:col-span-2">
            <h4 className="mb-1 font-semibold text-gray-700">Overview</h4>
            <p>{data.overview || 'Not specified'}</p>
          </div>

          {/* Contributors */}
          <div>
            <h4 className="mb-1 font-semibold text-gray-700">Contributors</h4>
            <p>{data.contributors?.join(', ') || 'Not specified'}</p>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="mb-1 font-semibold text-gray-700">Subjects</h4>
            <p>{data.subjects || 'Not specified'}</p>
          </div>

          {/* Associated GEO Work Programme Activity */}
          <div>
            <h4 className="mb-1 font-semibold text-gray-700">
              Associated GEO Work Programme Activity
            </h4>
            <p>{data.geo_gwp || 'Not specified'}</p>
          </div>

          {/* Target Audience */}
          <div>
            <h4 className="mb-1 font-semibold text-gray-700">Target Audience</h4>
            <p>{data.target_audiences?.join(', ') || 'Not specified'}</p>
          </div>

          {/* SDGs / GEO Focus Areas */}
          <div className="md:col-span-2">
            <h4 className="mb-1 font-semibold text-gray-700">SDGs / GEO Focus Areas</h4>
            <div className="mt-2 flex flex-wrap gap-4">
              {data.geo_themes
                ? data.geo_themes.map((theme, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span>{theme}</span>
                    </div>
                  ))
                : 'Not specified'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
