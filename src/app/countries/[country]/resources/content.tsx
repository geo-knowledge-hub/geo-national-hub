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
import { Search, X, SlidersHorizontal } from 'lucide-react';

import Image from 'next/image';

import {
  BackButton,
  ResourceOverviewDialog,
  GkhMetadataDialog,
  ResourceActions,
  FacetGroup,
  PerPageSelector,
  PaginationRow,
  PaginationInfo,
  EmptyState,
} from '@components/global';
import type { FacetItem } from '@components/global';
import { Button } from '@ui/button';
import { Badge } from '@ui/badge';
import { useGkhHealth } from '@lib/hooks/use-gkh-health';
import { usePagination } from '@lib/hooks/use-pagination';
import { filterBySearch, toggleArrayItem } from '@lib/search/utils';
import { getAssetPath } from '@lib/utils';
import type { Country, FocusArea, FocusAreaChallenge, Resource } from '@content-types/content';

/**
 * Knowledge Package value
 */
const KNOWLEDGE_PACKAGE = 'Knowledge Package';

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
 * Resources page content component.
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

  // State - Multi-select record type filters
  const [selectedRecordTypes, setSelectedRecordTypes] = useState<string[]>([]);

  // State - Multi-select type filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialType ? [initialType] : []);

  // State - Multi-select challenge filters
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);

  // State - Multi-select GEO theme filters
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  // State - Mobile filter visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // State - Overview resource
  const [overviewResource, setOverviewResource] = useState<Resource | null>(null);

  // State - Metadata resource
  const [metadataResource, setMetadataResource] = useState<Resource | null>(null);

  // State - GKH health
  const { online: gkhOnline } = useGkhHealth();

  // Context - Locked focus area from URL
  const challengeFocusMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
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
    if (!initialFocus) {
      return resources;
    }

    return resources.filter((r) =>
      (r.challenges ?? []).some((cid) => {
        const faIds = challengeFocusMap.get(cid);
        return faIds?.has(initialFocus);
      }),
    );
  }, [resources, initialFocus, challengeFocusMap]);

  // Record type facets (Knowledge Package vs Knowledge Resource)
  const recordTypeFacets: FacetItem[] = useMemo(() => {
    let kpCount = 0;
    let krCount = 0;
    const items: FacetItem[] = [];

    baseResources.forEach((r) => {
      if (r.type === KNOWLEDGE_PACKAGE) kpCount++;
      else krCount++;
    });

    if (kpCount > 0) {
      items.push({ value: 'Knowledge Package', count: kpCount });
    }

    if (krCount > 0) {
      items.push({ value: 'Knowledge Resource', count: krCount });
    }

    // Return the items
    return items;
  }, [baseResources]);

  // Type facets (computed from base resources, excluding Knowledge Package)
  const typeFacets: FacetItem[] = useMemo(() => {
    const counts = new Map<string, number>();

    baseResources.forEach((r) => {
      if (r.type && r.type !== KNOWLEDGE_PACKAGE) counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([type, count]) => ({ value: type, count }));
  }, [baseResources]);

  // Challenge facets (computed from base resources)
  const challengeFacets: FacetItem[] = useMemo(() => {
    const counts = new Map<string, number>();

    baseResources.forEach((r) => {
      (r.challenges ?? []).forEach((cid) => {
        counts.set(cid, (counts.get(cid) ?? 0) + 1);
      });
    });

    return challenges
      .filter((ch) => counts.has(ch.id))
      .map((ch) => ({ value: ch.id, count: counts.get(ch.id)! }))
      .sort((a, b) => b.count - a.count);
  }, [baseResources, challenges]);

  // Challenge id -> title lookup for display
  const challengeTitleMap = useMemo(() => {
    const map = new Map<string, string>();

    challenges.forEach((ch) => map.set(ch.id, ch.title));

    return map;
  }, [challenges]);

  // Challenge facets with display titles
  const challengeFacetsDisplay: FacetItem[] = useMemo(
    () =>
      challengeFacets.map((f) => ({
        value: challengeTitleMap.get(f.value) ?? f.value,
        count: f.count,
      })),
    [challengeFacets, challengeTitleMap],
  );

  // GEO Theme facets (computed from base resources)
  const themeFacets: FacetItem[] = useMemo(() => {
    const counts = new Map<string, number>();

    baseResources.forEach((r) => {
      (r.geo_themes ?? []).forEach((theme) => {
        counts.set(theme, (counts.get(theme) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([theme, count]) => ({ value: theme, count }));
  }, [baseResources]);

  // Apply text search + type + challenge + theme filters (multi-select)
  const filteredResources = useMemo(() => {
    let result = baseResources;

    result = filterBySearch(result, searchTerm, ['name', 'description', 'type', 'organization']);

    if (selectedRecordTypes.length > 0) {
      result = result.filter((r) => {
        const isKP = r.type === KNOWLEDGE_PACKAGE;

        if (selectedRecordTypes.includes('Knowledge Package') && isKP) {
          return true;
        }

        if (selectedRecordTypes.includes('Knowledge Resource') && !isKP) {
          return true;
        }

        // Return false if no match
        return false;
      });
    } else {
      // If no record type filters are selected, filter out Knowledge Package
      result = result.filter((r) => r.type !== KNOWLEDGE_PACKAGE);
    }

    if (selectedTypes.length > 0) {
      result = result.filter((r) => r.type && selectedTypes.includes(r.type));
    }

    if (selectedChallenges.length > 0) {
      // Map display titles back to challenge ids for filtering
      const selectedIds = selectedChallenges.map((title) => {
        const entry = challenges.find((ch) => ch.title === title);
        return entry ? entry.id : title;
      });

      result = result.filter((r) => (r.challenges ?? []).some((cid) => selectedIds.includes(cid)));
    }

    if (selectedThemes.length > 0) {
      result = result.filter((r) =>
        (r.geo_themes ?? []).some((theme) => selectedThemes.includes(theme)),
      );
    }

    return result;
  }, [
    baseResources,
    searchTerm,
    selectedRecordTypes,
    selectedTypes,
    selectedChallenges,
    selectedThemes,
    challenges,
  ]);

  // Pagination
  const {
    currentPage,
    perPage,
    totalPages,
    paginatedItems: paginatedResources,
    pageNumbers,
    handlePageChange,
    applyPerPage,
    resetPage,
  } = usePagination(filteredResources);

  // Toggle helpers
  const toggleRecordType = (val: string) => {
    setSelectedRecordTypes((prev) => toggleArrayItem(prev, val));
    resetPage();
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => toggleArrayItem(prev, type));
    resetPage();
  };

  const toggleChallenge = (title: string) => {
    setSelectedChallenges((prev) => toggleArrayItem(prev, title));
    resetPage();
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) => toggleArrayItem(prev, theme));
    resetPage();
  };

  // Function - Apply search filter
  const applySearch = (term: string) => {
    setSearchTerm(term);
    resetPage();
  };

  // Function - Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRecordTypes([]);
    setSelectedTypes([]);
    setSelectedChallenges([]);
    setSelectedThemes([]);
    resetPage();
  };

  // Has active filters
  const hasActiveFilters =
    !!searchTerm ||
    selectedRecordTypes.length > 0 ||
    selectedTypes.length > 0 ||
    selectedChallenges.length > 0 ||
    selectedThemes.length > 0;

  // Active filter count (for mobile badge)
  const activeFilterCount =
    selectedRecordTypes.length +
    selectedTypes.length +
    selectedChallenges.length +
    selectedThemes.length;

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <>
      {recordTypeFacets.length > 0 && (
        <FacetGroup
          title="Record Type"
          items={recordTypeFacets}
          selected={selectedRecordTypes}
          onToggle={toggleRecordType}
        />
      )}
      {typeFacets.length > 0 && (
        <FacetGroup
          title="Resource Type"
          items={typeFacets}
          selected={selectedTypes}
          onToggle={toggleType}
        />
      )}
      {challengeFacetsDisplay.length > 0 && (
        <FacetGroup
          title="Challenge"
          items={challengeFacetsDisplay}
          selected={selectedChallenges}
          onToggle={toggleChallenge}
        />
      )}
      {themeFacets.length > 0 && (
        <FacetGroup
          title="GEO Theme"
          items={themeFacets}
          selected={selectedThemes}
          onToggle={toggleTheme}
        />
      )}
    </>
  );

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

              <p className="text-sm text-gray-400">
                <span className="font-medium text-gray-600">{baseResources.length}</span>{' '}
                {baseResources.length === 1 ? 'resource' : 'resources'} available
                {lockedFocusArea && <> &middot; {countryData.title}</>}
              </p>
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

      {/* Sidebar Filters + Results */}
      <div className="mx-auto max-w-7xl px-6 py-8 pb-16">
        {/* Search bar */}
        <div className="mb-6">
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

        {/* Mobile filter toggle */}
        <div className="mb-4 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="gap-1.5"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                className="flex h-4 w-4 items-center justify-center p-0 text-[10px]"
                style={{
                  backgroundColor: 'var(--theme-primary, #526479)',
                  borderColor: 'transparent',
                }}
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Mobile filters panel */}
        {showMobileFilters && (
          <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50/50 p-4 md:hidden">
            {sidebarContent}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-8">{sidebarContent}</div>
          </aside>

          {/* Results column */}
          <div>
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

              <PerPageSelector value={perPage} onChange={applyPerPage} />
            </div>

            {/* Empty state */}
            {filteredResources.length === 0 && (
              <EmptyState hasActiveFilters={hasActiveFilters} onClearFilters={clearFilters} />
            )}

            {/* Result cards */}
            {filteredResources.length > 0 && (
              <div className="flex flex-col gap-4">
                {paginatedResources.map((item) => {
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
                              {
                                '--hover-bg': 'var(--theme-primary, #526479)',
                              } as React.CSSProperties
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
            <PaginationRow
              currentPage={currentPage}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              onPageChange={handlePageChange}
            />
            <PaginationInfo
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredResources.length}
            />
          </div>
        </div>
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
