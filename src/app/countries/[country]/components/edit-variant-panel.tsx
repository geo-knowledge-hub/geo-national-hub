/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect } from 'react';

import { ComponentRegistryEntry } from '../types/component-registry';
import { useEditMode } from '../context/edit-mode';
import { useTheme } from '../context/theme-context';
import { saveCountryConfig } from '@lib/api/admin';

interface EditVariantPanelProps {
  component: ComponentRegistryEntry;
  onClose: () => void;
}

/**
 * Floating panel for selecting component variants
 * Hovering over variants updates the actual page in real-time
 * This creates a Stripe-like live editing experience
 */
export function EditVariantPanel({ component, onClose }: EditVariantPanelProps) {
  const {
    componentConfigs,
    setComponentConfigs,
    setPreviewVariant,
    countryId,
    setEditingComponent,
  } = useEditMode();

  // Get theme from ThemeContext
  const { theme } = useTheme();

  const currentConfig = componentConfigs.find((c) => c.componentId === component.componentId);
  const savedVariant = currentConfig?.variantId || component.defaultVariant;
  const [selectedVariant, setSelectedVariant] = useState(savedVariant);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Clear preview when component unmounts
  useEffect(() => {
    return () => {
      setPreviewVariant(null);
    };
  }, [setPreviewVariant]);

  // Handle hovering over a variant - updates the actual page in real-time
  function handleVariantHover(variantId: string) {
    setPreviewVariant({
      componentId: component.componentId,
      variantId,
    });
  }

  // Clear preview when mouse leaves the variant options
  function handleVariantLeave() {
    // If user has selected a variant, keep showing it
    if (selectedVariant !== savedVariant) {
      setPreviewVariant({
        componentId: component.componentId,
        variantId: selectedVariant,
      });
    } else {
      setPreviewVariant(null);
    }
  }

  // Handle selecting a variant (click)
  function handleVariantSelect(variantId: string) {
    setSelectedVariant(variantId);
    setPreviewVariant({
      componentId: component.componentId,
      variantId,
    });
  }

  // Handle cancel - revert to saved state
  function handleCancel() {
    setPreviewVariant(null);
    setEditingComponent(null);
    onClose();
  }

  // Handle apply - save the selected variant
  async function handleApply() {
    if (!countryId) {
      alert('Country ID is required');
      return;
    }

    setIsSaving(true);

    try {
      const updatedConfigs = currentConfig
        ? componentConfigs.map((c) =>
            c.componentId === component.componentId ? { ...c, variantId: selectedVariant } : c,
          )
        : [
            ...componentConfigs,
            {
              componentId: component.componentId,
              variantId: selectedVariant,
              enabled: true,
              order: componentConfigs.length,
            },
          ];

      // Save using the new API client
      await saveCountryConfig(countryId, updatedConfigs);

      // Update local state on success
      setComponentConfigs(updatedConfigs);
      setPreviewVariant(null); // Clear preview, saved config takes over
      setShowSuccess(true);
      setTimeout(() => {
        setEditingComponent(null);
        onClose();
        setShowSuccess(false);
      }, 800);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  }

  const hasChanges = selectedVariant !== savedVariant;

  return (
    <div className="glass-panel fixed top-1/2 right-6 z-[100] w-80 -translate-y-1/2">
      {/* Header */}
      <div className="border-b border-gray-200/50 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">{component.componentName}</h3>
            <p className="mt-0.5 text-xs text-gray-500">Hover to preview, click to select</p>
          </div>
          <button
            onClick={handleCancel}
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

      {/* Variant Options */}
      <div className="max-h-[50vh] overflow-y-auto p-3">
        <div className="space-y-2">
          {component.variants.map((variant) => {
            const isSelected = selectedVariant === variant.id;
            const isCurrent = savedVariant === variant.id;

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => handleVariantSelect(variant.id)}
                onMouseEnter={() => handleVariantHover(variant.id)}
                onMouseLeave={handleVariantLeave}
                className={`group relative w-full rounded-xl border-2 p-3 text-left transition-all ${
                  isSelected
                    ? 'border-[#526479] bg-[#5264790d]'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5">
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ backgroundColor: theme?.primary_color || '#526479' }}
                    >
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="pr-8">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">{variant.name}</h4>
                    {isCurrent && !isSelected && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{variant.description}</p>
                </div>
              </button>
            );
          })}
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
              onClick={handleCancel}
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
