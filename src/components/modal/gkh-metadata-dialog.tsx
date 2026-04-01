/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@ui/dialog';

import { cn } from '@lib/utils';
import type { GkhMetadataDialogProps } from './types';
import { MetadataHeader } from './metadata-header';
import { MetadataBody } from './metadata-body';

/**
 * Properties expected for the PackageStickyHeader component.
 */
interface PackageStickyHeaderProps {
  title: string;
  resourceTypeTitle: string | undefined;
  scrolledOut: boolean;
  onClose: () => void;
}

/**
 * PackageStickyHeader component
 *
 * Sticky header for the package / standalone view.
 *
 * @component
 */
const PackageStickyHeader: React.FC<PackageStickyHeaderProps> = ({
  title,
  resourceTypeTitle,
  scrolledOut,
  onClose,
}) => {
  return (
    <div
      className={cn(
        'shrink-0 border-b border-gray-100 bg-white/95 backdrop-blur-sm transition-all duration-200',
        scrolledOut ? 'px-6 py-3 md:px-8' : 'px-4 py-2 md:px-6',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: badge + title */}
        <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
          {scrolledOut && resourceTypeTitle && (
            <span className="animate-fade-in shrink-0 rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-medium text-white">
              {resourceTypeTitle}
            </span>
          )}
          {scrolledOut && (
            <span className="animate-fade-in min-w-0 truncate text-sm font-semibold text-gray-900">
              {title}
            </span>
          )}
        </div>

        {/* Right: close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="ml-auto shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

/**
 * Dialog for the GKH metadata.
 *
 * @component
 */
export function GkhMetadataDialog({
  open,
  onClose,
  data,
}: GkhMetadataDialogProps): JSX.Element | null {
  const [headerScrolledOut, setHeaderScrolledOut] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerSentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Effect - Reset scroll state when the modal opens
  useEffect(() => {
    if (open) {
      setHeaderScrolledOut(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    // Disconnect the observer
    observerRef.current?.disconnect();
    observerRef.current = null;

    // Reset the header scrolled out state
    setHeaderScrolledOut(false);

    // Timeout to allow the DOM to settle after state transitions
    const timerId = window.setTimeout(() => {
      // Get the sentinel and root elements
      const sentinel = headerSentinelRef.current;
      const root = scrollContainerRef.current;

      if (!sentinel || !root) {
        return;
      }

      // Create a new observer
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          setHeaderScrolledOut(!entry.isIntersecting);
        },
        { root, threshold: 0 },
      );

      observerRef.current.observe(sentinel);
    }, 50);

    // Cleanup
    return () => {
      window.clearTimeout(timerId);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [open]);

  // If the dialog is not open, return null
  if (!open) {
    return null;
  }

  // Render
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col overflow-hidden p-0" hideClose>
        <DialogTitle className="sr-only">{data.name}</DialogTitle>
        <DialogDescription className="sr-only">GKH metadata for {data.name}</DialogDescription>

        {/* Sticky header */}
        <PackageStickyHeader
          title={data.name}
          resourceTypeTitle={data.resource_type?.name}
          scrolledOut={headerScrolledOut}
          onClose={onClose}
        />

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-5 md:p-7">
          <MetadataHeader resource={data} fallbackTitle={data.name} />

          {/* Sentinel */}
          <div ref={headerSentinelRef} aria-hidden="true" />

          <MetadataBody resource={data} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
