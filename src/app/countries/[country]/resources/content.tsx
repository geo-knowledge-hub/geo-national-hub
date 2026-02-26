/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useMemo, JSX } from 'react';
import { Search, X, ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown } from 'lucide-react';

import Image from 'next/image';

import {
  BackButton,
  ResourceOverviewDialog,
  GkhMetadataDialog,
  ResourceActions,
} from '@components/global';
import { useGkhHealth } from '@lib/hooks/use-gkh-health';
import { getAssetPath } from '@lib/utils';
import type { Country, FocusArea, FocusAreaChallenge, Resource } from '@content-types/content';

/**
 * Per-page options for pagination.
 */
const PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

/**
 * Max number of challenge pills to show before collapsing.
 */
const CHALLENGES_PREVIEW_COUNT = 5;

/**
 * Properties expected for the ResourcesPageContent component.
 */
interface ResourcesPageContentProps {
  countryData: Country;
  resources: Resource[];
  challenges: FocusAreaChallenge[];
  focusAreas: FocusArea[];
  initialFocus?: string;
  initialType?: string;
}

/**
 * Simple text search filter across multiple string fields.
 */
function filterBySearch<T>(items: T[], term: string, fields: (keyof T)[]): T[] {
  // If the search term is empty, return all items
  if (!term.trim()) {
    return items;
  }

  // Convert the search term to lowercase
  const q = term.toLowerCase();

  // Filter the items
  return items.filter((item) =>
    fields.some((field) => {
      const v = item[field];
      return typeof v === 'string' && v.toLowerCase().includes(q);
    }),
  );
}

/**
 * Resources page content component.
 *
 *
 * @component
 * @param {ResourcesPageContentProps} props - Component props.
 * @returns {JSX.Element} The rendered ResourcesPageContent component.
 */
export function ResourcesPageContent({
  countryData,
  resources,
  challenges,
  focusAreas,
  initialFocus,
  initialType,
}: ResourcesPageContentProps): JSX.Element {
  // State - Search term
  const [searchTerm, setSearchTerm] = useState('');

  // State - Selected type
  const [selectedType, setSelectedType] = useState<string>(initialType ?? '');

  // State - Selected challenge
  const [selectedChallenge, setSelectedChallenge] = useState<string>('');

  // State - Challenges expanded
  const [challengesExpanded, setChallengesExpanded] = useState(false);

  // State - Filters open
  const [filtersOpen, setFiltersOpen] = useState(false);

  // State - Current page
  const [currentPage, setCurrentPage] = useState(1);

  // State - Per page
  const [perPage, setPerPage] = useState<(typeof PER_PAGE_OPTIONS)[number]>(5);

  // State - Overview resource
  const [overviewResource, setOverviewResource] = useState<Resource | null>(null);

  // State - Metadata resource
  const [metadataResource, setMetadataResource] = useState<Resource | null>(null);

  // State - GKH health
  const { online: gkhOnline } = useGkhHealth();

  // Context - Locked focus area from URL
  const challengeFocusMap = useMemo(() => {
    // Build a lookup: challenge id → set of focus area ids
    const map = new Map<string, Set<string>>();

    // Build the lookup table
    challenges.forEach((ch) => {
      map.set(ch.id, new Set(ch.tags ?? []));
    });
    return map;
  }, [challenges]);

  // Resolve focus area name from id
  const lockedFocusArea = useMemo(
    () => (initialFocus ? (focusAreas.find((fa) => fa.id === initialFocus) ?? null) : null),
    [initialFocus, focusAreas],
  );

  // Filter - Resources matching the locked focus area (if any)
  const baseResources = useMemo(() => {
    // If there is no initial focus, return all resources
    if (!initialFocus) {
      return resources;
    }

    // Filter the resources
    return resources.filter((r) =>
      (r.challenges ?? []).some((cid) => {
        // Get the focus area ids
        const faIds = challengeFocusMap.get(cid);

        // Check if the focus area id is in the initial focus
        return faIds?.has(initialFocus);
      }),
    );
  }, [resources, initialFocus, challengeFocusMap]);

  // Available types
  const availableTypes = useMemo(() => {
    // Build a map of type counts
    const counts = new Map<string, number>();

    // Count the types
    baseResources.forEach((r) => {
      if (r.type) counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
    });

    // Sort the types
    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([type, count]) => ({ type, count }));
  }, [baseResources]);

  // Available challenges
  const availableChallenges = useMemo(() => {
    // Build a map of challenge counts
    const counts = new Map<string, number>();

    // Count the challenges
    baseResources.forEach((r) => {
      (r.challenges ?? []).forEach((cid) => {
        counts.set(cid, (counts.get(cid) ?? 0) + 1);
      });
    });

    // Filter the challenges
    return challenges
      .filter((ch) => counts.has(ch.id))
      .map((ch) => ({ ...ch, count: counts.get(ch.id)! }))
      .sort((a, b) => b.count - a.count);
  }, [baseResources, challenges]);

  // Apply text search + type + challenge filters
  const filteredResources = useMemo(() => {
    // Start with the base resources
    let result = baseResources;

    // Filter the resources
    result = filterBySearch(result, searchTerm, ['name', 'description', 'type', 'organization']);

    // Filter the resources by type
    if (selectedType) {
      result = result.filter((r) => r.type === selectedType);
    }

    // Filter the resources by challenge
    if (selectedChallenge) {
      result = result.filter((r) => (r.challenges ?? []).includes(selectedChallenge));
    }

    // Return the filtered resources
    return result;
  }, [baseResources, searchTerm, selectedType, selectedChallenge]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / perPage));

  // Paginated resources
  const paginatedResources = useMemo(() => {
    // Calculate the start index
    const start = (currentPage - 1) * perPage;

    // Return the paginated resources
    return filteredResources.slice(start, start + perPage);
  }, [filteredResources, currentPage, perPage]);

  // Function - Apply type filter
  const applyType = (type: string) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  // Function - Apply search filter
  const applySearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Apply per page filter
  const applyPerPage = (pp: (typeof PER_PAGE_OPTIONS)[number]) => {
    setPerPage(pp);
    setCurrentPage(1);
  };

  // Apply challenge filter
  const applyChallenge = (challenge: string) => {
    setSelectedChallenge(challenge);
    setCurrentPage(1);
  };

  // Function - Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedChallenge('');
    setCurrentPage(1);
  };

  // Function - Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination page numbers
  const pageNumbers = useMemo(() => {
    // Build the page numbers
    const pages: (number | 'ellipsis')[] = [];

    // Assumption: if there are less than 7 pages, show all pages
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Now, if there are more than 7 pages, show the first, last, and the current page +/- 1

      pages.push(1);

      // If the current page is more than 3, show an ellipsis
      if (currentPage > 3) pages.push('ellipsis');

      // Show the current page +/- 1
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      // If the current page is less than the total pages - 2, show an ellipsis
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Show the last page
      pages.push(totalPages);
    }

    // Return the page numbers
    return pages;
  }, [totalPages, currentPage]);

  // Has active filters
  const hasActiveFilters = !!searchTerm || !!selectedType || !!selectedChallenge;

  return (
    <div className="min-h-screen">
      {/* Hero / Search header */}
      <div
        className="relative overflow-hidden border-b border-gray-100"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--theme-primary, #526479) 5%, #f8f8f7) 0%, #ffffff 65%)',
        }}
      >
        <div
          className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-[0.07]"
          style={{
            background:
              'radial-gradient(circle, var(--theme-primary, #526479) 0%, transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute right-24 -bottom-20 h-64 w-64 rounded-full opacity-[0.04]"
          style={{
            background:
              'radial-gradient(circle, var(--theme-primary, #526479) 0%, transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-10">
          <div className="mb-7">
            <BackButton />
          </div>

          <div className="flex items-center justify-between gap-10">
            {/* Title + meta + search */}
            <div className="flex-1">
              {lockedFocusArea && (
                <p
                  className="mb-2 text-[11px] font-semibold tracking-[0.18em] uppercase"
                  style={{ color: 'var(--theme-primary, #526479)', opacity: 0.65 }}
                >
                  Focus Area
                </p>
              )}

              <h1 className="themed-title mb-2.5 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {lockedFocusArea ? lockedFocusArea.name : 'Resources'}
              </h1>

              <p className="mb-8 text-sm text-gray-400">
                <span className="font-medium text-gray-600">{baseResources.length}</span>{' '}
                {baseResources.length === 1 ? 'resource' : 'resources'} available
                {lockedFocusArea && <> &middot; {countryData.title}</>}
              </p>

              <div className="relative max-w-xl">
                <div className="relative flex items-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all focus-within:border-[color:var(--theme-primary,#526479)]/50 focus-within:shadow-md focus-within:ring-2 focus-within:ring-[color:var(--theme-primary,#526479)]/10">
                  <div className="pointer-events-none flex items-center pl-4">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search resources, datasets, tools…"
                    value={searchTerm}
                    onChange={(e) => applySearch(e.target.value)}
                    className="flex-1 border-0 bg-transparent py-3.5 pr-4 pl-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => applySearch('')}
                      className="mr-3 flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {lockedFocusArea?.logo && (
              <div className="hidden shrink-0 md:flex md:items-center md:justify-center">
                <div className="relative">
                  <div
                    className="pointer-events-none absolute inset-0 -m-10 rounded-full blur-3xl"
                    style={{
                      backgroundColor:
                        'color-mix(in srgb, var(--theme-primary, #526479) 18%, transparent)',
                    }}
                  />
                  <Image
                    src={getAssetPath(lockedFocusArea.logo)}
                    alt={lockedFocusArea.name}
                    width={192}
                    height={192}
                    className="relative h-48 w-48 object-contain drop-shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters + Results */}
      <div className="mx-auto max-w-7xl px-6 py-8 pb-16">
        {/* Results bar */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-gray-500">
            <span className="font-semibold text-gray-900">
              {filteredResources.length.toLocaleString()}
            </span>{' '}
            {filteredResources.length === 1 ? 'result' : 'results'}
            {hasActiveFilters && (
              <>
                {' '}
                &mdash;{' '}
                <button
                  onClick={clearFilters}
                  className="font-medium underline underline-offset-2 transition hover:text-gray-700"
                  style={{ color: 'var(--theme-primary, #526479)' }}
                >
                  clear filters
                </button>
              </>
            )}
          </p>

          <div className="flex items-center gap-2">
            {(availableTypes.length > 0 || availableChallenges.length > 0) && (
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`relative inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  filtersOpen
                    ? 'border-gray-300 bg-white text-gray-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {hasActiveFilters && (
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: 'var(--theme-primary, #526479)' }}
                  >
                    {(selectedType ? 1 : 0) + (selectedChallenge ? 1 : 0)}
                  </span>
                )}
                <ChevronDown
                  className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`}
                />
              </button>
            )}

            <div className="flex rounded-lg border border-gray-200 bg-white">
              {PER_PAGE_OPTIONS.map((n, i) => (
                <button
                  key={n}
                  onClick={() => applyPerPage(n)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    i > 0 ? 'border-l border-gray-200' : ''
                  } ${perPage === n ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  style={
                    perPage === n ? { backgroundColor: 'var(--theme-primary, #526479)' } : undefined
                  }
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: filtersOpen ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.2s ease',
          }}
        >
          <div className="overflow-hidden">
            <div className="mb-5 overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50">
              {availableTypes.length > 0 && (
                <div className="flex items-start gap-5 px-5 py-4">
                  <span className="mt-1 w-20 shrink-0 text-[10px] font-semibold tracking-[0.13em] text-gray-400 uppercase">
                    Type
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => applyType('')}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        selectedType === ''
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      All
                      <span
                        className={`rounded-full px-1.5 py-0 text-[10px] font-semibold ${selectedType === '' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {baseResources.length}
                      </span>
                    </button>

                    {availableTypes.map(({ type, count }) => (
                      <button
                        key={type}
                        onClick={() => applyType(selectedType === type ? '' : type)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                          selectedType === type
                            ? 'text-white shadow-sm'
                            : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        style={
                          selectedType === type
                            ? { backgroundColor: 'var(--theme-primary, #526479)' }
                            : undefined
                        }
                      >
                        {type}
                        <span
                          className={`rounded-full px-1.5 py-0 text-[10px] font-semibold ${selectedType === type ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}
                        >
                          {count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableTypes.length > 0 && availableChallenges.length > 0 && (
                <div className="mx-5 border-t border-gray-100" />
              )}

              {availableChallenges.length > 0 && (
                <div className="flex items-start gap-5 px-5 py-4">
                  <span className="mt-1 w-20 shrink-0 text-[10px] font-semibold tracking-[0.13em] text-gray-400 uppercase">
                    Challenge
                  </span>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => applyChallenge('')}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        selectedChallenge === ''
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      All
                    </button>
                    {(challengesExpanded
                      ? availableChallenges
                      : availableChallenges.slice(0, CHALLENGES_PREVIEW_COUNT)
                    ).map(({ id, title, count }) => (
                      <button
                        key={id}
                        onClick={() => applyChallenge(selectedChallenge === id ? '' : id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                          selectedChallenge === id
                            ? 'text-white shadow-sm'
                            : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        style={
                          selectedChallenge === id
                            ? { backgroundColor: 'var(--theme-primary, #526479)' }
                            : undefined
                        }
                      >
                        {title}
                        <span
                          className={`rounded-full px-1.5 py-0 text-[10px] font-semibold ${selectedChallenge === id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}
                        >
                          {count}
                        </span>
                      </button>
                    ))}

                    {availableChallenges.length > CHALLENGES_PREVIEW_COUNT && (
                      <button
                        onClick={() => setChallengesExpanded(!challengesExpanded)}
                        className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs font-medium text-gray-400 transition-all hover:border-gray-400 hover:text-gray-600"
                      >
                        {challengesExpanded
                          ? 'Show less'
                          : `+${availableChallenges.length - CHALLENGES_PREVIEW_COUNT} more`}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filteredResources.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/60 py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <Search className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-base font-semibold text-gray-700">No results found</p>
            <p className="mt-1.5 text-sm text-gray-400">
              {hasActiveFilters ? (
                <>
                  Try adjusting filters or{' '}
                  <button
                    onClick={clearFilters}
                    className="font-medium underline underline-offset-2 transition hover:text-gray-700"
                    style={{ color: 'var(--theme-primary, #526479)' }}
                  >
                    clear all
                  </button>
                </>
              ) : (
                'No resources available for this selection.'
              )}
            </p>
          </div>
        )}

        {/* Result cards */}
        {filteredResources.length > 0 && (
          <div className="flex flex-col gap-4">
            {paginatedResources.map((item) => {
              // Define if whe must show the link
              const isGKHSource = item.source === 'geo-knowledge-hub';
              const showLink = (gkhOnline && isGKHSource) || !isGKHSource;

              return (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#526479]/20 hover:shadow-md"
                >
                  {/* Left accent line */}
                  <div
                    className="absolute inset-y-0 left-0 w-0.5 rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100"
                    style={{ backgroundColor: 'var(--theme-primary, #526479)' }}
                  />

                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className="hidden shrink-0 sm:block">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 transition"
                        style={
                          { '--hover-bg': 'var(--theme-primary, #526479)' } as React.CSSProperties
                        }
                      >
                        {item.icon ? (
                          <Image
                            src={getAssetPath(item.icon)}
                            alt={`${item.type} icon`}
                            width={22}
                            height={22}
                          />
                        ) : (
                          <svg
                            className="h-5 w-5 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Badges */}
                      <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-700 uppercase">
                          Open
                        </span>
                        {item.type && (
                          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                            {item.type}
                          </span>
                        )}
                        {item.uploaded && (
                          <span className="text-[11px] text-gray-400">{item.uploaded}</span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="mb-1.5 text-base leading-snug font-semibold text-gray-900 transition group-hover:text-[color:var(--theme-primary,#526479)]">
                        {showLink ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="after:absolute after:inset-0"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <span className="after:absolute after:inset-0">{item.name}</span>
                        )}
                      </h3>

                      {/* Description */}
                      <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
                        {item.description}
                      </p>

                      {/* Actions */}
                      <div className="relative z-10 mt-4">
                        <ResourceActions
                          resource={item}
                          gkhOnline={gkhOnline}
                          onOpenOverview={() => setOverviewResource(item)}
                          onOpenMetadata={() => setMetadataResource(item)}
                          linkClassName="text-sm font-medium transition focus:outline-none"
                          buttonClassName="cursor-pointer text-sm font-medium transition focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-0.5">
              {pageNumbers.map((p, i) =>
                p === 'ellipsis' ? (
                  <span key={`e-${i}`} className="px-2 text-sm text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`h-9 w-9 rounded-xl text-sm font-medium transition-all ${
                      currentPage === p ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={
                      currentPage === p
                        ? { backgroundColor: 'var(--theme-primary, #526479)' }
                        : undefined
                    }
                    aria-current={currentPage === p ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Pagination info */}
        {totalPages > 1 && (
          <p className="mt-3 text-center text-xs text-gray-400">
            Page {currentPage} of {totalPages} &mdash; {filteredResources.length.toLocaleString()}{' '}
            total results
          </p>
        )}
      </div>

      {/* Modals */}
      {overviewResource && (
        <ResourceOverviewDialog
          open={!!overviewResource}
          onClose={() => setOverviewResource(null)}
          data={overviewResource}
        />
      )}
      {metadataResource?.sync?.metadata && (
        <GkhMetadataDialog
          open={!!metadataResource}
          onClose={() => setMetadataResource(null)}
          data={metadataResource}
          syncMetadata={metadataResource.sync.metadata}
        />
      )}
    </div>
  );
}
