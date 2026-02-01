/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { ReactNode } from 'react';

import { useTheme } from '../context/theme-context';
import { applyThemeStyles } from '../utils/theme';

/**
 * ThemeWrapperProps Interface - Props for the ThemeWrapper component
 */
interface ThemeWrapperProps {
  /** Child components to wrap with theme styles */
  children: ReactNode;
}

/**
 * ThemeWrapper Component - Applies country theme CSS variables to all child routes
 *
 * Renders a full-viewport background layer so the theme background covers the
 * entire page (height and width), and a wrapper that sets CSS variables for
 * descendants. The background uses fixed positioning to escape any parent
 * width constraints (e.g. root layout's max-w-7xl).
 *
 * @component
 * @param {ThemeWrapperProps} props - Component props.
 * @returns {JSX.Element} The themed wrapper containing children.
 */
export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { getEffectiveTheme } = useTheme();
  const effectiveTheme = getEffectiveTheme();
  const themeStyles = {
    ...applyThemeStyles(effectiveTheme),
    backgroundColor: 'var(--theme-background, #ffffff)',
  };

  return (
    <>
      {/* Full viewport theme background - fixed so it covers entire page */}
      <div aria-hidden className="fixed inset-0 z-0 min-h-screen w-screen" style={themeStyles} />
      {/* Wrapper for CSS variable inheritance (themed classes use these) */}
      <div className="relative z-10" style={themeStyles}>
        {/* relative z-10 so content is above the fixed background */}
        {children}
      </div>
    </>
  );
}
