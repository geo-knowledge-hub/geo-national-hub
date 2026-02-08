/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { ReactNode } from 'react';

import { getCountry } from '@lib/typesense';
import { EditModeProvider } from './context/edit-mode';
import { ThemeProvider } from './context/theme-context';
import { ThemeWrapper } from './components/theme-wrapper';
import { getDefaultTheme } from './utils/theme';

/**
 * CountryLayoutProps Interface - Defines the expected properties for the CountryLayout component.
 */
interface CountryLayoutProps {
  /** The child components that will be rendered inside the layout */
  children: ReactNode;
  /** Route parameters containing the country ID */
  params: Promise<{ country: string }>;
}

/**
 * CountryLayout Component - Provides theme and edit mode context for all country pages.
 *
 * This async server component fetches country data and initializes the theme
 * at the layout level, ensuring all child routes have access to the country's
 * theme CSS variables.
 *
 * @component
 * @param {CountryLayoutProps} props - The properties for the CountryLayout component.
 * @param {ReactNode} props.children - The main content of the page.
 * @param {Promise<{ country: string }>} props.params - Route parameters.
 * @returns {Promise<JSX.Element>} The rendered CountryLayout component.
 */
export default async function CountryLayout({ children, params }: CountryLayoutProps) {
  const { country } = await params;

  // Fetch country data to get the theme
  const countryData = await getCountry(country);

  // Use country theme or fall back to default
  const theme = countryData?.theme || getDefaultTheme();

  return (
    <ThemeProvider initialTheme={theme}>
      <ThemeWrapper>
        <EditModeProvider>{children}</EditModeProvider>
      </ThemeWrapper>
    </ThemeProvider>
  );
}
