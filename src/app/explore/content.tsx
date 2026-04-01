/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, JSX } from 'react';

import dynamic from 'next/dynamic';

import { SlidersHorizontal, List, MapPin } from 'lucide-react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';

import { InstantSearch, Configure } from 'react-instantsearch';
import { useHits, useClearRefinements, useSearchBox } from 'react-instantsearch';
import type { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';

import {
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
  RecordTypeFacet,
  recordTypeFilterStr,
} from '../../components/search/instantsearch';
import type { FacetConfig, RecordTypeFilter } from '../../components/search/instantsearch';

import { Button } from '@ui/button';
import { Badge } from '@ui/badge';

import type { PerPageOption } from '@lib/search/utils';

import { useGkhHealth } from '@lib/hooks/use-gkh-health';

import type { Resource, FocusAreaChallenge } from '@content-types/content';
import { stripHtml } from '@lib/sanitize';

import { searchClient, INSTANT_SEARCH_INDEX } from '@lib/typesense/instantsearch';

/**
 * All facets
 */
const ALL_FACETS: FacetConfig[] = [
  { attribute: 'resource_type.id', title: 'Resource Type' },
  { attribute: 'country', title: 'Country' },
  { attribute: 'challenges', title: 'Challenges' },
  { attribute: 'geo_work_programme_activity.name', title: 'GEO Work Programme Activity' },
  { attribute: 'engagement_priorities.name', title: 'Engagement Priorities' },
  { attribute: 'target_audiences.name', title: 'Target Audiences' },
];

/**
 * Hero stats props
 */
interface HeroStatsProps {
  totalResources: number;
  totalResourceTypes: number;
  totalCountries: number;
}

/**
 * Hit card props
 */
interface HitCardProps {
  item: Resource;
  gkhOnline: boolean;
  onOpenOverview: (resource: Resource) => void;
  onOpenMetadata: (resource: Resource) => void;
  onSeeOnMap?: (resourceId: string) => void;
}

/**
 * View toggle props
 */
interface ViewToggleProps {
  viewMode: 'list' | 'map';
  onToggle: (mode: 'list' | 'map') => void;
}

/**
 * Explore page content props
 */
interface ExplorePageContentProps {
  challenges: FocusAreaChallenge[];
  heroStats: HeroStatsProps;
}

/**
 * Returns true if a resource has renderable spatial data.
 * Note: We are duplicating this function from map-view.tsx to avoid importing leaflet during SSR.
 */
function hasSpatialData(resource: Resource): boolean {
  return (
    (Array.isArray(resource.locations?.bbox) && resource.locations!.bbox!.length >= 3) ||
    (Array.isArray(resource.locations?.centroid) && resource.locations!.centroid!.length === 2)
  );
}

// Dynamic import - Leaflet needs window, so SSR must be disabled
const MapModeLayout = dynamic(() => import('./map-mode').then((mod) => mod.MapModeLayout), {
  ssr: false,
});


/**
 * Hero stats component
 */
function HeroStats({
  totalResources,
  totalResourceTypes,
  totalCountries,
}: HeroStatsProps): JSX.Element {
  const stats = [
    { value: totalResources, label: 'Resources indexed' },
    { value: totalResourceTypes, label: 'Resource types' },
    { value: totalCountries, label: 'Countries' },
  ];

  return (
    <div className="mt-8 flex items-center justify-center divide-x divide-gray-200">
      {stats.map((stat) => (
        <div key={stat.label} className="px-8 text-center">
          <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
          <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Hit card component
 */
function HitCard({
  item,
  gkhOnline,
  onOpenOverview,
  onOpenMetadata,
  onSeeOnMap,
}: HitCardProps): JSX.Element {
  const isGKHSource = item.source === 'geo-knowledge-hub';
  const showLink = (gkhOnline && isGKHSource) || !isGKHSource;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#526479]/20 hover:shadow-md">
      {/* Left accent line on hover */}
      <div
        className="absolute inset-y-0 left-0 w-0.5 rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100"
        style={{ backgroundColor: '#526479' }}
      />

      <div className="flex items-start gap-5">
        {/* Icon column */}
        <div className="hidden shrink-0 sm:block">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-400 transition group-hover:border-[#526479]/20 group-hover:bg-[#526479]/5 group-hover:text-[#526479]">
            <ResourceIcon resourceTypeId={item.resource_type?.id ?? ''} />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Badges row */}
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
            {stripHtml(item.description)}
          </p>

          {/* Actions */}
          <div className="relative z-10">
            <ResourceActions
              resource={item}
              gkhOnline={gkhOnline}
              onOpenOverview={() => onOpenOverview(item)}
              onOpenMetadata={() => onOpenMetadata(item)}
              linkClassName="text-sm font-medium text-[#526479] transition hover:text-[#3d4d5f] focus:outline-none"
              buttonClassName="cursor-pointer text-sm font-medium text-[#526479] transition hover:text-[#3d4d5f] focus:outline-none"
              extraActions={
                onSeeOnMap && hasSpatialData(item) ? (
                  <button
                    onClick={() => onSeeOnMap(item.id)}
                    className="cursor-pointer text-sm font-medium text-[#526479] transition hover:text-[#3d4d5f] focus:outline-none"
                    aria-label="See on map"
                  >
                    See on the map
                  </button>
                ) : undefined
              }
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * View toggle component
 */
function ViewToggle({ viewMode, onToggle }: ViewToggleProps): JSX.Element {
  const tabs: { mode: 'list' | 'map'; label: string; icon: JSX.Element }[] = [
    {
      mode: 'list',
      label: 'List view',
      icon: <List className="h-4 w-4" />,
    },
    {
      mode: 'map',
      label: 'Map view',
      icon: <MapPin className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(({ mode, label, icon }) => {
        const isActive = viewMode === mode;
        return (
          <button
            key={mode}
            onClick={() => onToggle(mode)}
            aria-pressed={isActive}
            className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#526479]/40 ${
              isActive ? 'border-b-2 text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
            style={isActive ? { borderBottomColor: '#526479' } : undefined}
          >
            {icon}
            {label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Spatial hits gate component
 */
function SpatialHitsGate({ viewMode, onToggle }: ViewToggleProps): JSX.Element | null {
  const { hits } = useHits<Resource>();
  const hasSpatial = hits.some(hasSpatialData);

  if (!hasSpatial) {
    return null;
  }

  return <ViewToggle viewMode={viewMode} onToggle={onToggle} />;
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
      style={{ backgroundColor: '#526479', borderColor: 'transparent' }}
    >
      !
    </Badge>
  );
}

/**
 * Explore page content component
 */
export function ExplorePageContent({
  challenges,
  heroStats,
}: ExplorePageContentProps): JSX.Element {
  // State - define component states
  const [isOpen, setIsOpen] = useState(false);
  const [resource, setResource] = useState<Resource | null>(null);
  const [resourceForMetadata, setResourceForMetadata] = useState<Resource | null>(null);

  // GKH health - check if the GEO Knowledge Hub is online
  const { online: gkhOnline } = useGkhHealth();

  // Mobile filters toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // View mode: list or map
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Lock body scroll in map mode so footer is not reachable
  useEffect(() => {
    if (viewMode === 'map') {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [viewMode]);

  // Resource to focus on when entering map mode via "See on map"
  const [focusResourceId, setFocusResourceId] = useState<string | null>(null);

  // Record type filter (KP / KR / all)
  const [recordType, setRecordType] = useState<RecordTypeFilter>('all');

  // URL-synced state via nuqs
  const [urlQuery, setUrlQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [perPage, setPerPage] = useQueryState('size', parseAsInteger.withDefault(10));

  // Clear the URL query param (used by clear filters handlers)
  const clearUrlQuery = useCallback(() => setUrlQuery(null), [setUrlQuery]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hide Resource Type facet when KP is selected
  const facetConfig = useMemo(
    () =>
      recordType === 'kp'
        ? ALL_FACETS.filter((f) => f.attribute !== 'resource_type.id')
        : ALL_FACETS,
    [recordType],
  );

  // Challenge ID-to-title mapping
  const challengeIdToTitle = useMemo(() => {
    const map = new Map<string, string>();
    challenges.forEach((c) => map.set(c.id, c.title));
    return map;
  }, [challenges]);

  const challengeTransform = useMemo(
    () =>
      (items: RefinementListItem[]): RefinementListItem[] =>
        items.map((item) => ({
          ...item,
          label: challengeIdToTitle.get(item.label) || item.label,
        })),
    [challengeIdToTitle],
  );

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

  // Transforms lookup keyed by Typesense attribute name
  const facetTransforms = useMemo(
    () => ({
      'resource_type.id': resourceTypeTransform,
      challenges: challengeTransform,
    }),
    [resourceTypeTransform, challengeTransform],
  );

  // Keyboard shortcut: Cmd/Ctrl+K to focus search, Escape to clear
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

  // Handle - open overview
  const handleOpenOverview = (res: Resource) => {
    setResource(res);
    setIsOpen(true);
  };

  // Handle - open metadata
  const handleOpenMetadata = (res: Resource) => {
    setResourceForMetadata(res);
  };

  // Handle - see on map
  const handleSeeOnMap = useCallback((resourceId: string) => {
    setFocusResourceId(resourceId);
    setViewMode('map');
  }, []);

  // Handle - per page change
  const handlePerPageChange = (pp: PerPageOption) => {
    setPerPage(pp === 10 ? null : pp);
  };

  // Handle - query change
  const handleQueryChange = useCallback((q: string) => setUrlQuery(q || null), [setUrlQuery]);

  // Render hit card
  const renderHit = useCallback(
    (item: Resource) => (
      <HitCard
        item={item}
        gkhOnline={gkhOnline}
        onOpenOverview={handleOpenOverview}
        onOpenMetadata={handleOpenMetadata}
        onSeeOnMap={handleSeeOnMap}
      />
    ),
    [gkhOnline, handleSeeOnMap],
  );

  return (
    <InstantSearch searchClient={searchClient} indexName={INSTANT_SEARCH_INDEX}>
      {/* Sync initial URL query into InstantSearch */}
      <InitialQuerySync initialQuery={urlQuery} />

      {/* Configure hitsPerPage + filters (record type, map mode) */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Configure
        {...({
          hitsPerPage: perPage,
          ...(() => {

            const parts = [
              recordTypeFilterStr(recordType),
              viewMode === 'map' ? 'has_location:=true' : '',
            ].filter(Boolean);

            return parts.length > 0 ? { filters: parts.join(' && ') } : {};
          })(),
        } as any)}
      />

      <div className="min-h-screen bg-white">
        {viewMode === 'map' ? (
          /* Map mode: docked sidebar + map, fills viewport */
          <MapModeLayout
            onClearQuery={clearUrlQuery}
            focusResourceId={focusResourceId}
            onClearFocus={() => setFocusResourceId(null)}
            facetPanel={
              <>
                <RecordTypeFacet value={recordType} onChange={setRecordType} />
                <FacetPanel facets={facetConfig} transforms={facetTransforms} />
              </>
            }
            searchBar={<SearchInput inputRef={searchInputRef} onQueryChange={handleQueryChange} />}
            viewToggle={<SpatialHitsGate viewMode={viewMode} onToggle={setViewMode} />}
            perPage={perPage as PerPageOption}
            onPerPageChange={handlePerPageChange}
          />
        ) : (
          /* List mode: hero + search + sidebar + results */
          <>
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
                <div className="mb-8 text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                    Explore <span style={{ color: '#526479' }}>National</span> Knowledge
                  </h1>
                  <p className="mt-3 text-lg text-gray-500">
                    Search across Earth Observation resources from National GEO hubs
                  </p>
                </div>
                <HeroStats {...heroStats} />
              </div>
            </section>

            {/* Filters + results */}
            <div className="mx-auto max-w-7xl px-6 py-8 pb-16">
              {/* Search bar */}
              <div className="mb-6">
                <SearchInput inputRef={searchInputRef} onQueryChange={handleQueryChange} />
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
                  <FacetPanel facets={facetConfig} transforms={facetTransforms} />
                </div>
              )}

              {/* View tabs */}
              <div className="mb-6">
                <SpatialHitsGate viewMode={viewMode} onToggle={setViewMode} />
              </div>

              {/* Sidebar + results grid */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
                <aside className="hidden md:block">
                  <div className="sticky top-8">
                    <RecordTypeFacet value={recordType} onChange={setRecordType} />
                    <FacetPanel facets={facetConfig} transforms={facetTransforms} />
                  </div>
                </aside>

                <div>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <ResultsStats onClearQuery={clearUrlQuery} />
                    <PerPageSelector
                      value={perPage as PerPageOption}
                      onChange={handlePerPageChange}
                    />
                  </div>

                  <HitsList renderHit={renderHit} onClearQuery={clearUrlQuery} />

                  <SearchPagination
                    perPage={perPage as PerPageOption}
                    onPerPageChange={handlePerPageChange}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Overview dialog */}
        {resource !== null && (
          <ResourceOverviewDialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            data={resource}
            gkhOnline={gkhOnline}
          />
        )}

        {/* GKH metadata dialog */}
        {resourceForMetadata && (
          <GkhMetadataDialog
            open={!!resourceForMetadata}
            onClose={() => setResourceForMetadata(null)}
            data={resourceForMetadata}
          />
        )}
      </div>
    </InstantSearch>
  );
}
