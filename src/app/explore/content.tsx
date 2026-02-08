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

import { ResourceMetadataModal } from '@components/global';

import {
  searchResourcesAction,
  getSuggestionsAction,
  getTypoCorrectionAction,
} from '@lib/typesense/actions';

import logoExplorer from '@public/content/concepts/explorer/explore.svg';

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
   * State to manage the metadata modal.
   */
  const [isOpen, setIsOpen] = useState(false);
  const [resource, setResource] = useState<Resource | null>(null);

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

  // Suggestions state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedQuery, setSuggestedQuery] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<NodeJS.Timeout | null>(null);

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

  /**
   * Fetch suggestions as user types (autocomplete)
   */
  useEffect(() => {
    // Clear previous timeout
    if (suggestionsRef.current) {
      clearTimeout(suggestionsRef.current);
    }

    // Don't fetch suggestions if query is too short
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce suggestions fetch (shorter delay than search)
    suggestionsRef.current = setTimeout(async () => {
      try {
        const response = await getSuggestionsAction(query, 5);
        if (response.success && response.data) {
          setSuggestions(response.data);
          setShowSuggestions(response.data.length > 0);
        }
      } catch (error) {
        console.error('Suggestions error:', error);
      }
    }, 150);

    return () => {
      if (suggestionsRef.current) {
        clearTimeout(suggestionsRef.current);
      }
    };
  }, [query]);

  /**
   * Fetch typo correction when search returns no results
   */
  useEffect(() => {
    // Only check for typo correction when there are no results and we have a query
    if (totalFound === 0 && query.trim().length >= 2 && !isSearching) {
      const fetchTypoCorrection = async () => {
        try {
          const response = await getTypoCorrectionAction(query);
          if (response.success && response.data) {
            setSuggestedQuery(response.data);
          } else {
            setSuggestedQuery(null);
          }
        } catch (error) {
          console.error('Typo correction error:', error);
          setSuggestedQuery(null);
        }
      };
      fetchTypoCorrection();
    } else {
      setSuggestedQuery(null);
    }
  }, [totalFound, query, isSearching]);

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
    setSuggestions([]);
    setShowSuggestions(false);
    setSuggestedQuery(null);
  };

  const clearSearch = () => {
    setQuery('');
    setCurrentPage(1);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    setCurrentPage(1);
  };

  const applyTypoCorrection = () => {
    if (suggestedQuery) {
      setQuery(suggestedQuery);
      setSuggestedQuery(null);
      setCurrentPage(1);
    }
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
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-gray-50 lg:min-h-[60vh]">
        <div className="pointer-events-none fixed inset-0 h-full w-screen" style={{ zIndex: 0 }}>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
        </div>

        <div
          className="relative mx-auto max-w-7xl px-1 py-10 md:px-6 lg:py-20"
          style={{ zIndex: 1 }}
        >
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="relative z-10 space-y-6">
              <div className="space-y-4">
                <h1 className="font-bold tracking-tight">
                  <span
                    className="mt-2 block text-3xl md:text-4xl lg:text-5xl"
                    style={{ color: '#526479' }}
                  >
                    Content Explorer
                  </span>
                </h1>
                <p className="text-xl text-gray-600 md:text-2xl lg:max-w-2xl">
                  Discover and explore content from diverse countries
                </p>
              </div>
            </div>

            <div className="relative hidden items-center lg:flex lg:justify-end">
              <div className="relative">
                <div className="animate-pulse-glow absolute inset-0 rounded-2xl bg-blue-200/40"></div>
                <div className="relative rounded-2xl bg-white/90 p-8 shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-sm">
                  <Image src={logoExplorer} alt="Content Explorer logo" width={180} height={180} />
                </div>
              </div>
            </div>
          </div>

          {/* Search bar with suggestions */}
          <div className="relative z-20 mt-8 flex w-full flex-col items-center md:mt-16">
            <div className="relative w-full">
              <div className="relative rounded-2xl border border-gray-200/80 bg-white p-1.5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by title, description, or tags..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  onBlur={() => {
                    // Delay hiding to allow click on suggestion
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  className="text-md block w-full rounded-xl border-0 bg-transparent p-4 pr-14 pl-4 font-medium text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                />
                {query ? (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 flex items-center pr-6 text-gray-400 transition-colors hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                    <svg
                      className="h-6 w-6 text-gray-400"
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
                )}
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <svg
                        className="h-4 w-4 text-gray-400"
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
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="results-section mx-auto -mt-16 max-w-7xl px-1 pb-12 md:px-6">
        <div className="mt-8 grid gap-10 md:grid-cols-[230px_1fr]">
          {/* Mobile filter toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:border-gray-300"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-gray-500"
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
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1.5 text-xs font-medium text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <svg
                className={`h-5 w-5 text-gray-400 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Facets */}
          <aside
            className={`h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${showMobileFilters ? 'block' : 'hidden'} md:block`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 transition hover:text-[#526479]"
              >
                Clear
              </button>
            </div>

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
          </aside>

          {/* Results */}
          <section className="relative">
            {/* Loading overlay */}
            {isSearching && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center pt-8">
                <div className="rounded-full bg-white/90 px-4 py-2 text-sm text-gray-500 shadow-sm">
                  Searching...
                </div>
              </div>
            )}

            {resources.length === 0 && !isSearching && (
              <div className="mt-12 flex flex-col items-center justify-center py-16">
                {/* Did you mean suggestion */}
                {suggestedQuery && (
                  <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-6 py-4">
                    <p className="text-sm text-blue-800">
                      Did you mean:{' '}
                      <button
                        onClick={applyTypoCorrection}
                        className="font-semibold underline transition-colors hover:text-blue-600"
                      >
                        {suggestedQuery}
                      </button>
                      ?
                    </p>
                  </div>
                )}

                <div className="rounded-full bg-gray-100 p-6">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-900">No results found</p>
                <p className="mt-2 text-sm text-gray-600">
                  {hasActiveFilters ? (
                    <>
                      Try adjusting your search terms or{' '}
                      <button
                        onClick={clearAllFilters}
                        className="font-medium transition"
                        style={{ color: '#526479' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#3d4d5f';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#526479';
                        }}
                      >
                        clear all filters
                      </button>
                    </>
                  ) : (
                    'Start typing to search for content'
                  )}
                </p>
              </div>
            )}

            {resources.length > 0 && (
              <div
                className={`flex flex-col gap-6 transition-opacity duration-200 ${isSearching ? 'opacity-50' : 'opacity-100'}`}
              >
                {resources.map((item) => (
                  <div
                    key={item.id}
                    className="glass-card group flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="mb-2 flex items-center space-x-2 text-sm">
                        <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                          Open
                        </span>
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                          {item.uploaded}
                        </span>
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                          {item.type}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900">
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          {item.name}
                        </a>
                      </h3>
                      <p className="mt-1 line-clamp-3 text-sm text-gray-600">{item.description}</p>

                      <div className="mt-4 flex items-center gap-4">
                        {item.overview && (
                          <button
                            onClick={() => {
                              setResource(item);
                              setIsOpen(true);
                            }}
                            className="cursor-pointer text-sm font-medium text-gray-700 transition hover:text-gray-900 focus:outline-none"
                          >
                            Overview
                          </button>
                        )}

                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-gray-700 transition hover:text-gray-900 focus:outline-none"
                        >
                          Access →
                        </a>
                      </div>
                    </div>
                    <div className="hidden shrink-0 rounded-md bg-gray-100 p-5 transition group-hover:bg-gray-200/80 sm:block">
                      {item.icon && (
                        <Image
                          src={getAssetPath(item.icon)}
                          alt={`${item.type} icon`}
                          width={24}
                          height={24}
                          className="flex h-6 w-6 items-center justify-center rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1 sm:gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white sm:gap-2 sm:px-4"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and pages around current
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                      return (
                        <React.Fragment key={page}>
                          {showEllipsisBefore && (
                            <span className="px-1 text-gray-400 sm:px-2">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`h-8 w-8 rounded-lg text-sm font-medium transition-all sm:h-10 sm:w-10 ${
                              currentPage === page
                                ? 'text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
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
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white sm:gap-2 sm:px-4"
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {resource !== null && (
        <ResourceMetadataModal open={isOpen} onClose={() => setIsOpen(false)} data={resource} />
      )}
    </div>
  );
}
