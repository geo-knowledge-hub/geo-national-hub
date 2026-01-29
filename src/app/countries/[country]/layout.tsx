/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { ReactNode } from 'react';
import { EditModeProvider } from './context/edit-mode';

/**
 * CountryLayoutProps Interface - Defines the expected properties for the CountryLayout component.
 */
interface CountryLayoutProps {
  /** The child components that will be rendered inside the layout */
  children: ReactNode;
}

/**
 * CountryLayout Component - Provides the edit mode context for country pages.
 *
 * @component
 * @param {CountryLayoutProps} props - The properties for the CountryLayout component.
 * @param {ReactNode} props.children - The main content of the page.
 * @returns {JSX.Element} The rendered CountryLayout component.
 */
export default function CountryLayout({ children }: CountryLayoutProps) {
  return <EditModeProvider>{children}</EditModeProvider>;
}
