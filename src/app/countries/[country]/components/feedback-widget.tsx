/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ChatBubbleLeftEllipsisIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

import { checkAdminAuth } from '@lib/api/admin';

/**
 * Props for the FeedbackWidget component
 */
interface FeedbackWidgetProps {
  /** External feedback URL managed by the country */
  feedbackUrl?: string;
  /** Country display name for the confirmation message */
  countryName: string;
}

/**
 * FeedbackWidget Component
 *
 * A floating feedback button anchored to the bottom-right of the viewport.
 *
 * When clicked, shows a confirmation dialog informing the user they will be
 * redirected to an external service managed by the country.
 *
 * @notes
 * - Hidden when no `feedbackUrl` is provided
 * - Hidden when the user is authenticated as admin (admin sees edit controls instead)
 *
 * @component
 * @param {FeedbackWidgetProps} props - Component props.
 * @returns {JSX.Element | null} The rendered widget or null.
 */
export function FeedbackWidget({ feedbackUrl, countryName }: FeedbackWidgetProps) {
  // State - Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State - Admin
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Ref - Modal
  const modalRef = useRef<HTMLDivElement>(null);

  // Effect - Check admin auth on mount — hide widget for admins
  useEffect(() => {
    checkAdminAuth().then(setIsAdmin);
  }, []);

  // Handler - Open modal
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Handler - Access feedback service
  const handleContinue = useCallback(() => {
    if (feedbackUrl) {
      window.open(feedbackUrl, '_blank', 'noopener,noreferrer');
    }
    setIsModalOpen(false);
  }, [feedbackUrl]);

  // Handler - Close modal on click outside
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    },
    [closeModal],
  );

  // Effect - Close modal on Escape key
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  // No feedback or is admin, don't render
  if (!feedbackUrl || isAdmin === null || isAdmin) {
    return null;
  }

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed right-6 bottom-6 z-60">
        <button
          onClick={openModal}
          aria-label="Provide feedback"
          className="glass-button flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-gray-700 transition-all hover:scale-105"
        >
          <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-gray-500" />
          Feedback
        </button>
      </div>

      {/* Confirmation modal overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-100 flex items-end justify-center bg-black/30 backdrop-blur-[2px] md:items-center"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
        >
          {/* Modal content */}
          <div
            ref={modalRef}
            className="feedback-modal w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl md:rounded-2xl"
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      'color-mix(in srgb, var(--theme-primary, #526479) 10%, #ffffff)',
                  }}
                >
                  <ShieldCheckIcon
                    className="h-5 w-5"
                    style={{ color: 'var(--theme-primary, #526479)' }}
                  />
                </div>
                <h2 id="feedback-modal-title" className="text-lg font-semibold text-gray-900">
                  Feedback
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close dialog"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <p className="mb-2 text-sm leading-relaxed text-gray-700">
              Your feedback helps us improve the{' '}
              <span className="font-medium text-gray-900">{countryName}</span> National GKH services
              and content to serve the community better.
            </p>

            <p className="mb-2 text-sm leading-relaxed text-gray-700">
              You can continue to the feedback service and share your thoughts. We value every
              message!
            </p>

            <p className="mt-5 mb-7 text-xs leading-relaxed text-gray-400">
              You'll be redirected to an external feedback service managed by{' '}
              <span className="font-medium text-gray-500">{countryName}</span>, which may have its
              own privacy policy and terms of use.
            </p>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                onClick={closeModal}
                className="glass-button rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: 'var(--theme-primary, #526479)',
                }}
              >
                Access
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile drag indicator */}
            <div className="mt-4 flex justify-center md:hidden">
              <div className="h-1 w-10 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
