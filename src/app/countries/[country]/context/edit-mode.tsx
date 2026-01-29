/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

import type { CountryComponentConfig, CountryTheme } from '@content-types/content';
import { getDefaultTheme } from '../utils/theme';

/**
 * Represents a temporary preview variant - used when hovering over options
 * This allows the actual page to update in real-time as user explores variants
 */
interface PreviewVariant {
  componentId: string;
  variantId: string;
}

interface EditModeContextValue {
  // Edit mode state
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;

  // Currently editing component
  editingComponent: string | null;
  setEditingComponent: (componentId: string | null) => void;

  // Currently editing theme
  isEditingTheme: boolean;
  setIsEditingTheme: (value: boolean) => void;

  // Preview variant - temporary state for real-time preview on hover
  previewVariant: PreviewVariant | null;
  setPreviewVariant: (variant: PreviewVariant | null) => void;

  // Preview theme - temporary state for real-time color preview on hover
  previewTheme: Partial<CountryTheme> | null;
  setPreviewTheme: (theme: Partial<CountryTheme> | null) => void;

  // Saved configurations
  componentConfigs: CountryComponentConfig[];
  setComponentConfigs: (configs: CountryComponentConfig[]) => void;

  // Theme
  theme: CountryTheme | null;
  setTheme: (theme: CountryTheme | null) => void;

  // Country ID
  countryId: string | null;
  setCountryId: (id: string | null) => void;

  // Helper to get effective variant for a component (preview or saved)
  getEffectiveVariant: (componentId: string, defaultVariant: string) => string;

  // Helper to get effective theme (preview merged with saved, or default)
  getEffectiveTheme: () => CountryTheme;
}

const EditModeContext = createContext<EditModeContextValue | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [previewVariant, setPreviewVariant] = useState<PreviewVariant | null>(null);
  const [previewTheme, setPreviewTheme] = useState<Partial<CountryTheme> | null>(null);
  const [componentConfigs, setComponentConfigs] = useState<CountryComponentConfig[]>([]);
  const [theme, setTheme] = useState<CountryTheme | null>(null);
  const [countryId, setCountryId] = useState<string | null>(null);

  // Helper function to get the effective variant for a component
  // Priority: preview variant > saved config > default
  const getEffectiveVariant = useCallback(
    (componentId: string, defaultVariant: string): string => {
      // If there's a preview variant for this component, use it
      if (previewVariant && previewVariant.componentId === componentId) {
        return previewVariant.variantId;
      }
      // Otherwise use saved config
      const config = componentConfigs.find((c) => c.componentId === componentId);
      return config?.variantId || defaultVariant;
    },
    [previewVariant, componentConfigs],
  );

  // Helper function to get the effective theme
  // Priority: preview theme (merged) > saved theme > default theme
  const getEffectiveTheme = useCallback((): CountryTheme => {
    const baseTheme = theme || getDefaultTheme();

    if (previewTheme) {
      return {
        ...baseTheme,
        ...previewTheme,
      };
    }

    return baseTheme;
  }, [theme, previewTheme]);

  return (
    <EditModeContext.Provider
      value={{
        isEditMode,
        setIsEditMode,
        editingComponent,
        setEditingComponent,
        isEditingTheme,
        setIsEditingTheme,
        previewVariant,
        setPreviewVariant,
        previewTheme,
        setPreviewTheme,
        componentConfigs,
        setComponentConfigs,
        theme,
        setTheme,
        countryId,
        setCountryId,
        getEffectiveVariant,
        getEffectiveTheme,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within EditModeProvider');
  }
  return context;
}
