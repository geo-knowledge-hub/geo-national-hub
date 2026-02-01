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

import type { CountryTheme } from '@content-types/content';
import { getDefaultTheme } from '../utils/theme';

/**
 * ThemeContextValue Interface - Defines the shape of the theme context
 */
interface ThemeContextValue {
  /** The base theme from country data */
  theme: CountryTheme;
  /** Update the base theme (used after saving to backend) */
  setTheme: (theme: CountryTheme) => void;
  /** Preview theme for real-time editing (partial overrides) */
  previewTheme: Partial<CountryTheme> | null;
  /** Set preview theme for live editing */
  setPreviewTheme: (theme: Partial<CountryTheme> | null) => void;
  /** Get the effective theme (preview merged with base, or base, or default) */
  getEffectiveTheme: () => CountryTheme;
}

/**
 * ThemeProviderProps Interface - Props for the ThemeProvider component
 */
interface ThemeProviderProps {
  /** Initial theme from server-side data */
  initialTheme: CountryTheme;
  /** Child components */
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * ThemeProvider Component - Provides theme context to all country pages
 *
 * @component
 * @param {ThemeProviderProps} props - Component props.
 * @returns {JSX.Element} The provider wrapping children.
 */
export function ThemeProvider({ initialTheme, children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<CountryTheme>(initialTheme);
  const [previewTheme, setPreviewTheme] = useState<Partial<CountryTheme> | null>(null);

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
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        previewTheme,
        setPreviewTheme,
        getEffectiveTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook - Access the theme context
 *
 * @returns {ThemeContextValue} The theme context value
 * @throws {Error} If used outside of ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
