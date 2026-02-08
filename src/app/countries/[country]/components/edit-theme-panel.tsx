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

import { useEditMode } from '../context/edit-mode';
import { useTheme } from '../context/theme-context';
import { colorPresets, findPresetByPrimaryColor, type ColorPreset } from '../utils/color-presets';
import { saveCountryTheme } from '@lib/api/admin';

interface EditThemePanelProps {
  onClose: () => void;
}

/**
 * Floating panel for selecting theme colors
 * Hovering over colors updates the page in real-time (Stripe-like UX)
 */
export function EditThemePanel({ onClose }: EditThemePanelProps) {
  // Get edit mode state
  const { countryId, setIsEditingTheme } = useEditMode();

  // Get theme state from ThemeContext
  const { theme, setTheme, setPreviewTheme } = useTheme();

  // Find current preset based on saved theme
  const savedPreset = theme?.primary_color
    ? findPresetByPrimaryColor(theme.primary_color)
    : colorPresets[0];

  const [selectedPreset, setSelectedPreset] = useState<ColorPreset>(savedPreset || colorPresets[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Clear preview when component unmounts
  useEffect(() => {
    return () => {
      setPreviewTheme(null);
    };
  }, [setPreviewTheme]);

  // Handle hovering over a color preset - updates the page in real-time
  function handlePresetHover(preset: ColorPreset) {
    setPreviewTheme({
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent,
      background_color: preset.background,
    });
  }

  // Clear preview when mouse leaves the preset options
  function handlePresetLeave() {
    // If user has selected a preset different from saved, keep showing it
    if (selectedPreset.id !== savedPreset?.id) {
      setPreviewTheme({
        primary_color: selectedPreset.primary,
        secondary_color: selectedPreset.secondary,
        accent_color: selectedPreset.accent,
        background_color: selectedPreset.background,
      });
    } else {
      setPreviewTheme(null);
    }
  }

  // Handle selecting a preset (click)
  function handlePresetSelect(preset: ColorPreset) {
    setSelectedPreset(preset);
    setPreviewTheme({
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent,
      background_color: preset.background,
    });
  }

  // Handle cancel - revert to saved state
  function handleCancel() {
    setPreviewTheme(null);
    setIsEditingTheme(false);
    onClose();
  }

  // Handle apply - save the selected theme
  async function handleApply() {
    if (!countryId || !theme) {
      alert('Country ID and theme are required');
      return;
    }

    setIsSaving(true);

    try {
      const updatedTheme = {
        ...theme,
        primary_color: selectedPreset.primary,
        secondary_color: selectedPreset.secondary,
        accent_color: selectedPreset.accent,
        background_color: selectedPreset.background,
      };

      // Save using the API client
      await saveCountryTheme(countryId, updatedTheme);

      // Update local state on success
      setTheme(updatedTheme);

      setPreviewTheme(null); // Clear preview, saved theme takes over

      setShowSuccess(true);

      setTimeout(() => {
        setIsEditingTheme(false);
        onClose();
        setShowSuccess(false);
      }, 800);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save theme');
    } finally {
      setIsSaving(false);
    }
  }

  const hasChanges = selectedPreset.id !== savedPreset?.id;

  return (
    <div className="glass-panel fixed top-1/2 right-6 z-[100] w-80 -translate-y-1/2">
      {/* Header */}
      <div className="border-b border-gray-200/50 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Theme Colors</h3>
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

      {/* Color Preset Options */}
      <div className="max-h-[50vh] overflow-y-auto p-3">
        <div className="space-y-2">
          {colorPresets.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            const isCurrent = savedPreset?.id === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                onMouseEnter={() => handlePresetHover(preset)}
                onMouseLeave={handlePresetLeave}
                className={`group relative w-full rounded-xl border-2 p-3 text-left transition-all ${
                  isSelected
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5">
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ backgroundColor: preset.primary }}
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
                <div className="flex items-center gap-3 pr-8">
                  {/* Color swatches */}
                  <div className="flex -space-x-1">
                    <div
                      className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div
                      className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>

                  {/* Name and label */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900">{preset.name}</h4>
                      {isCurrent && !isSelected && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">{preset.primary}</p>
                  </div>
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
            Theme applied!
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
              className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: isSaving || !hasChanges ? '#9ca3af' : selectedPreset.primary,
              }}
            >
              {isSaving ? 'Applying...' : 'Apply'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
