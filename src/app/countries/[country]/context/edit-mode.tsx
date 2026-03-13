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

import type { CountryComponentConfig } from '@content-types/content';
import type { SectionId } from '../utils/section-order';

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

  // Currently editing layout (section order)
  isEditingLayout: boolean;
  setIsEditingLayout: (value: boolean) => void;

  // Preview variant - temporary state for real-time preview on hover
  previewVariant: PreviewVariant | null;
  setPreviewVariant: (variant: PreviewVariant | null) => void;

  // Saved configurations
  componentConfigs: CountryComponentConfig[];
  setComponentConfigs: (configs: CountryComponentConfig[]) => void;

  // Country ID
  countryId: string | null;
  setCountryId: (id: string | null) => void;

  // Available section IDs (sections that have data for the current country)
  availableSectionIds: SectionId[];
  setAvailableSectionIds: (ids: SectionId[]) => void;

  // Helper to get effective variant for a component (preview or saved)
  getEffectiveVariant: (componentId: string, defaultVariant: string) => string;
}

const EditModeContext = createContext<EditModeContextValue | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const [previewVariant, setPreviewVariant] = useState<PreviewVariant | null>(null);
  const [componentConfigs, setComponentConfigs] = useState<CountryComponentConfig[]>([]);
  const [countryId, setCountryId] = useState<string | null>(null);
  const [availableSectionIds, setAvailableSectionIds] = useState<SectionId[]>([]);

  // Function - Get the effective variant for a component
  const getEffectiveVariant = useCallback(
    (componentId: string, defaultVariant: string): string => {
      // Check if there's a preview variant for this component
      if (previewVariant && previewVariant.componentId === componentId) {
        return previewVariant.variantId;
      }

      // Otherwise use saved config
      const config = componentConfigs.find((c) => c.componentId === componentId);
      return config?.variantId || defaultVariant;
    },
    [previewVariant, componentConfigs],
  );

  // Return!
  return (
    <EditModeContext.Provider
      value={{
        isEditMode,
        setIsEditMode,
        editingComponent,
        setEditingComponent,
        isEditingTheme,
        setIsEditingTheme,
        isEditingLayout,
        setIsEditingLayout,
        previewVariant,
        setPreviewVariant,
        componentConfigs,
        setComponentConfigs,
        countryId,
        setCountryId,
        availableSectionIds,
        setAvailableSectionIds,
        getEffectiveVariant,
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
