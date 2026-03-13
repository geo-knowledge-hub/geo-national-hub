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
import { saveCountryConfig } from '@lib/api/admin';
import { getOrderedSectionIds, SECTION_LABELS, type SectionId } from '../utils/section-order';

interface EditLayoutPanelProps {
  onClose: () => void;
  availableSectionIds: SectionId[];
}

/**
 * Floating panel for reordering page sections
 */
export function EditLayoutPanel({ onClose, availableSectionIds }: EditLayoutPanelProps) {
  // State - Component configs, set component configs, country id, set is editing layout
  const { componentConfigs, setComponentConfigs, countryId, setIsEditingLayout } = useEditMode();

  // Get the current order of the sections
  const configs = componentConfigs.length > 0 ? componentConfigs : undefined;
  const availableSet = new Set<SectionId>(availableSectionIds);
  const currentOrder = getOrderedSectionIds(configs).filter((id) => availableSet.has(id));

  // State - Section order, is saving, show success
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(currentOrder);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Function - Move a section up or down
  function moveSection(index: number, direction: 'up' | 'down') {
    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newOrder.length) {
      return;
    }

    // Swap the sections
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];

    setSectionOrder(newOrder);
  }

  // Function - Close the panel
  function close() {
    setIsEditingLayout(false);
    onClose();
  }

  // Function - Build the component configs
  function buildConfigs(order: SectionId[]) {
    // Create a set of reordered section ids
    const reorderedIds = new Set<string>(order);

    // Map the section ids to the component configs
    const reordered = order.map((sectionId, index) => {
      const existing = componentConfigs.find((c) => c.componentId === sectionId);

      // Return the component config
      return {
        componentId: sectionId,
        variantId: existing?.variantId || 'default',
        enabled: existing?.enabled ?? true,
        order: index,
      };
    });

    // Filter the component configs to remove the reordered section ids
    const preserved = componentConfigs.filter((c) => !reorderedIds.has(c.componentId));

    // Return the component configs
    return [...preserved, ...reordered];
  }

  // Function - Handle apply
  async function handleApply() {
    if (!countryId) {
      alert('Country ID is required');
      return;
    }

    setIsSaving(true);

    try {
      const finalConfigs = buildConfigs(sectionOrder);

      await saveCountryConfig(countryId, finalConfigs);
      setComponentConfigs(finalConfigs);

      setShowSuccess(true);
      setTimeout(() => {
        close();
        setShowSuccess(false);
      }, 800);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save layout');
    } finally {
      setIsSaving(false);
    }
  }

  const hasChanges = JSON.stringify(sectionOrder) !== JSON.stringify(currentOrder);

  return (
    <div className="glass-panel fixed top-1/2 right-6 z-[100] w-80 -translate-y-1/2">
      {/* Header */}
      <div className="border-b border-gray-200/50 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Page Layout</h3>
            <p className="mt-0.5 text-xs text-gray-500">Reorder page sections</p>
          </div>
          <button
            onClick={close}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100/80 hover:text-gray-600"
            aria-label="Close"
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
      </div>

      {/* Section List */}
      <div className="max-h-[50vh] overflow-y-auto p-3">
        <div className="space-y-1.5">
          {sectionOrder.map((sectionId, index) => (
            <div
              key={sectionId}
              className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white/60 px-3 py-2.5"
            >
              {/* Grip icon */}
              <svg
                className="h-4 w-4 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="9" cy="6" r="1.5" />
                <circle cx="15" cy="6" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="9" cy="18" r="1.5" />
                <circle cx="15" cy="18" r="1.5" />
              </svg>

              {/* Section name */}
              <span className="flex-1 text-sm font-medium text-gray-700">
                {SECTION_LABELS[sectionId]}
              </span>

              {/* Move buttons */}
              <div className="flex gap-0.5">
                <button
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={`Move ${SECTION_LABELS[sectionId]} up`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sectionOrder.length - 1}
                  className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={`Move ${SECTION_LABELS[sectionId]} down`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200/50 px-4 py-3">
        {showSuccess ? (
          <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-green-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Applied successfully!
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={close}
              className="glass-button flex-1 px-3 py-2 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={isSaving || !hasChanges}
              className="themed-bg flex-1 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Applying...' : 'Apply'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
