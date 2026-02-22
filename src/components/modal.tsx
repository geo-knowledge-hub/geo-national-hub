/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Resource, SyncMetadata } from '@content-types/content';

/**
 * Constants
 */
const ALL_CATEGORY = 'all';
const RESOURCES_PER_PAGE = 6;

/**
 * Props - Modal shell
 */
interface ModalShellProps {
  // Content
  children: React.ReactNode;

  // Layout
  maxWidth?: string;

  // Sticky header
  stickyHeader?: React.ReactNode;

  // Sticky header visibility
  stickyAlwaysVisible?: boolean;
}

/**
 * Props - Resource overview modal
 */
interface ResourceOverviewModalProps {
  // Visibility
  open: boolean;

  // Close callback
  onClose: () => void;

  // Resource data
  data: Resource;
}

/**
 * Types - GKH contributor
 */
interface GkhContributor {
  person_or_org: {
    type: 'personal' | 'organizational';
    name: string;
    given_name?: string;
    family_name?: string;
  };
  role?: { id: string; title: Record<string, string> };
  affiliations?: Array<{ name: string }>;
}

/**
 * Types - GKH subject
 */
interface GkhSubject {
  subject: string;
}

/**
 * Types - GKH right
 */
interface GkhRight {
  id: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  props?: { url?: string };
}

/**
 * Types - GKH related identifier
 */
interface GkhRelatedIdentifier {
  identifier: string;
  scheme: string;
  relation_type?: { title: Record<string, string> };
  title?: string;
  description?: string;
}

/**
 * Types - GKH target audience
 */
interface GkhTargetAudience {
  id: string;
  title: Record<string, string>;
}

/**
 * Types - GKH engagement priority
 */
interface GkhEngagementPriority {
  id: string;
  title: Record<string, string>;
}

/**
 * Types - GKH GEO work programme activity
 */
interface GkhGeoWorkProgrammeActivity {
  id: string;
  title: Record<string, string>;
}

/**
 * Types - GKH language
 */
interface GkhLanguage {
  id: string;
  title: Record<string, string>;
}

/**
 * Types - Metadata fields
 */
interface MetadataFields {
  title: string | undefined;
  description: string | undefined;
  publicationDate: string | undefined;
  publisher: string | undefined;
  resourceTypeTitle: string | undefined;
  baseType: string | undefined;
  creators: GkhContributor[];
  contributors: GkhContributor[];
  contactPersons: GkhContributor[];
  otherContributors: GkhContributor[];
  subjects: GkhSubject[];
  languages: GkhLanguage[];
  rights: GkhRight[];
  targetAudiences: GkhTargetAudience[];
  relatedIdentifiers: GkhRelatedIdentifier[];
  engagementPriorities: GkhEngagementPriority[];
  gwpActivity: GkhGeoWorkProgrammeActivity | undefined;
}

/**
 * Props - GKH metadata modal
 */
interface GkhMetadataModalProps {
  // Visibility
  open: boolean;

  // Close callback
  onClose: () => void;

  // Resource data
  data: Resource;

  // Sync metadata
  syncMetadata: SyncMetadata;
}

/**
 * Resolves i18n object.
 *
 * @param {unknown} value - Value to resolve.
 * @returns {string | undefined} The resolved string, or undefined if not resolvable.
 */
function resolveI18n(value: unknown): string | undefined {
  // ToDo: Enhance this function to support multiple languages.
  // If the value is a string, return it.
  if (typeof value === 'string') {
    return value;
  }

  // If the value is an object, check if it has an 'en' property.
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;

    if (typeof obj.en === 'string') {
      return obj.en;
    }

    for (const v of Object.values(obj)) {
      if (typeof v === 'string') {
        return v;
      }
    }
  }
  return undefined;
}

/**
 * Formats an ISO date string (e.g. "2026-01-05") into a human-readable form.
 *
 * @param {string} dateStr - ISO date string.
 * @returns {string} Formatted date like "January 5, 2026".
 */
function formatDate(dateStr: string): string {
  try {
    // Create date
    const date = new Date(dateStr + 'T00:00:00');

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Capitalizes the first letter of a base type string.
 *
 * @example
 * capitalizeBaseType('software') // 'Software'
 *
 * @param {string} baseType - Raw base type value.
 * @returns {string} Capitalized string.
 */
function capitalizeBaseType(baseType: string): string {
  return baseType.charAt(0).toUpperCase() + baseType.slice(1);
}

/**
 * Ensures all anchor tags in an HTML string open in a new tab.
 *
 * @note
 * Append `target="_blank"` and `rel="noopener noreferrer"` to every `<a>` tag.
 *
 * @param {string} html - Raw HTML string.
 * @returns {string} HTML with all links opening in new tabs.
 */
function addBlankTargetToLinks(html: string): string {
  return html.replace(/<a\s/gi, '<a target="_blank" rel="noopener noreferrer" ');
}

/**
 * Extract metadata fields from the GKH metadata object.
 *
 * @param {Record<string, unknown>} meta - GKH metadata object.
 * @returns {MetadataFields} Metadata fields.
 */
function extractMetadataFields(meta: Record<string, unknown>): MetadataFields {
  // Get the resource type
  const resourceType = meta.resource_type as
    | { id?: string; title?: Record<string, string> }
    | undefined;

  // Get the `creatibutors` (creators + contributors)
  const creators = (meta.creators as GkhContributor[] | undefined) ?? [];
  const contributors = (meta.contributors as GkhContributor[] | undefined) ?? [];

  // Return the metadata fields
  return {
    title: resolveI18n(meta.title),
    description: resolveI18n(meta.description),
    publicationDate: resolveI18n(meta.publication_date),
    publisher: resolveI18n(meta.publisher),
    resourceTypeTitle: resolveI18n(resourceType?.title),
    baseType: meta.base_type as string | undefined,
    creators,
    contributors,
    contactPersons: contributors.filter((c) => c.role?.id === 'contactperson'),
    otherContributors: contributors.filter((c) => c.role?.id !== 'contactperson'),
    subjects: (meta.subjects as GkhSubject[] | undefined) ?? [],
    languages: (meta.languages as GkhLanguage[] | undefined) ?? [],
    rights: (meta.rights as GkhRight[] | undefined) ?? [],
    targetAudiences: (meta.target_audiences as GkhTargetAudience[] | undefined) ?? [],
    relatedIdentifiers: (meta.related_identifiers as GkhRelatedIdentifier[] | undefined) ?? [],
    engagementPriorities: (meta.engagement_priorities as GkhEngagementPriority[] | undefined) ?? [],
    gwpActivity: meta.geo_work_programme_activity as GkhGeoWorkProgrammeActivity | undefined,
  };
}

/**
 * Close button component.
 *
 * @param {Function} onClick - Callback function to be called when the button is clicked.
 * @returns {JSX.Element} Close button element.
 *
 * @component
 */
function CloseButton({ onClick }: { onClick: () => void }): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}

/**
 * Modal backdrop and container.
 *
 * @param {React.ReactNode} children - Content to display inside the modal.
 * @param {string} maxWidth - Maximum width of the modal.
 * @param {React.ReactNode} stickyHeader - Sticky header to display inside the modal.
 * @param {boolean} stickyAlwaysVisible - Whether the sticky header should be always visible.
 *
 * @returns {JSX.Element} Modal shell element.
 *
 * @component
 */
function ModalShell({
  children,
  maxWidth = 'max-w-4xl',
  stickyHeader,
  stickyAlwaysVisible = false,
}: ModalShellProps): JSX.Element {
  // Create a reference to the scrollable container.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  // Lock body scroll while modal is open
  // Added to prevent weird behaviors
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Show the sticky header when the user scrolls past a threshold.
  useEffect(() => {
    // Skip if the sticky header is always visible or not present
    if (stickyAlwaysVisible || !stickyHeader) {
      return;
    }

    // Get the scrollable container
    const scrollableContainer = scrollRef.current;
    if (!scrollableContainer) {
      return;
    }

    // Set the sticky header visibility based on the scroll position
    const onScroll = () => setShowSticky(scrollableContainer.scrollTop > 80);
    scrollableContainer.addEventListener('scroll', onScroll, { passive: true });

    return () => scrollableContainer.removeEventListener('scroll', onScroll);
  }, [stickyHeader, stickyAlwaysVisible]);

  // Determine if the sticky header should be visible.
  const stickyVisible = stickyAlwaysVisible || showSticky;

  // Render into document.body so the backdrop is viewport-relative and covers the entire page (blur edge-to-edge).
  const backdrop = (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        ref={scrollRef}
        className={`relative mx-auto max-h-[90vh] w-full ${maxWidth} overflow-y-auto overscroll-contain rounded-lg bg-white shadow-xl`}
      >
        {/* Sticky header */}
        {stickyHeader && (
          <div
            className={`sticky top-0 z-10 transition-[max-height,opacity] duration-200 ${
              stickyVisible ? 'max-h-screen opacity-100' : 'max-h-0 overflow-hidden opacity-0'
            }`}
          >
            {stickyHeader}
          </div>
        )}

        {/* Main content */}
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return backdrop;
  }
  return createPortal(backdrop, document.body);
}

/**
 * Sidebar section component.
 *
 * @param {string} title - The title of the section.
 * @param {React.ReactNode} children - The content of the section.
 * @returns {JSX.Element} Sidebar section element.
 *
 * @component
 */
function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  // Render
  return (
    <div className="border-t border-gray-100 pt-4">
      <h4 className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">{title}</h4>
      {children}
    </div>
  );
}

/**
 * Tag list component.
 *
 * @param {string[]} items - The list of items to display.
 * @returns {JSX.Element} Tag list element.
 *
 * @component
 */
function TagList({ items }: { items: string[] }): JSX.Element {
  // If there are no items, return a placeholder
  if (items.length === 0) {
    return <p className="text-sm text-gray-400">Not specified</p>;
  }

  // Render the tag list
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={i}
          className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/**
 * Resource overview modal.
 *
 * @param {boolean} open - Whether the modal is visible.
 * @param {Function} onClose - Called when the modal is dismissed.
 * @param {Resource} data - Resource data to display.
 *
 * @returns {JSX.Element | null} The rendered modal or null when closed.
 *
 * @component
 */
export function ResourceOverviewModal({
  open,
  onClose,
  data,
}: ResourceOverviewModalProps): JSX.Element | null {
  // Skip if the modal is not visible
  if (!open) {
    return null;
  }

  // Render!
  return (
    <ModalShell>
      <div className="mb-6 flex items-start justify-between">
        {/* Title */}
        <h3 className="text-2xl font-semibold text-gray-900">{data.name}</h3>

        {/* Close button */}
        <CloseButton onClick={onClose} />
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-6 text-sm text-gray-800 md:grid-cols-2">
        {/* Name */}
        <div>
          <h4 className="mb-1 font-semibold text-gray-700">Name</h4>
          <p>{data.name}</p>
        </div>

        {/* License */}
        <div>
          <h4 className="mb-1 font-semibold text-gray-700">License</h4>
          <p>{data.license || 'Not specified'}</p>
        </div>

        {/* Overview */}
        <div className="md:col-span-2">
          <h4 className="mb-1 font-semibold text-gray-700">Overview</h4>
          <p>{data.overview || 'Not specified'}</p>
        </div>

        {/* Contributors */}
        <div>
          <h4 className="mb-1 font-semibold text-gray-700">Contributors</h4>
          <p>{data.contributors?.join(', ') || 'Not specified'}</p>
        </div>

        {/* Subjects */}
        <div>
          <h4 className="mb-1 font-semibold text-gray-700">Subjects</h4>
          <p>{data.subjects || 'Not specified'}</p>
        </div>

        {/* Associated GEO Work Programme Activity */}
        <div>
          <h4 className="mb-1 font-semibold text-gray-700">
            Associated GEO Work Programme Activity
          </h4>
          <p>{data.geo_gwp || 'Not specified'}</p>
        </div>

        {/* Target Audience */}
        <div>
          <h4 className="mb-1 font-semibold text-gray-700">Target Audience</h4>
          <p>{data.target_audiences?.join(', ') || 'Not specified'}</p>
        </div>

        {/* SDGs / GEO Focus Areas */}
        <div className="md:col-span-2">
          <h4 className="mb-1 font-semibold text-gray-700">SDGs / GEO Focus Areas</h4>
          <div className="mt-2 flex flex-wrap gap-4">
            {data.geo_themes
              ? data.geo_themes.map((theme, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span>{theme}</span>
                  </div>
                ))
              : 'Not specified'}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

/**
 * Metadata header component.
 *
 * @param {MetadataFields} fields - Metadata fields.
 * @param {string} fallbackTitle - Fallback title.
 * @returns {JSX.Element} Metadata header element.
 *
 * @component
 */
function MetadataHeader({
  fields,
  fallbackTitle,
}: {
  fields: MetadataFields;
  fallbackTitle: string;
}) {
  // Get the creator names
  const creatorNames = fields.creators.map((c) => c.person_or_org.name);

  // Render!
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        {/* Resource type title */}
        {fields.resourceTypeTitle && (
          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
            {fields.resourceTypeTitle}
          </span>
        )}

        {/* Publication date */}
        {fields.publicationDate && (
          <span className="text-sm text-gray-500">
            Published {formatDate(fields.publicationDate)}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
        {fields.title ?? fallbackTitle}
      </h2>

      {/* Creators */}
      {creatorNames.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">{creatorNames.join(' · ')}</p>
      )}

      {/* Contact persons */}
      {fields.contactPersons.length > 0 && (
        <p className="mt-1 text-sm text-gray-500">
          <span className="font-medium">Contact persons:</span>{' '}
          {fields.contactPersons.map((c) => c.person_or_org.name).join(' · ')}
        </p>
      )}

      {/* Other contributors */}
      {fields.otherContributors.length > 0 && (
        <p className="mt-1 text-sm text-gray-500">
          <span className="font-medium">Others:</span>{' '}
          {fields.otherContributors.map((c) => c.person_or_org.name).join(' · ')}
        </p>
      )}
    </div>
  );
}

/**
 * Related works component.
 *
 * @param {GkhRelatedIdentifier[]} items - Related works items.
 * @returns {JSX.Element} Related works element.
 *
 * @component
 */
function RelatedWorks({ items }: { items: GkhRelatedIdentifier[] }) {
  // Skip if there are no related works
  if (items.length === 0) {
    return null;
  }

  // Render!
  return (
    <section>
      {/* Title */}
      <h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
        Related Works ({items.length})
      </h3>

      {/* Related works list */}
      <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
        {items.map((rel, i) => {
          // Get the href
          const href =
            rel.scheme === 'doi'
              ? `https://doi.org/${rel.identifier}`
              : rel.identifier.startsWith('http')
                ? rel.identifier
                : undefined;

          // Get the relation label
          const relationLabel = rel.relation_type
            ? resolveI18n(rel.relation_type.title)
            : undefined;

          // Render the inner content
          const inner = (
            <div className="flex min-w-0 items-center gap-3">
              <svg
                className="h-4 w-4 shrink-0 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              <span className="min-w-0 flex-1 truncate text-sm">{rel.title ?? rel.identifier}</span>
              {relationLabel && (
                <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                  {relationLabel}
                </span>
              )}
              {rel.scheme === 'doi' && (
                <span className="shrink-0 rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-bold text-yellow-800">
                  DOI
                </span>
              )}
            </div>
          );

          // Get the row class
          const rowClass = `px-4 py-2.5 ${i > 0 ? 'border-t border-gray-100' : ''}`;

          // Render the row
          return href ? (
            // Render the link
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block transition hover:bg-gray-50 ${rowClass}`}
            >
              {inner}
            </a>
          ) : (
            // Render the div
            <div key={i} className={rowClass}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Metadata body component.
 *
 * @param {MetadataFields} fields - Metadata fields.
 * @param {React.ReactNode} children - Children to display inside the metadata body.
 * @returns {JSX.Element} Metadata body element.
 *
 * @component
 */
function MetadataBody({
  fields,
  children,
}: {
  fields: MetadataFields;
  children?: React.ReactNode;
}) {
  // Collect detail items for the compact grid
  const detailItems: { label: string; value: string }[] = [];

  // Add publisher
  if (fields.publisher) {
    detailItems.push({ label: 'Publisher', value: fields.publisher });
  }

  // Add resource type
  if (fields.resourceTypeTitle) {
    detailItems.push({ label: 'Resource Type', value: fields.resourceTypeTitle });
  }

  // Add languages
  if (fields.languages.length > 0) {
    // Get the language names
    const languageNames = fields.languages
      .map((l) => resolveI18n(l.title))
      .filter(Boolean)
      .join(', ');

    // Save languages
    if (languageNames) {
      detailItems.push({ label: 'Languages', value: languageNames });
    }
  }

  // Render
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_260px]">
      {/* Main content */}
      <div className="space-y-6">
        {/* Description (external links always open in new tab) */}
        {fields.description && (
          <section>
            <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase">
              Description
            </h3>
            <div
              className="text-sm leading-relaxed text-gray-700 [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800 [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-gray-900 [&_li]:ml-4 [&_li]:list-disc [&_ol]:my-2 [&_ol]:space-y-1 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:space-y-1"
              dangerouslySetInnerHTML={{ __html: addBlankTargetToLinks(fields.description) }}
            />
          </section>
        )}

        {/* Injected content */}
        {children}
      </div>

      {/* Sidebar */}
      <aside className="space-y-4">
        {/* Details */}
        {detailItems.length > 0 && (
          // Render the sidebar section
          <SidebarSection title="Details">
            <div className="grid grid-cols-2 gap-2">
              {detailItems.map((item, i) => (
                <div
                  key={i}
                  className={`rounded-lg bg-gray-50 px-3 py-2 ${
                    detailItems.length % 2 !== 0 && i === detailItems.length - 1 ? 'col-span-2' : ''
                  }`}
                >
                  <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {/* Target audiences */}
        {fields.targetAudiences.length > 0 && (
          <SidebarSection title="Target Audience">
            <TagList
              items={fields.targetAudiences
                .map((a) => resolveI18n(a.title))
                .filter((s): s is string => !!s)}
            />
          </SidebarSection>
        )}

        {/* Subjects */}
        {fields.subjects.length > 0 && (
          <SidebarSection title="Keywords">
            <TagList items={fields.subjects.map((s) => s.subject)} />
          </SidebarSection>
        )}

        {/* Engagement priorities */}
        {fields.engagementPriorities.length > 0 && (
          <SidebarSection title="GEO Theme">
            <div className="space-y-1">
              {fields.engagementPriorities.map((ep, i) => (
                <p key={i} className="text-sm text-gray-700">
                  {resolveI18n(ep.title)}
                </p>
              ))}
            </div>
          </SidebarSection>
        )}

        {/* GEO work programme activity */}
        {fields.gwpActivity && (
          <SidebarSection title="GEO Work Programme Activity">
            <p className="text-sm text-gray-700">{resolveI18n(fields.gwpActivity.title)}</p>
          </SidebarSection>
        )}

        {/* Rights */}
        {fields.rights.length > 0 && (
          <SidebarSection title="Rights">
            <div className="space-y-2">
              {fields.rights.map((r, i) => (
                <div key={i}>
                  {r.props?.url ? (
                    <a
                      href={r.props.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {resolveI18n(r.title)}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{resolveI18n(r.title)}</p>
                  )}
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {/* Related identifiers */}
        {fields.relatedIdentifiers && <RelatedWorks items={fields.relatedIdentifiers} />}
      </aside>
    </div>
  );
}

/**
 * Resource browser component.
 *
 * @param {Record<string, unknown>[]} resources - Resources.
 * @param {string} activeCategory - Active category.
 * @param {function} onCategoryChange - Category change callback.
 * @param {function} onResourceSelect - Resource select callback.
 * @returns {JSX.Element} Resource browser element.
 *
 * @component
 */
function ResourceBrowser({
  resources,
  activeCategory,
  onCategoryChange,
  onResourceSelect,
}: {
  resources: Record<string, unknown>[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onResourceSelect: (index: number) => void;
}) {
  // State - Search query and current page
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Effect - Reset page
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Memoized - Group resources by base_type
  const { categories, grouped } = useMemo(() => {
    // Create a new map
    const grouped = new Map<string, { meta: Record<string, unknown>; originalIndex: number }[]>();

    // Loop through the resources
    resources.forEach((res, idx) => {
      // Get the base type
      const baseType = (res.base_type as string) ?? 'other';

      // Get the key
      const key = baseType.toLowerCase();

      // Add the resource to the map
      if (!grouped.has(key)) grouped.set(key, []);

      // Add the resource to the map
      grouped.get(key)!.push({ meta: res, originalIndex: idx });
    });

    // Get the categories
    const categories = Array.from(grouped.keys()).sort((a, b) => {
      if (a === 'other') return 1;
      if (b === 'other') return -1;
      return a.localeCompare(b);
    });

    // Done!
    return { categories, grouped };
  }, [resources]);

  // Memoized - Apply category + search filters
  const filteredResources = useMemo(() => {
    // Get the category filtered resources
    const categoryFiltered =
      activeCategory === ALL_CATEGORY
        ? // If all categories, return all resources
          resources.map((meta, originalIndex) => ({ meta, originalIndex }))
        : // If a specific category, return the resources for that category
          (grouped.get(activeCategory) ?? []);

    // If no search query, return the category filtered resources
    if (!searchQuery.trim()) {
      return categoryFiltered;
    }

    // Get the search query
    const q = searchQuery.toLowerCase();

    // Filter the resources
    return categoryFiltered.filter(({ meta }) => {
      const title = resolveI18n(meta.title)?.toLowerCase() ?? '';

      return title.includes(q);
    });
  }, [resources, grouped, activeCategory, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / RESOURCES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * RESOURCES_PER_PAGE;
  const pageItems = filteredResources.slice(pageStart, pageStart + RESOURCES_PER_PAGE);

  // If there are no resources, return null
  if (resources.length === 0) {
    return null;
  }

  // Render!
  return (
    <section>
      {/* Title */}
      <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
        Knowledge Resources ({resources.length})
      </h3>

      {/* Category filters */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(ALL_CATEGORY)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
            activeCategory === ALL_CATEGORY
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({resources.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              activeCategory === cat
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {capitalizeBaseType(cat)} ({grouped.get(cat)?.length ?? 0})
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative mb-3">
        <svg
          className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resources by title..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Resources */}
      {pageItems.length === 0 ? (
        // If no resources, show a message
        <p className="py-6 text-center text-sm text-gray-400">No resources match your search.</p>
      ) : (
        // If there are resources, show the resources
        <div className="space-y-1.5">
          {pageItems.map(({ meta, originalIndex }) => {
            const resTitle = resolveI18n(meta.title) ?? `Resource ${originalIndex + 1}`;
            const resTypeTitle = resolveI18n(
              (meta.resource_type as { title?: Record<string, string> } | undefined)?.title,
            );

            return (
              <button
                key={originalIndex}
                onClick={() => onResourceSelect(originalIndex)}
                className="group flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-left transition hover:border-gray-200 hover:bg-gray-100/80"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-gray-950">
                    {resTitle}
                  </p>
                  {resTypeTitle && <p className="mt-0.5 text-xs text-gray-500">{resTypeTitle}</p>}
                </div>
                <svg
                  className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination footer */}
      {filteredResources.length > RESOURCES_PER_PAGE && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {pageStart + 1} -{' '}
            {Math.min(pageStart + RESOURCES_PER_PAGE, filteredResources.length)} of{' '}
            {filteredResources.length} resources
          </p>
          <div className="flex items-center gap-1">
            {/* Previous page button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
            >
              Prev
            </button>

            {/* Page buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  page === safePage
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next page button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Compact sticky header for the package / standalone view.
 *
 * @param {MetadataFields} fields - Metadata fields.
 * @param {string} fallbackTitle - Fallback title.
 * @param {function} onClose - Close callback.
 * @returns {JSX.Element} Package sticky header element.
 *
 * @component
 */
function PackageStickyHeader({
  fields,
  fallbackTitle,
  onClose,
}: {
  fields: MetadataFields;
  fallbackTitle: string;
  onClose: () => void;
}) {
  // Render!
  return (
    <div className="rounded-t-lg border-b border-gray-200 bg-white/95 px-6 py-3 backdrop-blur-sm md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {/* Resource type title */}
          {fields.resourceTypeTitle && (
            <span className="shrink-0 rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-medium text-white">
              {/* Resource type title */}
              {fields.resourceTypeTitle}
            </span>
          )}

          {/* Title */}
          <h2 className="truncate text-base font-semibold text-gray-900">
            {fields.title ?? fallbackTitle}
          </h2>
        </div>
        <CloseButton onClick={onClose} />
      </div>
    </div>
  );
}

/**
 * Sticky navbar for the resource detail view inside a package.
 *
 * @param {string} packageTitle - Package title.
 * @param {string} resourceTitle - Resource title.
 * @param {Record<string, unknown>[]} resources - Resources.
 * @param {number} activeResourceIdx - Active resource index.
 * @param {function} onBackToPackage - Back to package callback.
 * @param {function} onResourceSelect - Resource select callback.
 * @param {function} onClose - Close callback.
 * @returns {JSX.Element} Resource navbar element.
 */
function ResourceNavbar({
  packageTitle,
  resourceTitle,
  resources,
  activeResourceIdx,
  onBackToPackage,
  onResourceSelect,
  onClose,
}: {
  packageTitle: string;
  resourceTitle: string;
  resources: Record<string, unknown>[];
  activeResourceIdx: number;
  onBackToPackage: () => void;
  onResourceSelect: (index: number) => void;
  onClose: () => void;
}) {
  // State - Menu open state and search query
  const [menuOpen, setMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [navCategory, setNavCategory] = useState(ALL_CATEGORY);

  // Effect - Reset search query when menu is closed
  useEffect(() => {
    if (!menuOpen) {
      setNavSearch('');
    }
  }, [menuOpen]);

  // Memoized - Group resources by base type
  const { categories, grouped } = useMemo(() => {
    // Create a new map
    const grouped = new Map<string, { meta: Record<string, unknown>; originalIndex: number }[]>();

    // Loop through the resources
    resources.forEach((res, idx) => {
      // Get the base type
      const bt = ((res.base_type as string) ?? 'other').toLowerCase();

      // Add the resource to the map
      if (!grouped.has(bt)) {
        grouped.set(bt, []);
      }

      // Add the resource to the map
      grouped.get(bt)!.push({ meta: res, originalIndex: idx });
    });

    // Get the categories
    const categories = Array.from(grouped.keys()).sort((a, b) => {
      if (a === 'other') return 1;
      if (b === 'other') return -1;

      return a.localeCompare(b);
    });

    // Done!
    return { categories, grouped };
  }, [resources]);

  // Memoized - Apply category + search filters
  const filteredResources = useMemo(() => {
    // Get the category filtered resources
    const catFiltered =
      navCategory === ALL_CATEGORY
        ? resources.map((meta, originalIndex) => ({ meta, originalIndex }))
        : (grouped.get(navCategory) ?? []);

    // If no search query, return the category filtered resources
    if (!navSearch.trim()) {
      return catFiltered;
    }

    // Get the search query
    const q = navSearch.toLowerCase();

    // Another filter and we are fine
    return catFiltered.filter(({ meta }) => {
      const title = resolveI18n(meta.title)?.toLowerCase() ?? '';
      return title.includes(q);
    });
  }, [resources, grouped, navCategory, navSearch]);

  // Render!
  return (
    <div className="rounded-t-lg border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      {/* Breadcrumb bar */}
      <div className="flex items-center justify-between gap-3 px-6 py-3 md:px-8">
        <nav className="flex min-w-0 items-center gap-1.5 text-sm">
          {/* Back to package button */}
          <button
            onClick={onBackToPackage}
            className="shrink-0 font-medium text-gray-900 transition hover:text-gray-600 hover:underline"
          >
            Back to package
          </button>

          {/* Arrow icon */}
          <svg
            className="h-3.5 w-3.5 shrink-0 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>

          {/* Resource title */}
          <span className="truncate text-gray-600">{resourceTitle}</span>
        </nav>

        <div className="flex items-center gap-2">
          {/* Browse button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              menuOpen ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {/* Browse icon */}
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            Browse
          </button>

          {/* Close button */}
          <CloseButton onClick={onClose} />
        </div>
      </div>

      {/* Expandable menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-gray-50/80 px-6 pt-3 pb-4 md:px-8">
          {/* Categories */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {/* All button */}
            <button
              onClick={() => setNavCategory(ALL_CATEGORY)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                navCategory === ALL_CATEGORY
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({resources.length})
            </button>

            {/* Category buttons */}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setNavCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  navCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {capitalizeBaseType(cat)} ({grouped.get(cat)?.length ?? 0})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <svg
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Scrollable resource list */}
          <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white">
            {filteredResources.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                No resources match your search.
              </p>
            ) : (
              // If there are resources, show the resources
              filteredResources.map(({ meta, originalIndex }) => {
                // Get the title, type, and active state
                const title = resolveI18n(meta.title) ?? `Resource ${originalIndex + 1}`;

                // Get the type
                const resType = resolveI18n(
                  (meta.resource_type as { title?: Record<string, string> } | undefined)?.title,
                );

                // Get the active state
                const isActive = originalIndex === activeResourceIdx;

                return (
                  <button
                    key={originalIndex}
                    onClick={() => {
                      onResourceSelect(originalIndex);
                      setMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 border-b border-gray-50 px-4 py-2.5 text-left transition last:border-b-0 ${
                      isActive ? 'border-l-2 border-l-gray-900 bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Resource title and type */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm ${isActive ? 'font-medium text-gray-900' : 'text-gray-700'}`}
                      >
                        {title}
                      </p>
                      {resType && <p className="text-xs text-gray-500">{resType}</p>}
                    </div>

                    {/* Active state */}
                    {isActive && (
                      <span className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                        Current
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Modal for the GKH metadata.
 *
 * @param {GkhMetadataModalProps} props - Component props.
 * @param {boolean} props.open - Whether the modal is visible.
 * @param {Function} props.onClose - Close callback.
 * @param {Resource} props.data - Resource data.
 * @param {SyncMetadata} props.syncMetadata - Sync metadata.
 *
 * @returns {JSX.Element | null} Rendered modal or null when closed.
 *
 * @component
 */
export function GkhMetadataModal({
  open,
  onClose,
  data,
  syncMetadata,
}: GkhMetadataModalProps): JSX.Element | null {
  // State - Active view and resource index
  const [activeView, setActiveView] = useState<'package' | 'resource'>('package');
  const [activeResourceIdx, setActiveResourceIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  // Effect - Reset navigation when modal opens/closes
  useEffect(() => {
    if (open) {
      setActiveView('package');
      setActiveResourceIdx(null);
      setActiveCategory(ALL_CATEGORY);
    }
  }, [open]);

  // If the modal is not open, return null
  if (!open) {
    return null;
  }

  // Get the package metadata
  const packageMeta = syncMetadata.package ?? syncMetadata.record ?? null;
  if (!packageMeta) {
    return null;
  }

  // Get the package fields
  const packageFields = extractMetadataFields(packageMeta);

  // Get the package resources
  const packageResources = syncMetadata.resources ?? [];
  const isPackage = !!syncMetadata.package && packageResources.length > 0;
  const packageTitle = packageFields.title ?? data.name;

  // Resource detail view
  if (activeView === 'resource' && activeResourceIdx !== null) {
    // Get the resource metadata
    const resourceMeta = packageResources[activeResourceIdx];
    if (!resourceMeta) {
      return null;
    }

    // Get the resource fields
    const resourceFields = extractMetadataFields(resourceMeta);
    const resourceTitle = resourceFields.title ?? `Resource ${activeResourceIdx + 1}`;

    // Render!
    return (
      <ModalShell
        maxWidth="max-w-5xl"
        stickyHeader={
          <ResourceNavbar
            packageTitle={packageTitle}
            resourceTitle={resourceTitle}
            resources={packageResources}
            activeResourceIdx={activeResourceIdx}
            onBackToPackage={() => {
              setActiveView('package');
              setActiveResourceIdx(null);
            }}
            onResourceSelect={(idx) => setActiveResourceIdx(idx)}
            onClose={onClose}
          />
        }
        stickyAlwaysVisible
      >
        <div className="animate-fade-in">
          <MetadataHeader fields={resourceFields} fallbackTitle={resourceTitle} />
          <MetadataBody fields={resourceFields} />
        </div>
      </ModalShell>
    );
  }

  // Render!
  return (
    <ModalShell
      maxWidth="max-w-5xl"
      stickyHeader={
        <PackageStickyHeader fields={packageFields} fallbackTitle={data.name} onClose={onClose} />
      }
    >
      <div className="animate-fade-in">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <MetadataHeader fields={packageFields} fallbackTitle={data.name} />
          </div>
          <CloseButton onClick={onClose} />
        </div>

        {/* Metadata body */}
        <MetadataBody fields={packageFields}>
          {isPackage && (
            // If there are resources, show the resource browser
            <ResourceBrowser
              resources={packageResources}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onResourceSelect={(idx) => {
                setActiveResourceIdx(idx);
                setActiveView('resource');
              }}
            />
          )}
        </MetadataBody>
      </div>
    </ModalShell>
  );
}
