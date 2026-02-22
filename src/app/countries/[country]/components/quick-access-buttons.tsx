/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX } from 'react';

import type { SectionInfo } from '../utils/sections';

/**
 * Props for the QuickAccessButtons component
 */
interface QuickAccessButtonsProps {
  /** Array of available sections to display as buttons */
  sections: SectionInfo[];
  /** Primary color for button background (uses theme primary if not provided) */
  primaryColor?: string;
}

/**
 * QuickAccessButtons Component
 *
 * Renders a row of buttons that allow users to quickly navigate
 * to different sections of the page via smooth scrolling.
 *
 * @component
 * @param {QuickAccessButtonsProps} props - Component props.
 * @returns {JSX.Element | null} The rendered buttons or null if no sections.
 */
export function QuickAccessButtons({
  sections,
  primaryColor,
}: QuickAccessButtonsProps): JSX.Element | null {
  // Function - Handles button click
  const handleClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Don't render if no sections available
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => handleClick(section.id)}
          className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:opacity-90"
          style={{ backgroundColor: primaryColor || 'var(--theme-primary, #526479)' }}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
}
