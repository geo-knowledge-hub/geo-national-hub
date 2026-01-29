/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState } from 'react';

import { useEditMode } from '../context/edit-mode';
import { ComponentRegistryEntry } from '../types/component-registry';
import { EditVariantPanel } from './edit-variant-panel';

interface EditableSectionProps {
  componentId: string;
  componentName: string;
  componentRegistry: ComponentRegistryEntry;
  children: React.ReactNode;
}

/**
 * Wraps a component section to make it editable in edit mode
 * Shows hover controls and floating variant selector panel
 * The actual page updates in real-time as user hovers over variants (Stripe-like UX)
 */
export function EditableSection({
  componentId,
  componentName,
  componentRegistry,
  children,
}: EditableSectionProps) {
  const { isEditMode, editingComponent, setEditingComponent } = useEditMode();
  const [isHovered, setIsHovered] = useState(false);

  if (!isEditMode) {
    return <>{children}</>;
  }

  const isEditing = editingComponent === componentId;
  const showControls = isHovered || isEditing;

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Edit Controls Overlay */}
        {showControls && (
          <div className="absolute inset-x-0 top-0 z-50 flex items-start justify-between p-4">
            {/* Component Label */}
            <div className="rounded-lg border border-white/80 bg-white/95 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-md backdrop-blur-sm">
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: isEditing ? '#22c55e' : '#526479' }}
                />
                {componentName}
              </span>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setEditingComponent(componentId)}
                className="group flex items-center gap-2 rounded-lg border border-white/80 bg-white/95 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
              >
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Customize
              </button>
            )}

            {/* Currently Editing Indicator */}
            {isEditing && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50/95 px-4 py-2 text-sm font-medium text-green-700 shadow-lg backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Editing...
              </div>
            )}
          </div>
        )}

        {/* Highlight Border */}
        {showControls && (
          <div
            className={`pointer-events-none absolute inset-0 rounded-lg border-2 border-dashed transition-colors ${
              isEditing ? 'border-green-400 bg-green-50/10' : 'border-[#526479]/50 bg-[#5264790a]'
            }`}
          />
        )}

        {/* Component Content */}
        {children}
      </div>

      {/* Floating variant selector panel */}
      {isEditing && (
        <EditVariantPanel component={componentRegistry} onClose={() => setEditingComponent(null)} />
      )}
    </>
  );
}
