/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

import Image from 'next/image';
import { X, Link2, ExternalLink } from 'lucide-react';

import { getAssetPath } from '@lib/utils';

import { useTheme } from '../../../context/theme-context';
import { applyThemeStyles } from '../../../utils/theme';

import type { MarketplaceApplication } from '@content-types/content';

/**
 * Properties expected for the ApplicationModal component.
 */
interface ApplicationModalProps {
  /** Application data (null = modal closed) */
  application: MarketplaceApplication | null;
  /** Business name for display */
  businessName: string;
  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * ApplicationModal Component
 *
 * @component
 * @param {ApplicationModalProps} props - Component props.
 * @returns {JSX.Element | null} The rendered ApplicationModal component.
 */
export function ApplicationModal({
  application,
  businessName,
  onClose,
}: ApplicationModalProps): JSX.Element | null {
  // State - modal references
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Theme
  const { getEffectiveTheme } = useTheme();
  const themeStyles = applyThemeStyles(getEffectiveTheme());

  // Focus trap and keyboard handling
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Close on esc
      if (e.key === 'Escape') {
        onClose();
        return;
      }
    },
    [onClose],
  );

  // Manage focus and scroll lock
  useEffect(() => {
    if (application) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Lock scroll
      document.body.style.overflow = 'hidden';

      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);

      // Focus the modal after animation
      requestAnimationFrame(() => {
        modalRef.current?.focus();
      });
    }

    return () => {
      // Unlock scroll
      document.body.style.overflow = '';

      // Remove event listeners
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus
      previousFocusRef.current?.focus();
    };
  }, [application, handleKeyDown]);

  // If no application, return null
  if (!application) {
    return null;
  }

  // Build metadata rows
  // ToDo: This is an initial solution - we can evolve it
  // ToDo: Add more metadata fields
  const metadataRows: { label: string; value: string }[] = [];

  // Version
  if (application.version) {
    metadataRows.push({ label: 'Version', value: application.version });
  }

  // Last updated
  if (application.last_updated) {
    metadataRows.push({ label: 'Last updated', value: application.last_updated });
  }

  // Access model
  if (application.access_model) {
    metadataRows.push({ label: 'Access type', value: application.access_model });
  }

  // Data formats
  if (application.data_formats && application.data_formats.length > 0) {
    metadataRows.push({ label: 'Data formats', value: application.data_formats.join(', ') });
  }

  // Prepare modal content
  const modalContent = (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={application.title}
      style={themeStyles}
    >
      {/* Backdrop */}
      <div
        className="motion-safe:animate-fade-in absolute inset-0 bg-[rgba(44,58,71,0.55)] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="mp-modal motion-safe:animate-fade-in relative z-10 flex max-h-[90vh] w-full max-w-[640px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)] outline-none md:max-h-[85vh]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4">
            {/* App icon */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {application.icon ? (
                <Image
                  src={getAssetPath(application.icon)}
                  alt={application.title}
                  width={80}
                  height={80}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <div className="themed-bg flex h-full w-full items-center justify-center text-xl font-bold text-white opacity-80">
                  {application.title
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0 pt-1">
              <h2 className="text-2xl font-bold text-gray-900">{application.title}</h2>
              <p className="mt-0.5 text-sm text-gray-500">by {businessName}</p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {application.focus_areas?.map((area) => (
                  <span
                    key={area}
                    className="themed-title rounded-full border border-gray-200/60 bg-gray-50 px-2.5 py-0.5 text-[11px] font-semibold"
                  >
                    {area}
                  </span>
                ))}
                <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
                  {application.app_type}
                </span>
                {application.access_model && (
                  <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
                    {application.access_model}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">About this application</h3>
            <div className="mt-3 leading-relaxed text-gray-600">
              {application.description.split('\n').map((paragraph, i) => (
                <p key={i} className={i > 0 ? 'mt-3' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Metadata table */}
          {metadataRows.length > 0 && (
            <>
              <hr className="my-6 border-gray-200" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">Details</h3>
                <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                  {metadataRows.map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between px-4 py-3 text-sm ${
                        i % 2 === 0 ? 'bg-[#FAFAF8]' : 'bg-white'
                      }`}
                    >
                      <span className="text-xs font-medium text-gray-400">{row.label}</span>
                      <span className="text-gray-700">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* CTAs */}
          {(application.access_url || application.website_url) && (
            <>
              <hr className="my-6 border-gray-200" />
              <div className="flex flex-col gap-3 sm:flex-row">
                {application.access_url && (
                  <a
                    href={application.access_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="themed-bg inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white shadow-md transition hover:opacity-90"
                  >
                    <Link2 className="h-4 w-4" />
                    Open Application
                  </a>
                )}

                {application.website_url && (
                  <a
                    href={application.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') {
    return null;
  }

  // Render
  return createPortal(modalContent, document.body);
}
