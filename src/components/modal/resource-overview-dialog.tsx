/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect, useRef, JSX } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Calendar, MapPin, BookOpen, ExternalLink, X, Copy, Check } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@ui/dialog';

import { cn } from '@lib/utils';
import { stripHtml } from '@lib/sanitize';

import type { Resource } from '@content-types/content';
import type { ResourceOverviewDialogProps } from './types';

/**
 * Props for the DatasetStickyHeader component
 */
interface DatasetStickyHeaderProps {
  title: string;
  resourceTypeName: string;
  scrolledOut: boolean;
  onClose: () => void;
}

/**
 * Overview map component
 */
const OverviewMap = dynamic(() => import('./overview-map').then((mod) => mod.OverviewMapInner), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full animate-pulse rounded-lg bg-gray-100" />,
});

/**
 * Format the date
 */
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);

  if (isNaN(d.getTime())) {
    return dateStr;
  }

  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Metadata field component
 */
function MetadataField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): JSX.Element | null {
  if (!children) {
    return null;
  }

  return (
    <div>
      <dt className="mb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">{label}</dt>
      <dd className="text-sm text-gray-700">{children}</dd>
    </div>
  );
}

/**
 * Section heading component
 */
function SectionHeading({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-400 uppercase">
      {icon}
      {children}
    </h4>
  );
}

/**
 * Copyable citation component
 */
function CopyableCitation({ text }: { text: string }): JSX.Element {
  const [copied, setCopied] = useState(false);

  // Callback - handle copy action
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="group/cite relative">
      <blockquote className="rounded-lg border-l-2 border-gray-200 bg-gray-50 py-2 pr-9 pl-3 text-xs leading-relaxed text-gray-600 italic">
        {text}
      </blockquote>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 rounded p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
        title="Copy citation"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}

/**
 * Access footer component
 */
function AccessFooter({
  resource,
  gkhOnline,
}: {
  resource: Resource;
  gkhOnline: boolean;
}): JSX.Element {
  const isGkh = resource.source === 'geo-knowledge-hub';
  const showAccess = gkhOnline || !isGkh;

  return (
    <div className="flex justify-end px-6 py-3">
      {showAccess ? (
        <Link
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#526479] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3d4d5f]"
        >
          Access
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <span className="text-sm text-gray-400">Unavailable</span>
      )}
    </div>
  );
}

/**
 * Dataset sticky header component
 */
function DatasetStickyHeader({
  title,
  resourceTypeName,
  scrolledOut,
  onClose,
}: DatasetStickyHeaderProps): JSX.Element {
  return (
    <div
      className={cn(
        'shrink-0 border-b border-gray-100 bg-white/95 backdrop-blur-sm transition-all duration-200',
        scrolledOut ? 'px-6 py-3 md:px-8' : 'px-4 py-2 md:px-6',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
          {scrolledOut && (
            <>
              <span className="animate-fade-in shrink-0 rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-medium text-white">
                {resourceTypeName}
              </span>
              <span className="animate-fade-in min-w-0 truncate text-sm font-semibold text-gray-900">
                {title}
              </span>
            </>
          )}
        </div>
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
}

/**
 * Dataset overview component
 */
function DatasetOverview({
  data,
  gkhOnline,
  open,
  onClose,
}: {
  data: Resource;
  gkhOnline: boolean;
  open: boolean;
  onClose: () => void;
}): JSX.Element {
  const extras = data.extras;
  const hasTemporalCoverage = extras?.temporal_start;
  const hasLocation = data.has_location && data.locations;
  const placeNames = data.locations?.features?.map((f) => f.place).filter(Boolean) ?? [];

  const [headerScrolledOut, setHeaderScrolledOut] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerSentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Effect - Reset scroll state when the modal opens
  useEffect(() => {
    if (open) setHeaderScrolledOut(false);
  }, [open]);

  // Effect - Handle scroll state when the modal is opened or closed
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

      // If the sentinel or root is not found, return
      if (!sentinel || !root) {
        return;
      }

      // Create a new observer
      observerRef.current = new IntersectionObserver(
        ([entry]) => setHeaderScrolledOut(!entry.isIntersecting),
        { root, threshold: 0 },
      );

      // Observe the sentinel
      observerRef.current.observe(sentinel);
    }, 50);

    // Cleanup
    return () => {
      // Clear the timeout
      window.clearTimeout(timerId);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col overflow-hidden p-0" hideClose>
        <DialogTitle className="sr-only">{data.name}</DialogTitle>
        <DialogDescription className="sr-only">Overview details for {data.name}</DialogDescription>

        {/* Sticky header */}
        <DatasetStickyHeader
          title={data.name}
          resourceTypeName={data.resource_type.name}
          scrolledOut={headerScrolledOut}
          onClose={onClose}
        />

        {/* Scrollable body */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-6 py-5 md:px-8">
          {/* Title area (observed for sticky trigger) */}
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
              {data.resource_type.name}
            </span>
          </div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">{data.name}</h2>

          {/* Sentinel! when this scrolls out of view, sticky header appears */}
          <div ref={headerSentinelRef} aria-hidden="true" />

          <div className="space-y-6 text-sm">
            {/* Description */}
            {data.description && (
              <p className="leading-relaxed text-gray-600">{stripHtml(data.description)}</p>
            )}

            {/* Metadata grid */}
            <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <MetadataField label="Organization">{data.organization || null}</MetadataField>

              <MetadataField label="License">
                {data.rights?.length
                  ? data.rights.map((r) => r.title?.en || r.id).join(', ')
                  : null}
              </MetadataField>

              <MetadataField label="Contributors">
                {data.creators?.length
                  ? data.creators.map((c) => c.person_or_org.name).join(', ')
                  : null}
              </MetadataField>

              <MetadataField label="Subjects">
                {data.subjects?.length ? data.subjects.join(', ') : null}
              </MetadataField>

              <MetadataField label="GEO Work Programme Activity">
                {data.geo_work_programme_activity?.name || null}
              </MetadataField>

              <MetadataField label="Target Audience">
                {data.target_audiences?.length
                  ? data.target_audiences.map((ta) => ta.name).join(', ')
                  : null}
              </MetadataField>

              {data.engagement_priorities?.length ? (
                <div className="md:col-span-2">
                  <MetadataField label="SDGs / GEO Focus Areas">
                    {data.engagement_priorities.map((ep) => ep.name).join(', ')}
                  </MetadataField>
                </div>
              ) : null}

              {/* DOI / CSTR — inline with other metadata */}
              {extras?.doi && <MetadataField label="DOI">{extras.doi}</MetadataField>}
              {extras?.cstr && <MetadataField label="CSTR">{extras.cstr}</MetadataField>}
            </dl>

            {/* Temporal coverage */}
            {hasTemporalCoverage && (
              <div>
                <SectionHeading icon={<Calendar className="h-3.5 w-3.5" />}>
                  Temporal Coverage
                </SectionHeading>
                <p className="text-sm text-gray-700">
                  {formatDate(extras!.temporal_start!)}
                  {extras?.temporal_end && ` – ${formatDate(extras.temporal_end)}`}
                </p>
              </div>
            )}

            {/* Spatial coverage */}
            {hasLocation && (
              <div>
                <SectionHeading icon={<MapPin className="h-3.5 w-3.5" />}>
                  Spatial Coverage
                </SectionHeading>
                {placeNames.length > 0 && (
                  <p className="mb-2 text-sm text-gray-600">{placeNames.join(', ')}</p>
                )}
                <OverviewMap locations={data.locations!} />
              </div>
            )}

            {/* Citation */}
            {extras?.citation && (
              <div>
                <SectionHeading icon={<BookOpen className="h-3.5 w-3.5" />}>
                  Citation
                </SectionHeading>
                <CopyableCitation text={extras.citation} />
              </div>
            )}
          </div>
        </div>

        {/* Docked footer */}
        <div className="shrink-0 border-t border-gray-100 bg-white">
          <AccessFooter resource={data} gkhOnline={gkhOnline} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Simple overview component
 */
function SimpleOverview({
  data,
  gkhOnline,
  open,
  onClose,
}: {
  data: Resource;
  gkhOnline: boolean;
  open: boolean;
  onClose: () => void;
}): JSX.Element {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">{data.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Overview details for {data.name}
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <MetadataField label="Resource Type">{data.resource_type?.name || null}</MetadataField>

          <MetadataField label="License">
            {data.rights?.length ? data.rights.map((r) => r.title?.en || r.id).join(', ') : null}
          </MetadataField>

          {data.description && (
            <div className="md:col-span-2">
              <MetadataField label="Description">{stripHtml(data.description)}</MetadataField>
            </div>
          )}

          <MetadataField label="Contributors">
            {data.creators?.length
              ? data.creators.map((c) => c.person_or_org.name).join(', ')
              : null}
          </MetadataField>

          <MetadataField label="Subjects">
            {data.subjects?.length ? data.subjects.join(', ') : null}
          </MetadataField>

          <MetadataField label="GEO Work Programme Activity">
            {data.geo_work_programme_activity?.name || null}
          </MetadataField>

          <MetadataField label="Target Audience">
            {data.target_audiences?.length
              ? data.target_audiences.map((ta) => ta.name).join(', ')
              : null}
          </MetadataField>

          {data.engagement_priorities?.length ? (
            <div className="md:col-span-2">
              <MetadataField label="SDGs / GEO Focus Areas">
                {data.engagement_priorities.map((ep) => ep.name).join(', ')}
              </MetadataField>
            </div>
          ) : null}
        </dl>

        <DialogFooter className="border-t border-gray-100 pt-4">
          {gkhOnline || data.source !== 'geo-knowledge-hub' ? (
            <Link
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#526479] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3d4d5f]"
            >
              Access
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span className="text-sm text-gray-400">Unavailable</span>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Resource overview dialog component
 */
export function ResourceOverviewDialog({
  open,
  onClose,
  data,
  gkhOnline = true,
}: ResourceOverviewDialogProps): JSX.Element | null {
  // If the dialog is not open, return null
  if (!open) {
    return null;
  }

  // Check if the resource is a dataset
  const isDataset = data.resource_type?.id === 'dataset';

  return isDataset ? (
    <DatasetOverview data={data} gkhOnline={gkhOnline} open={open} onClose={onClose} />
  ) : (
    <SimpleOverview data={data} gkhOnline={gkhOnline} open={open} onClose={onClose} />
  );
}
