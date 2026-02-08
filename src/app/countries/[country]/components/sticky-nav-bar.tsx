/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, useEffect, useState, useRef } from 'react';

import type { SectionInfo } from '../utils/sections';

/**
 * Props for the StickyNavBar component
 */
interface StickyNavBarProps {
  /** Array of available sections to display as buttons */
  sections: SectionInfo[];
  /** Primary color for active/hover states (uses theme primary if not provided) */
  primaryColor?: string;
}

/**
 * StickyNavBar Component
 *
 * A navigation bar that displays quick access buttons for page sections.
 * Features glass morphism design and becomes sticky below the main header when scrolling.
 *
 * @component
 * @param {StickyNavBarProps} props - Component props.
 * @returns {JSX.Element | null} The rendered sticky nav bar or null if no sections.
 */
export function StickyNavBar({ sections, primaryColor }: StickyNavBarProps): JSX.Element | null {
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Header height (h-23 = 92px, so using 96px for safety)
  const headerHeight = 96;

  // Theme color for active button
  const themeColor = primaryColor || 'var(--theme-primary, #526479)';

  useEffect(() => {
    const handleScroll = () => {
      if (placeholderRef.current) {
        const placeholderTop = placeholderRef.current.getBoundingClientRect().top;
        setIsSticky(placeholderTop <= headerHeight);
      }

      // Check if we're at the bottom of the page
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

      // If at bottom, activate the last section
      if (isAtBottom && sections.length > 0) {
        setActiveSection(sections[sections.length - 1].id);
        return;
      }

      // Update active section based on scroll position
      const sectionElements = sections.map((s) => ({
        id: s.id,
        element: document.getElementById(s.id),
      }));

      for (const { id, element } of sectionElements) {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= headerHeight + 100 && rect.bottom > headerHeight + 100) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Auto-scroll the active button into view within the horizontal nav
  useEffect(() => {
    if (!activeSection || !scrollContainerRef.current) {
      return;
    }

    // get active button
    const activeBtn = scrollContainerRef.current.querySelector(
      `[data-section-id="${activeSection}"]`,
    ) as HTMLElement | null;

    if (activeBtn) {
      // scroll active button
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeSection]);

  /**
   * Handles button click - smoothly scrolls to the target section
   */
  const handleClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const barHeight = barRef.current?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - barHeight - 16;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <>
      {/* Placeholder to maintain layout when bar becomes sticky */}
      <div ref={placeholderRef} className={isSticky ? 'h-16' : 'h-0'} />

      {/* The sticky navigation bar */}
      <div
        ref={barRef}
        className={`left-0 w-full transition-all duration-300 ${isSticky ? 'fixed z-[55] shadow-sm backdrop-blur-md' : 'relative z-30'} `}
        style={{
          top: isSticky ? `${headerHeight}px` : undefined,
          backgroundColor: isSticky
            ? 'color-mix(in srgb, var(--theme-background, #ffffff) 85%, transparent)'
            : 'transparent',
          borderBottom: isSticky ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
        }}
      >
        <div className="mx-auto max-w-7xl px-2 md:px-6">
          <div
            ref={scrollContainerRef}
            className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3 md:flex-wrap md:justify-center md:overflow-x-visible"
          >
            {sections.map((section) => {
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  data-section-id={section.id}
                  onClick={() => handleClick(section.id)}
                  className={`group relative shrink-0 rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-[1.02] ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'border border-gray-200/80 bg-white/80 text-gray-700 hover:border-gray-300 hover:bg-white hover:shadow-sm'
                  } `}
                  style={
                    isActive
                      ? {
                          backgroundColor: themeColor,
                        }
                      : undefined
                  }
                >
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
