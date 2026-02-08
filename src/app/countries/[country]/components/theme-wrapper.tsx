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
 * Renders a themed container that sets CSS variables for all descendants.
 *
 * @component
 * @param {ThemeWrapperProps} props - Component props.
 * @returns {JSX.Element} The themed wrapper containing children.
 */
export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { getEffectiveTheme } = useTheme();
  const effectiveTheme = getEffectiveTheme();
  const themeStyles = applyThemeStyles(effectiveTheme);

  // Combined styles with background
  const wrapperStyles = {
    ...themeStyles,
    backgroundColor: 'var(--theme-background, #ffffff)',
  };

  return (
    <div className="relative -ml-[calc(50vw-50%)] w-screen" style={wrapperStyles}>
      {children}
    </div>
  );
}
