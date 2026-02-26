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

import { ResourceOverviewDialog, GkhMetadataDialog, ResourceActions } from '@components/global';

import { useGkhHealth } from '@lib/hooks/use-gkh-health';
import { searchResourcesAction } from '@lib/typesense/actions';

import { FacetGroup } from './components';
import type { FacetItem } from './components';
import type { Resource, FocusAreaChallenge } from '@content-types/content';
import type { FacetsResult } from '@lib/typesense/queries';
import { getAssetPath } from '@lib/utils';

/**
 * Constants - Pagination - Number of results per page.
 */
const RESULTS_PER_PAGE = 6;

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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [totalFound, setTotalFound] = useState(initialTotal);
  const [isSearching, setIsSearching] = useState(false);
  const [currentFacets, setCurrentFacets] = useState<FacetsResult>(facets);

  // Preserve initial country facets so they never disappear when filtering
  const [initialCountryFacets] = useState<FacetItem[]>(facets.country || []);

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

  // Dynamic facet items with counts - updated with each search
  const typeFacetItems: FacetItem[] = useMemo(() => {
    return currentFacets.type || [];
  }, [currentFacets]);

  const countryFacetItems: FacetItem[] = useMemo(() => {
    const dynamicMap = new Map((currentFacets.country || []).map((f) => [f.value, f.count]));
    return initialCountryFacets.map((f) => ({
      value: f.value,
      count: dynamicMap.get(f.value) ?? 0,
    }));
  }, [currentFacets, initialCountryFacets]);

  // Map challenge ID facets to titles for display
  const challengeFacetItems: FacetItem[] = useMemo(() => {
    return (currentFacets.challenges || [])
      .map((f) => ({
        value: challengeIdToTitle.get(f.value) || f.value,
        count: f.count,
      }))
      .filter((f) => f.value !== f.value.toLowerCase()); // Filter out unmapped IDs
  }, [currentFacets, challengeIdToTitle]);

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

  /**
   * Debounced search effect - all filtering now happens server-side via Typesense
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

        const response = await searchResourcesAction(
          query || '*',
          {
            // Pass arrays directly - Typesense handles multi-select filtering
            type: selectedTypes.length > 0 ? selectedTypes : undefined,
            challenges: allChallengeIds.length > 0 ? allChallengeIds : undefined,
            country: selectedCountries.length > 0 ? selectedCountries : undefined,
          },
          currentPage,
          RESULTS_PER_PAGE,
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
    selectedTypes,
    selectedChallenges,
    selectedTags,
    selectedCountries,
    currentPage,
    challengeMap,
    challengeIdsFromTags,
  ]);

  const toggleSelection = (
    value: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setState(state.includes(value) ? state.filter((v) => v !== value) : [...state, value]);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalFound / RESULTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const clearAllFilters = () => {
    setQuery('');
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
    selectedTypes.length > 0 ||
    selectedChallenges.length > 0 ||
    selectedTags.length > 0 ||
    selectedCountries.length > 0;

  const activeFilterCount =
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
      {/* Hero / Search header */}
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

          {/* Prominent search bar */}
          <div className="relative mx-auto max-w-2xl">
            <div className="relative flex items-center rounded-2xl border border-gray-200 bg-white shadow-lg ring-1 ring-gray-100 transition-all focus-within:border-[#526479]/40 focus-within:ring-2 focus-within:ring-[#526479]/15 hover:shadow-xl">
              <div className="pointer-events-none flex items-center pl-5">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
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
                className="flex-1 border-0 bg-transparent py-4 pr-4 pl-4 text-base text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
              />

              {/* Keyboard hint / clear */}
              {query ? (
                <button
                  onClick={clearSearch}
                  className="mr-3 flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                  aria-label="Clear search"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
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

          {/* Stats strip */}
          <div className="mt-8 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{totalFound.toLocaleString()}</p>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                {query || hasActiveFilters ? 'Results found' : 'Resources indexed'}
              </p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{typeFacetItems.length}</p>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                Resource types
              </p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{countryFacetItems.length}</p>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + results */}
      <div className="mx-auto max-w-7xl px-6 py-10 pb-16">
        {/* Active filters */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Active filters:</span>
            {query && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#526479]/20 bg-[#526479]/5 px-3 py-1 text-sm font-medium text-[#526479]">
                &ldquo;{query}&rdquo;
                <button onClick={clearSearch} className="ml-0.5 hover:opacity-70">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}

            {[...selectedTypes, ...selectedCountries, ...selectedChallenges, ...selectedTags].map(
              (filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                >
                  {filter}
                  <button
                    onClick={() => {
                      if (selectedTypes.includes(filter))
                        toggleSelection(filter, selectedTypes, setSelectedTypes);
                      else if (selectedCountries.includes(filter))
                        toggleSelection(filter, selectedCountries, setSelectedCountries);
                      else if (selectedChallenges.includes(filter))
                        toggleSelection(filter, selectedChallenges, setSelectedChallenges);
                      else if (selectedTags.includes(filter))
                        toggleSelection(filter, selectedTags, setSelectedTags);
                    }}
                    className="ml-0.5 hover:opacity-70"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ),
            )}
            <button
              onClick={clearAllFilters}
              className="text-sm font-medium text-gray-400 transition hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          {/* Mobile filter toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:border-gray-300"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-sm font-semibold text-gray-900">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#526479] px-1.5 text-xs font-medium text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <svg
                className={`h-4 w-4 text-gray-400 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Facets sidebar */}
          <aside
            className={`h-fit rounded-2xl border border-gray-100 bg-gray-50/70 p-5 ${showMobileFilters ? 'block' : 'hidden'} md:block`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
                Filters
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="rounded-md px-2 py-0.5 text-xs font-medium text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-1">
              <FacetGroup
                title="Type"
                items={typeFacetItems}
                selected={selectedTypes}
                onToggle={(val) => toggleSelection(val, selectedTypes, setSelectedTypes)}
              />

              <FacetGroup
                title="Country"
                items={countryFacetItems}
                selected={selectedCountries}
                onToggle={(val) => toggleSelection(val, selectedCountries, setSelectedCountries)}
              />

              <FacetGroup
                title="Challenges"
                items={challengeFacetItems}
                selected={selectedChallenges}
                onToggle={(val) => toggleSelection(val, selectedChallenges, setSelectedChallenges)}
              />

              <FacetGroup
                title="Tags"
                items={tagFacetItems}
                selected={selectedTags}
                onToggle={(val) => toggleSelection(val, selectedTags, setSelectedTags)}
              />
            </div>
          </aside>

          {/* Results column */}
          <section className="relative min-w-0">
            {/* Results header */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                {isSearching ? (
                  <span className="animate-pulse">Searching…</span>
                ) : (
                  <>
                    <span className="font-semibold text-gray-900">
                      {totalFound.toLocaleString()}
                    </span>{' '}
                    {totalFound === 1 ? 'result' : 'results'}
                    {hasActiveFilters && ' for current filters'}
                  </>
                )}
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            {/* Empty state */}
            {resources.length === 0 && !isSearching && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/60 py-20">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                  <svg
                    className="h-8 w-8 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-700">No results found</p>
                <p className="mt-1.5 text-sm text-gray-400">
                  {hasActiveFilters ? (
                    <>
                      Try adjusting filters or{' '}
                      <button
                        onClick={clearAllFilters}
                        className="font-medium underline underline-offset-2 transition hover:text-gray-700"
                        style={{ color: '#526479' }}
                      >
                        clear all
                      </button>
                    </>
                  ) : (
                    'Start typing to find resources'
                  )}
                </p>
              </div>
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
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1),
                    )
                    .map((page, index, array) => {
                      const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                      return (
                        <React.Fragment key={page}>
                          {showEllipsisBefore && (
                            <span className="px-2 text-sm text-gray-400">…</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`h-9 w-9 rounded-xl text-sm font-medium transition-all ${
                              currentPage === page
                                ? 'text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            style={
                              currentPage === page ? { backgroundColor: '#526479' } : undefined
                            }
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </section>
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
