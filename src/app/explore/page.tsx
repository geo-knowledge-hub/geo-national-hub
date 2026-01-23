/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';

import Image from 'next/image';

import _uniq from 'lodash/uniq';
import _some from 'lodash/some';
import _every from 'lodash/every';
import _map from 'lodash/map';
import _isNil from 'lodash/isNil';
import _compact from 'lodash/compact';

import MiniSearch from 'minisearch';

import { ResourceMetadataModal } from '@components/global';

import { initResourcesDatabase } from '@data/db';

import logoExplorer from '@public/content/concepts/explorer/explore.svg';

import { FacetGroup } from './components';
import { Resource } from '@data/content/resources';

/**
 * Constants - Pagination - Number of results per page.
 */
const RESULTS_PER_PAGE = 6;

export default function ExplorePage() {
  const data = initResourcesDatabase();

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

  const miniSearch = useMemo(() => {
    const ms = new MiniSearch({
      fields: [
        'name',
        'description',
        'overview',
        'license',
        'contributors',
        'subjects',
        'type',
        'targetAudiences',
        'geoThemes',
        'organization',
        'country',
        'extras',
        'challenges.title',
        'challenges.tags.name',
      ],
      storeFields: [
        'name',
        'description',
        'overview',
        'license',
        'contributors',
        'subjects',
        'type',
        'targetAudiences',
        'geoThemes',
        'organization',
        'country',
        'extras',
        'country',
        'uploaded',
        'link',
        'challenges',
        'icon',
      ],
    });
    ms.addAll(data);
    return ms;
  }, [data]);

  const toggleSelection = (
    value: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setState(state.includes(value) ? state.filter((v) => v !== value) : [...state, value]);
  };

  const matchesAll = (values: string[], selected: string[]) => {
    return selected.every((val) => values.includes(val));
  };

  const filteredResults = useMemo(() => {
    const results = query.trim()
      ? miniSearch.search(query, { prefix: true, fuzzy: 0.2 }).map((r) => r as unknown as Resource)
      : data;

    return results.filter((r) => {
      const filters = [
        () => {
          if (selectedTypes.length === 0) {
            return null;
          }

          return matchesAll([r.type], selectedTypes);
        },
        () => {
          if (selectedChallenges.length === 0) {
            return null;
          }

          const challengeTitlesInItem = r.challenges.map((c) => c.title);

          return matchesAll(challengeTitlesInItem, selectedChallenges);
        },
        () => {
          if (selectedTags.length === 0) {
            return null;
          }

          const tagsInItem = r.challenges.flatMap((c) => c.tags.map((t) => t.name));
          return matchesAll(tagsInItem, selectedTags);
        },
        () => {
          if (selectedCountries.length === 0) {
            return null;
          }

          // @ts-expect-error temporary
          return matchesAll([r.country], selectedCountries);
        },
      ];

      const filterResults = _map(filters, (f) => f());
      const isAllNull = _every(_map(filterResults, _isNil));

      if (isAllNull) {
        return true;
      }

      return _some(_compact(filterResults));
    });
  }, [query, selectedTypes, selectedChallenges, selectedTags, selectedCountries, data, miniSearch]);

  const totalPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE,
  );

  const types = _uniq(data.map((d) => d.type));
  const challengeTitles = _uniq(data.flatMap((d) => d.challenges.map((c) => c.title)));
  const tags = _uniq(data.flatMap((d) => d.challenges.flatMap((c) => c.tags.map((t) => t.name))));
  const countries = _uniq(data.map((d) => d.country));

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

  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const removeFilter = (category: 'type' | 'challenge' | 'tag' | 'country', value: string) => {
    switch (category) {
      case 'type':
        setSelectedTypes(selectedTypes.filter((v) => v !== value));
        break;
      case 'challenge':
        setSelectedChallenges(selectedChallenges.filter((v) => v !== value));
        break;
      case 'tag':
        setSelectedTags(selectedTags.filter((v) => v !== value));
        break;
      case 'country':
        setSelectedCountries(selectedCountries.filter((v) => v !== value));
        break;
    }
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative min-h-[60vh] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <div className="pointer-events-none fixed inset-0 h-full w-screen" style={{ zIndex: 0 }}>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:py-20" style={{ zIndex: 1 }}>
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="relative z-10 space-y-6">
              <div className="space-y-4">
                <h1 className="font-bold tracking-tight">
                  <span
                    className="mt-2 block text-5xl md:text-3xl lg:text-4xl"
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

          {/* Search bar */}
          <div className="relative z-10 mt-16 flex w-full flex-col items-center">
            <div className="w-full">
              <div className="relative rounded-2xl bg-white/95 p-1.5 shadow-xl ring-2 ring-gray-200/60 backdrop-blur-md transition-all hover:shadow-2xl hover:ring-[#526479]/40">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by title, description, or tags..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-md block w-full rounded-xl border-0 bg-transparent p-4 pr-14 pl-4 font-medium text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                />
                {query ? (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 flex items-center pr-6 text-gray-400 transition-colors hover:text-[#526479]"
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
            </div>
          </div>
        </div>
      </section>

      <div className="results-section mx-auto -mt-16 max-w-7xl px-6 pb-12">
        <div className="mt-8 grid gap-10 md:grid-cols-[230px_1fr]">
          {/* Facets */}
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
              items={types}
              selected={selectedTypes}
              onToggle={(val) => toggleSelection(val, selectedTypes, setSelectedTypes)}
            />

            <FacetGroup
              title="Country"
              // @ts-expect-error temporary
              items={countries}
              selected={selectedCountries}
              onToggle={(val) => toggleSelection(val, selectedCountries, setSelectedCountries)}
            />

            <FacetGroup
              title="Challenges"
              items={challengeTitles}
              selected={selectedChallenges}
              onToggle={(val) => toggleSelection(val, selectedChallenges, setSelectedChallenges)}
            />

            <FacetGroup
              title="Tags"
              items={tags}
              selected={selectedTags}
              onToggle={(val) => toggleSelection(val, selectedTags, setSelectedTags)}
            />
          </aside>

          {/* Results */}
          <section>
            {paginatedResults.length === 0 && (
              <div className="mt-12 flex flex-col items-center justify-center py-16">
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

            {paginatedResults.length > 0 && (
              <div className="flex flex-col gap-6">
                {paginatedResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#526479] hover:shadow-lg"
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

                      <h3 className="text-lg font-semibold text-gray-900 transition hover:text-[#526479]">
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          {item.name}
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">{item.description}</p>

                      <div className="mt-4 flex items-center gap-4">
                        {item.overview && (
                          <button
                            onClick={() => {
                              setResource(item);
                              setIsOpen(true);
                            }}
                            className="cursor-pointer text-sm font-medium text-gray-700 transition hover:text-[#526479] focus:outline-none"
                          >
                            Overview
                          </button>
                        )}

                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-gray-700 transition hover:text-[#526479] focus:outline-none"
                        >
                          Access →
                        </a>
                      </div>
                    </div>
                    <div className="rounded-md bg-gray-100 p-5 transition group-hover:bg-[#526479]/10">
                      <Image
                        src={item.icon}
                        alt={`${item.type} icon`}
                        className="flex h-6 w-6 items-center justify-center rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
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
                          {showEllipsisBefore && <span className="px-2 text-gray-400">...</span>}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
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
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                >
                  Next
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
