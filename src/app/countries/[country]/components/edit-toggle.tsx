/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

import { useEditMode } from '../context/edit-mode';
import { useTheme } from '../context/theme-context';
import { checkAdminAuth } from '@lib/api/admin';
import { EditThemePanel } from './edit-theme-panel';
import type { Country, CountryComponentConfig } from '@content-types/content';

interface EditModeToggleProps {
  countryId: string;
  countryTheme?: Country['theme'];
  componentConfig?: CountryComponentConfig[];
}

export function EditModeToggle({ countryId, countryTheme, componentConfig }: EditModeToggleProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const {
    isEditMode,
    setIsEditMode,
    setCountryId,
    setComponentConfigs,
    setEditingComponent,
    setPreviewVariant,
    isEditingTheme,
    setIsEditingTheme,
  } = useEditMode();

  // Get preview theme setter from ThemeContext
  const { setPreviewTheme } = useTheme();

  // Strip basePath from pathname for URL manipulation
  // usePathname returns path WITH basePath, but router.push/replace auto-prepends it
  const redirectPath = pathname.replace(/^\/national/, '') || '/';

  // Check authentication status on mount
  useEffect(() => {
    checkAdminAuth().then(setIsAuthenticated);
  }, []);

  // Handle toggling edit mode
  const handleToggle = () => {
    if (isEditMode) {
      // Exiting edit mode - clear all editing state and remove query param
      setEditingComponent(null);
      setPreviewVariant(null);
      setIsEditingTheme(false);
      setPreviewTheme(null);

      // Remove edit param from URL
      // Use redirectPath (without basePath) since router.replace auto-prepends it
      const params = new URLSearchParams(searchParams.toString());
      params.delete('edit');

      const newUrl = params.toString() ? `${redirectPath}?${params.toString()}` : redirectPath;
      router.replace(newUrl);
    }
    setIsEditMode(!isEditMode);
  };

  // Handle opening theme editor
  const handleOpenThemeEditor = () => {
    // Close any component editor first
    setEditingComponent(null);
    setPreviewVariant(null);
    setIsEditingTheme(true);
  };

  // Initialize country data and check for edit mode query param
  useEffect(() => {
    if (countryId) {
      setCountryId(countryId);

      // Set component configs if available
      if (componentConfig) {
        setComponentConfigs(componentConfig);
      }
    }

    // Check for ?edit=true query parameter to auto-enable edit mode
    const editParam = searchParams.get('edit');
    if (editParam === 'true' && !isEditMode) {
      setIsEditMode(true);
    }
  }, [
    countryId,
    componentConfig,
    searchParams,
    setCountryId,
    setComponentConfigs,
    setIsEditMode,
    isEditMode,
  ]);

  // Don't render anything while checking auth
  if (isAuthenticated === null) {
    return null;
  }

  // Show login link if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed right-6 bottom-6 z-[60]">
        <Link
          href={`/admin/login?redirect=${encodeURIComponent(redirectPath)}`}
          className="glass-button flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-gray-700 transition-all hover:scale-105"
        >
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Admin Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="fixed right-6 bottom-6 z-[60]">
        {/* Edit mode help tooltip */}
        {isEditMode && !isEditingTheme && (
          <div className="absolute right-0 bottom-full mb-3 w-56 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-xl">
            <p className="font-medium">Live Edit Mode</p>
            <p className="mt-1 text-gray-300">
              Hover over sections to customize. Changes preview instantly.
            </p>
            <div className="absolute right-6 -bottom-1.5 h-3 w-3 rotate-45 bg-gray-900"></div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Theme button - only shown in edit mode */}
          {isEditMode && (
            <button
              onClick={handleOpenThemeEditor}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:scale-105 ${
                isEditingTheme ? 'bg-gray-900 text-white shadow-lg' : 'glass-button text-gray-700'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              Theme
            </button>
          )}

          <button
            onClick={handleToggle}
            className={`group flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:scale-105 ${
              isEditMode ? 'bg-gray-900 text-white shadow-lg' : 'glass-button text-gray-700'
            }`}
          >
            {isEditMode ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
                </span>
                Done Editing
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Customize Page
              </>
            )}
          </button>
        </div>
      </div>

      {/* Theme editor panel */}
      {isEditingTheme && <EditThemePanel onClose={() => setIsEditingTheme(false)} />}
    </>
  );
}
