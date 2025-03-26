/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useMemo } from 'react';

import Image, { StaticImageData } from 'next/image';

import _uniq from 'lodash/uniq';
import _some from 'lodash/some';
import _every from 'lodash/every';
import _map from 'lodash/map';
import _isNil from 'lodash/isNil';
import _compact from 'lodash/compact';

import MiniSearch from 'minisearch';

import { HeroTopic } from '@components/global';
import { initResourcesDatabase } from '@data/db';

import { FacetGroup } from './components';

import logoExplorer from '@public/content/concepts/explorer/explore.svg';

/**
 * Constants - Pagination - Number of results per page.
 */
const RESULTS_PER_PAGE = 6;

interface ChallengeTag {
  id: string;
  name: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  tags: ChallengeTag[];
}

interface ResourceItem {
  title: string;
  type: string;
  country: string;
  uploaded: string;
  description: string;
  link: string;
  challenges: Challenge[];
  icon: StaticImageData | string;
}

export default function ExplorePage() {
  const data = initResourcesDatabase();

  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const miniSearch = useMemo(() => {
    const ms = new MiniSearch({
      fields: [
        'title',
        'description',
        'type',
        'country',
        'challenges.title',
        'challenges.tags.name',
      ],
      storeFields: [
        'title',
        'description',
        'type',
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
      ? miniSearch
          .search(query, { prefix: true, fuzzy: 0.2 })
          .map((r) => r as unknown as ResourceItem)
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
    setSelectedTypes([]);
    setSelectedChallenges([]);
    setSelectedTags([]);
    setSelectedCountries([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="mx-auto max-w-7xl">
        <HeroTopic
          title={'Content explorer'}
          description={'Discover and explore content from diverse countries'}
          imageSrc={logoExplorer}
          imageAlt={'Explorer logo'}
          imageClass="h-50 w-full object-fit"
          enableBackButton={false}
        />

        {/* Search Bar */}
        <div className="relative mb-10 w-full">
          <input
            type="text"
            placeholder="Search by title, description, or tags..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pr-4 pl-12 text-base outline-none focus:border-gray-400 focus:shadow-sm"
          />
          <svg
            className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
            />
          </svg>
        </div>

        <div className="grid gap-10 md:grid-cols-[230px_1fr]">
          {/* Facets */}
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
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
              <p className="mt-8 text-center text-gray-500">No results found.</p>
            )}

            <div className="flex flex-col gap-6">
              {paginatedResults.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex-1 space-y-3">
                    <div className="mb-2 flex items-center space-x-2 text-sm">
                      <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                        Open
                      </span>
                      <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                        {item.uploaded}
                      </span>
                      <span className="rounded-full bg-gray-300 px-3 py-1 text-xs font-medium text-gray-800">
                        {item.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 transition hover:text-gray-700">
                      <a href={item.link} target="_blank">
                        {item.title}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>

                    <a
                      href={item.link}
                      target="_blank"
                      className="mt-2 inline-block font-medium text-gray-800 transition hover:text-gray-900"
                    >
                      Access →
                    </a>
                  </div>
                  <div className={'rounded-md bg-gray-100 p-5'}>
                    <Image
                      src={item.icon}
                      alt={`${item.type} icon`}
                      className="flex h-6 w-6 items-center justify-center rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
