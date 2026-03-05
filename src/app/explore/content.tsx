/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

import Image from 'next/image';

import { Search, X, SlidersHorizontal } from 'lucide-react';

import {
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

import { computePageNumbers, computeTotalPages, toggleArrayItem } from '@lib/search/utils';
import type { PerPageOption } from '@lib/search/utils';

import { useGkhHealth } from '@lib/hooks/use-gkh-health';
import { searchResourcesAction } from '@lib/typesense/actions';

import type { Resource, FocusAreaChallenge } from '@content-types/content';
import type { FacetsResult } from '@lib/typesense/queries';
import { getAssetPath } from '@lib/utils';

/**
 * Knowledge Package value
 */
const KNOWLEDGE_PACKAGE = 'Knowledge Package';

/**
 * Debounce delay in milliseconds
 */
const DEBOUNCE_DELAY = 400;

/**
 * Props for ExplorePageContent component
 */
interface ExplorePageContentProps {
  initialResources: Resource[];
  initialTotal: number;
  facets: FacetsResult;
  challenges: FocusAreaChallenge[];
}

/**
 * ExplorePageContent Component - Client component for resource exploration
 */
export function ExplorePageContent({
  initialResources,
  initialTotal,
  facets,
  challenges,
}: ExplorePageContentProps) {
  /**
   * State to manage the overview modal.
   */
  const [isOpen, setIsOpen] = useState(false);
  const [resource, setResource] = useState<Resource | null>(null);

  /**
   * State to manage the GKH metadata modal.
   */
  const [resourceForMetadata, setResourceForMetadata] = useState<Resource | null>(null);

  /**
   * GKH health - when offline, GKH resources show "View metadata" instead of "Access".
   */
  const { online: gkhOnline } = useGkhHealth();

  /**
   * States to manage search
   */
  const [query, setQuery] = useState('');
  const [selectedRecordTypes, setSelectedRecordTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<PerPageOption>(5);

  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [totalFound, setTotalFound] = useState(initialTotal);
  const [isSearching, setIsSearching] = useState(false);
  const [currentFacets, setCurrentFacets] = useState<FacetsResult>(facets);

  // Preserve initial facets so they never disappear when filtering
  const [initialRecordTypeFacets] = useState<FacetItem[]>(() => {
    let kpCount = 0;
    let krCount = 0;
    const items: FacetItem[] = [];

    (facets.type || []).forEach((f) => {
      if (f.value === KNOWLEDGE_PACKAGE) kpCount += f.count;
      else krCount += f.count;
    });

    if (kpCount > 0) {
      items.push({ value: 'Knowledge Package', count: kpCount });
    }

    if (krCount > 0) {
      items.push({ value: 'Knowledge Resource', count: krCount });
    }

    return items;
  });
  const [initialTypeFacets] = useState<FacetItem[]>(facets.type || []);
  const [initialCountryFacets] = useState<FacetItem[]>(facets.country || []);
  const [initialChallengeFacets] = useState<FacetItem[]>(facets.challenges || []);

  // Static stats — computed once on mount
  const [initialStaticTotal] = useState(initialTotal);
  const [initialTypeCount] = useState((facets.type || []).length);
  const [initialCountryCount] = useState((facets.country || []).length);

  // Mobile filters toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Build challenge title to ID map for filtering - memoized to prevent recreation
  const challengeMap = useMemo(() => {
    const map = new Map<string, string>();
    challenges.forEach((c) => {
      map.set(c.title, c.id);
    });
    return map;
  }, [challenges]);

  // Build reverse map: challenge ID to title
  const challengeIdToTitle = useMemo(() => {
    const map = new Map<string, string>();
    challenges.forEach((c) => {
      map.set(c.id, c.title);
    });
    return map;
  }, [challenges]);

  // Record type facet items
  const recordTypeFacetItems: FacetItem[] = useMemo(() => {
    let kpCount = 0;
    let krCount = 0;
    const items: FacetItem[] = [];

    (currentFacets.type || []).forEach((f) => {
      if (f.value === KNOWLEDGE_PACKAGE) kpCount += f.count;
      else krCount += f.count;
    });

    if (kpCount > 0 || initialRecordTypeFacets.some((f) => f.value === 'Knowledge Package')) {
      items.push({ value: 'Knowledge Package', count: kpCount });
    }
    if (krCount > 0 || initialRecordTypeFacets.some((f) => f.value === 'Knowledge Resource')) {
      items.push({ value: 'Knowledge Resource', count: krCount });
    }

    // Return the items
    return items;
  }, [currentFacets, initialRecordTypeFacets]);

  // Facet items with counts (excluding Knowledge Package)
  const typeFacetItems: FacetItem[] = useMemo(() => {
    const dynamicMap = new Map((currentFacets.type || []).map((f) => [f.value, f.count]));

    return initialTypeFacets
      .filter((f) => f.value !== KNOWLEDGE_PACKAGE)
      .map((f) => ({
        value: f.value,
        count: dynamicMap.get(f.value) ?? 0,
      }));
  }, [currentFacets, initialTypeFacets]);

  const countryFacetItems: FacetItem[] = useMemo(() => {
    const dynamicMap = new Map((currentFacets.country || []).map((f) => [f.value, f.count]));
    return initialCountryFacets.map((f) => ({
      value: f.value,
      count: dynamicMap.get(f.value) ?? 0,
    }));
  }, [currentFacets, initialCountryFacets]);

  // Map challenge ID facets to titles for display
  const challengeFacetItems: FacetItem[] = useMemo(() => {
    const dynamicMap = new Map((currentFacets.challenges || []).map((f) => [f.value, f.count]));
    return initialChallengeFacets
      .map((f) => ({
        value: challengeIdToTitle.get(f.value) || f.value,
        count: dynamicMap.get(f.value) ?? 0,
      }))
      .filter((f) => f.value !== f.value.toLowerCase()); // Filter out unmapped IDs
  }, [currentFacets, initialChallengeFacets, challengeIdToTitle]);

  // Get unique tags from challenges with counts (based on how many challenges have each tag)
  const tagFacetItems: FacetItem[] = useMemo(() => {
    const tagCounts = new Map<string, number>();
    challenges.forEach((c) => {
      c.tag_names?.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCounts.entries()).map(([value, count]) => ({ value, count }));
  }, [challenges]);

  // Get challenge IDs that match selected tags (for tag-based filtering)
  const challengeIdsFromTags = useMemo(() => {
    if (selectedTags.length === 0) return [];
    return challenges
      .filter((c: FocusAreaChallenge) => c.tag_names?.some((t: string) => selectedTags.includes(t)))
      .map((c: FocusAreaChallenge) => c.id);
  }, [selectedTags, challenges]);

  // Derived pagination values
  const totalPages = computeTotalPages(totalFound, perPage);
  const pageNumbers = useMemo(
    () => computePageNumbers(totalPages, currentPage),
    [totalPages, currentPage],
  );

  /**
   * Debounced search effect
   */
  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set debounce timeout
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Convert selected challenge titles to IDs for the filter
        const challengeIdsToFilter = selectedChallenges
          .map((title) => challengeMap.get(title))
          .filter((id): id is string => !!id);

        // Combine challenge filters: from direct selection + from tag selection
        const allChallengeIds = [...new Set([...challengeIdsToFilter, ...challengeIdsFromTags])];

        // Compute type filter combining record type + resource type
        let effectiveTypes: string[] | undefined;

        if (selectedRecordTypes.length > 0 || selectedTypes.length > 0) {
          let recordTypeSet: string[] | null = null;

          if (selectedRecordTypes.length > 0 && selectedRecordTypes.length < 2) {
            if (selectedRecordTypes.includes('Knowledge Package')) {
              recordTypeSet = [KNOWLEDGE_PACKAGE];
            } else {
              recordTypeSet = initialTypeFacets
                .filter((f) => f.value !== KNOWLEDGE_PACKAGE)
                .map((f) => f.value);
            }
          }

          if (selectedTypes.length > 0 && recordTypeSet) {
            effectiveTypes = recordTypeSet.filter((t) => selectedTypes.includes(t));
          } else if (selectedTypes.length > 0) {
            effectiveTypes = selectedTypes;
          } else if (recordTypeSet) {
            effectiveTypes = recordTypeSet;
          }
        }

        const response = await searchResourcesAction(
          query || '*',
          {
            type: effectiveTypes && effectiveTypes.length > 0 ? effectiveTypes : undefined,
            challenges: allChallengeIds.length > 0 ? allChallengeIds : undefined,
            country: selectedCountries.length > 0 ? selectedCountries : undefined,
          },
          currentPage,
          perPage,
        );

        if (response.success && response.data) {
          setResources(response.data.hits);
          setTotalFound(response.data.found);
          // Update dynamic facets from search response
          if (response.data.facets) {
            setCurrentFacets(response.data.facets);
          }
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_DELAY);

    // Cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [
    query,
    selectedRecordTypes,
    selectedTypes,
    selectedChallenges,
    selectedTags,
    selectedCountries,
    currentPage,
    perPage,
    challengeMap,
    challengeIdsFromTags,
    initialTypeFacets,
  ]);

  const applyPerPage = (pp: PerPageOption) => {
    setPerPage(pp);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const clearAllFilters = () => {
    setQuery('');
    setSelectedRecordTypes([]);
    setSelectedTypes([]);
    setSelectedChallenges([]);
    setSelectedTags([]);
    setSelectedCountries([]);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    query.trim() !== '' ||
    selectedRecordTypes.length > 0 ||
    selectedTypes.length > 0 ||
    selectedChallenges.length > 0 ||
    selectedTags.length > 0 ||
    selectedCountries.length > 0;

  const activeFilterCount =
    selectedRecordTypes.length +
    selectedTypes.length +
    selectedChallenges.length +
    selectedTags.length +
    selectedCountries.length;

  // Keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Escape to clear search
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setQuery('');
        setCurrentPage(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-14 pb-10 md:pt-20 md:pb-14">
          {/* Headline */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Explore <span style={{ color: '#526479' }}>National</span> Knowledge
            </h1>
            <p className="mt-3 text-lg text-gray-500">
              Search across Earth Observation resources from National GEO hubs
            </p>
          </div>

          {/* Stats strip — static values */}
          <div className="mt-8 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {initialStaticTotal.toLocaleString()}
              </p>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                Resources indexed
              </p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{initialTypeCount}</p>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                Resource types
              </p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{initialCountryCount}</p>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + results */}
      <div className="mx-auto max-w-7xl px-6 py-8 pb-16">
        {/* Search bar — full-width, matching Resources page */}
        <div className="mb-6">
          <div className="relative flex items-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all focus-within:border-[#526479]/50 focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#526479]/10">
            <div className="pointer-events-none flex items-center pl-4">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search resources, datasets, tools…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 border-0 bg-transparent py-3.5 pr-4 pl-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
            />

            {/* Keyboard hint / clear */}
            {query ? (
              <button
                onClick={clearSearch}
                className="mr-3 flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <div className="mr-4 hidden items-center gap-1 sm:flex">
                <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-400">
                  ⌘K
                </kbd>
              </div>
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
                  backgroundColor: '#526479',
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
            <FacetGroup
              title="Record Type"
              items={recordTypeFacetItems}
              selected={selectedRecordTypes}
              onToggle={(val) => {
                setSelectedRecordTypes((prev) => toggleArrayItem(prev, val));
                setCurrentPage(1);
              }}
            />
            <FacetGroup
              title="Resource Type"
              items={typeFacetItems}
              selected={selectedTypes}
              onToggle={(val) => {
                setSelectedTypes((prev) => toggleArrayItem(prev, val));
                setCurrentPage(1);
              }}
            />
            <FacetGroup
              title="Country"
              items={countryFacetItems}
              selected={selectedCountries}
              onToggle={(val) => {
                setSelectedCountries((prev) => toggleArrayItem(prev, val));
                setCurrentPage(1);
              }}
            />
            <FacetGroup
              title="Challenges"
              items={challengeFacetItems}
              selected={selectedChallenges}
              onToggle={(val) => {
                setSelectedChallenges((prev) => toggleArrayItem(prev, val));
                setCurrentPage(1);
              }}
            />
            <FacetGroup
              title="Tags"
              items={tagFacetItems}
              selected={selectedTags}
              onToggle={(val) => {
                setSelectedTags((prev) => toggleArrayItem(prev, val));
                setCurrentPage(1);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-8">
              <FacetGroup
                title="Record Type"
                items={recordTypeFacetItems}
                selected={selectedRecordTypes}
                onToggle={(val) => {
                  setSelectedRecordTypes((prev) => toggleArrayItem(prev, val));
                  setCurrentPage(1);
                }}
              />

              <FacetGroup
                title="Resource Type"
                items={typeFacetItems}
                selected={selectedTypes}
                onToggle={(val) => {
                  setSelectedTypes((prev) => toggleArrayItem(prev, val));
                  setCurrentPage(1);
                }}
              />

              <FacetGroup
                title="Country"
                items={countryFacetItems}
                selected={selectedCountries}
                onToggle={(val) => {
                  setSelectedCountries((prev) => toggleArrayItem(prev, val));
                  setCurrentPage(1);
                }}
              />

              <FacetGroup
                title="Challenges"
                items={challengeFacetItems}
                selected={selectedChallenges}
                onToggle={(val) => {
                  setSelectedChallenges((prev) => toggleArrayItem(prev, val));
                  setCurrentPage(1);
                }}
              />

              <FacetGroup
                title="Tags"
                items={tagFacetItems}
                selected={selectedTags}
                onToggle={(val) => {
                  setSelectedTags((prev) => toggleArrayItem(prev, val));
                  setCurrentPage(1);
                }}
              />
            </div>
          </aside>

          {/* Results column */}
          <div>
            {/* Results bar */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-gray-500">
                {isSearching ? (
                  <span className="animate-pulse">Searching…</span>
                ) : (
                  <>
                    <span className="font-semibold text-gray-900">
                      {totalFound.toLocaleString()}
                    </span>{' '}
                    {totalFound === 1 ? 'result' : 'results'}
                    {hasActiveFilters && (
                      <>
                        {' '}
                        &mdash;{' '}
                        <button
                          onClick={clearAllFilters}
                          className="font-medium underline underline-offset-2 transition hover:text-gray-700"
                          style={{ color: '#526479' }}
                        >
                          clear filters
                        </button>
                      </>
                    )}
                  </>
                )}
              </p>

              <PerPageSelector value={perPage} onChange={applyPerPage} />
            </div>

            {/* Empty state */}
            {resources.length === 0 && !isSearching && (
              <EmptyState hasActiveFilters={hasActiveFilters} onClearFilters={clearAllFilters} />
            )}

            {/* Result cards */}
            {resources.length > 0 && (
              <div
                className={`flex flex-col gap-4 transition-opacity duration-200 ${isSearching ? 'opacity-40' : 'opacity-100'}`}
              >
                {resources.map((item) => {
                  // Define if whe must show the link
                  const isGKHSource = item.source === 'geo-knowledge-hub';
                  const showLink = (gkhOnline && isGKHSource) || !isGKHSource;

                  return (
                    <article
                      key={item.id}
                      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#526479]/20 hover:shadow-md"
                    >
                      {/* Left accent line on hover */}
                      <div
                        className="absolute inset-y-0 left-0 w-0.5 rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100"
                        style={{ backgroundColor: '#526479' }}
                      />

                      <div className="flex items-start gap-5">
                        {/* Icon column */}
                        <div className="hidden shrink-0 sm:block">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 transition group-hover:border-[#526479]/20 group-hover:bg-[#526479]/5">
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

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          {/* Badges row */}
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
                          <h3 className="mb-1.5 text-base leading-snug font-semibold text-gray-900 transition group-hover:text-[#526479]">
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
                              onOpenOverview={() => {
                                setResource(item);
                                setIsOpen(true);
                              }}
                              onOpenMetadata={() => setResourceForMetadata(item)}
                              linkClassName="text-sm font-medium text-[#526479] transition hover:text-[#3d4d5f] focus:outline-none"
                              buttonClassName="cursor-pointer text-sm font-medium text-[#526479] transition hover:text-[#3d4d5f] focus:outline-none"
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
              totalItems={totalFound}
            />
          </div>
        </div>
      </div>

      {resource !== null && (
        <ResourceOverviewDialog open={isOpen} onClose={() => setIsOpen(false)} data={resource} />
      )}

      {resourceForMetadata?.sync?.metadata && (
        <GkhMetadataDialog
          open={!!resourceForMetadata}
          onClose={() => setResourceForMetadata(null)}
          data={resourceForMetadata}
          syncMetadata={resourceForMetadata.sync.metadata}
        />
      )}
    </div>
  );
}
