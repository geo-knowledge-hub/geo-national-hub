/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect, JSX } from 'react';

import Image from 'next/image';

import { SlidersHorizontal } from 'lucide-react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';

import { InstantSearch, Configure } from 'react-instantsearch';
import { useClearRefinements, useSearchBox } from 'react-instantsearch';
import type { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';

import {
  BackButton,
  ResourceOverviewDialog,
  GkhMetadataDialog,
  ResourceActions,
  PerPageSelector,
  ResourceIcon,
} from '@components/global';

import {
  SearchInput,
  ResultsStats,
  SearchPagination,
  HitsList,
  FacetPanel,
  InitialQuerySync,
  InitialRefinementSync,
  RecordTypeFacet,
  recordTypeFilterStr,
} from '../../../../components/search/instantsearch';
import type { FacetConfig, RecordTypeFilter } from '../../../../components/search/instantsearch';

import { Button } from '@ui/button';
import { Badge } from '@ui/badge';

import type { PerPageOption } from '@lib/search/utils';

import { useGkhHealth } from '@lib/hooks/use-gkh-health';

import type { Country, FocusArea, FocusAreaChallenge, Resource } from '@content-types/content';
import { getAssetPath } from '@lib/utils';
import { stripHtml } from '@lib/sanitize';

import { searchClient, INSTANT_SEARCH_INDEX } from '@lib/typesense/instantsearch';

/**
 * All resources facets
 */
const ALL_RESOURCES_FACETS: FacetConfig[] = [
  { attribute: 'resource_type.id', title: 'Resource Type' },
  { attribute: 'geo_work_programme_activity.name', title: 'GEO Work Programme Activity' },
  { attribute: 'engagement_priorities.name', title: 'Engagement Priorities' },
  { attribute: 'target_audiences.name', title: 'Target Audiences' },
];

/**
 * Resource hit card props
 */
interface ResourceHitCardProps {
  item: Resource;
  gkhOnline: boolean;
  onOpenOverview: (resource: Resource) => void;
  onOpenMetadata: (resource: Resource) => void;
}

/**
 * Resources page content props
 */
interface ResourcesPageContentProps {
  countryId: string;
  countryData: Country;
  challenges: FocusAreaChallenge[];
  focusAreas: FocusArea[];
  initialFocus?: string;
  initialType?: string;
}

/**
 * Resource hit card component
 */
function ResourceHitCard({
  item,
  gkhOnline,
  onOpenOverview,
  onOpenMetadata,
}: ResourceHitCardProps): JSX.Element {
  // Check if the resource is from the GEO Knowledge Hub
  const isGKHSource = item.source === 'geo-knowledge-hub';

  // Show link if the resource is from the GEO Knowledge Hub and it is online, or if it is not from the GEO Knowledge Hub
  const showLink = (gkhOnline && isGKHSource) || !isGKHSource;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#526479]/20 hover:shadow-md">
      <div
        className="absolute inset-y-0 left-0 w-0.5 rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100"
        style={{ backgroundColor: 'var(--theme-primary, #526479)' }}
      />

      <div className="flex items-start gap-5">
        <div className="hidden shrink-0 sm:block">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-400 transition group-hover:border-[color:var(--theme-primary,#526479)]/20 group-hover:bg-[color:var(--theme-primary,#526479)]/5 group-hover:text-[color:var(--theme-primary,#526479)]">
            <ResourceIcon resourceTypeId={item.resource_type?.id ?? ''} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-700 uppercase">
              Open
            </span>
            {item.resource_type?.name && (
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                {item.resource_type.name}
              </span>
            )}
            {item.uploaded && <span className="text-[11px] text-gray-400">{item.uploaded}</span>}
          </div>

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

          <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
            {stripHtml(item.description)}
          </p>

          <div className="relative z-10 mt-4">
            <ResourceActions
              resource={item}
              gkhOnline={gkhOnline}
              onOpenOverview={() => onOpenOverview(item)}
              onOpenMetadata={() => onOpenMetadata(item)}
              linkClassName="text-sm font-medium transition focus:outline-none"
              buttonClassName="cursor-pointer text-sm font-medium transition focus:outline-none"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Active filter badge component
 */
function ActiveFilterBadge(): JSX.Element | null {
  const { canRefine } = useClearRefinements();
  const { query } = useSearchBox();

  const hasAny = canRefine || query.trim() !== '';

  if (!hasAny) {
    return null;
  }

  return (
    <Badge
      className="flex h-4 w-4 items-center justify-center p-0 text-[10px]"
      style={{ backgroundColor: 'var(--theme-primary, #526479)', borderColor: 'transparent' }}
    >
      !
    </Badge>
  );
}

/**
 * Resources page content component
 */
export function ResourcesPageContent({
  countryId,
  countryData,
  challenges,
  focusAreas,
  initialFocus,
  initialType,
}: ResourcesPageContentProps): JSX.Element {
  // State - define component states
  const [overviewResource, setOverviewResource] = useState<Resource | null>(null);
  const [metadataResource, setMetadataResource] = useState<Resource | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [recordType, setRecordType] = useState<RecordTypeFilter>('all');

  // GKH health
  const { online: gkhOnline } = useGkhHealth();

  // Hide Resource Type facet when KP is selected
  const resourcesFacets = useMemo(
    () =>
      recordType === 'kp'
        ? ALL_RESOURCES_FACETS.filter((f) => f.attribute !== 'resource_type.id')
        : ALL_RESOURCES_FACETS,
    [recordType],
  );

  // URL-synced state via nuqs
  const [urlQuery, setUrlQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [perPage, setPerPage] = useQueryState('size', parseAsInteger.withDefault(10));

  const clearUrlQuery = useCallback(() => setUrlQuery(null), [setUrlQuery]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Resolve focus area name from id
  const lockedFocusArea = useMemo(
    () => (initialFocus ? (focusAreas.find((fa) => fa.id === initialFocus) ?? null) : null),
    [initialFocus, focusAreas],
  );

  // Compute challenge IDs belonging to the locked focus area
  const focusChallengeIds = useMemo(() => {
    // If no initial focus, return empty array
    if (!initialFocus) {
      return [];
    }

    // Filter challenges by tags and return IDs
    return challenges.filter((ch) => (ch.tags ?? []).includes(initialFocus)).map((ch) => ch.id);
  }, [initialFocus, challenges]);

  // Resource type transform - exclude "knowledge" (shown in Record Type facet) and title-case IDs
  const resourceTypeTransform = useMemo(
    () =>
      (items: RefinementListItem[]): RefinementListItem[] =>
        items
          .filter((item) => item.value !== 'knowledge')
          .map((item) => ({
            ...item,
            label: item.label
              .split('-')
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' '),
          })),
    [],
  );

  // Facet transforms lookup keyed by Typesense attribute name
  const facetTransforms = useMemo(
    () => ({
      'resource_type.id': resourceTypeTransform,
    }),
    [resourceTypeTransform],
  );

  // Keyboard shortcut - Cmd/Ctrl+K to focus search, Escape to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }

    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle - per page change
  const handlePerPageChange = (pp: PerPageOption) => {
    setPerPage(pp === 10 ? null : pp);
  };

  // Handle - query change
  const handleQueryChange = useCallback((q: string) => {
    setUrlQuery(q || null);
  }, [setUrlQuery]);

  // Render hit card
  const renderHit = useCallback(
    (item: Resource) => (
      <ResourceHitCard
        item={item}
        gkhOnline={gkhOnline}
        onOpenOverview={setOverviewResource}
        onOpenMetadata={setMetadataResource}
      />
    ),
    [gkhOnline],
  );

  return (
    <InstantSearch searchClient={searchClient} indexName={INSTANT_SEARCH_INDEX}>
      {/* Scope results to this country */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Configure
        {...({
          filters: [`country_id:=${countryId}`, recordTypeFilterStr(recordType)]
            .filter(Boolean)
            .join(' && '),
          hitsPerPage: perPage,
        } as any)}
      />

      {/* Sync initial URL query */}
      <InitialQuerySync initialQuery={urlQuery} />

      {/* Pre-select challenge facets for locked focus area */}
      {focusChallengeIds.length > 0 && (
        <InitialRefinementSync attribute="challenges" values={focusChallengeIds} />
      )}

      {/* Pre-select resource type from URL param */}
      {initialType && <InitialRefinementSync attribute="resource_type.id" values={[initialType]} />}

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

                <p className="text-sm text-gray-400">{countryData.title}</p>
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
            <SearchInput
              inputRef={searchInputRef}
              onQueryChange={handleQueryChange}
              placeholder="Search resources, datasets, tools…"
            />
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
              <ActiveFilterBadge />
            </Button>
          </div>

          {/* Mobile filters panel */}
          {showMobileFilters && (
            <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50/50 p-4 md:hidden">
              <RecordTypeFacet value={recordType} onChange={setRecordType} />
              <FacetPanel facets={resourcesFacets} transforms={facetTransforms} />
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
            <aside className="hidden md:block">
              <div className="sticky top-8">
                <RecordTypeFacet value={recordType} onChange={setRecordType} />
                <FacetPanel facets={resourcesFacets} transforms={facetTransforms} />
              </div>
            </aside>

            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <ResultsStats onClearQuery={clearUrlQuery} />
                <PerPageSelector value={perPage as PerPageOption} onChange={handlePerPageChange} />
              </div>

              <HitsList renderHit={renderHit} onClearQuery={clearUrlQuery} />

              <SearchPagination
                perPage={perPage as PerPageOption}
                onPerPageChange={handlePerPageChange}
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
            gkhOnline={gkhOnline}
          />
        )}
        {metadataResource && (
          <GkhMetadataDialog
            open={!!metadataResource}
            onClose={() => setMetadataResource(null)}
            data={metadataResource}
          />
        )}
      </div>
    </InstantSearch>
  );
}
