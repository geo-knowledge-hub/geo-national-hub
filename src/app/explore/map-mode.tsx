/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, JSX } from 'react';
import dynamic from 'next/dynamic';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Locate,
  ExternalLink,
} from 'lucide-react';

import {
  useHits,
  useStats,
  useInstantSearch,
  useClearRefinements,
  usePagination,
  useSearchBox,
  Configure,
} from 'react-instantsearch';
import type { Resource } from '@content-types/content';
import { stripHtml } from '@lib/sanitize';
import { computePageNumbers, PER_PAGE_OPTIONS } from '@lib/search/utils';
import type { PerPageOption } from '@lib/search/utils';

import { hasSpatialData } from './map-view';

/**
 * Compact card props
 */
interface CompactCardProps {
  /** The resource to display. */
  resource: Resource;
  /** Whether the card is selected. */
  isSelected: boolean;
  /** The function to call when the card is clicked. */
  onClick: () => void;
  /** The function to call when the card is zoomed to. */
  onZoomTo?: () => void;
}

/**
 * Docked sidebar props
 */
interface DockedSidebarProps {
  /** The ID of the selected resource. */
  selectedId: string | null;
  /** The function to call when a resource is selected. */
  onSelectResource: (id: string | null) => void;
  /** The function to call when a resource is zoomed to. */
  onZoomTo: (id: string) => void;
  /** The function to call when the query is cleared. */
  onClearQuery: () => void;
  /** The facet panel to display. */
  facetPanel: React.ReactNode;
  /** The number of results per page. */
  perPage: PerPageOption;
  /** The function to call when the number of results per page is changed. */
  onPerPageChange: (value: PerPageOption) => void;
}

/**
 * Map mode layout props
 */
interface MapModeLayoutProps {
  /** The function to call when the query is cleared. */
  onClearQuery: () => void;
  focusResourceId: string | null;
  /** The function to call when the focus is cleared. */
  onClearFocus: () => void;
  /** The facet panel to display. */
  facetPanel: React.ReactNode;
  /** The search bar to display. */
  searchBar: React.ReactNode;
  /** The view toggle to display. */
  viewToggle: React.ReactNode;
  /** The number of results per page. */
  perPage: PerPageOption;
  /** The function to call when the number of results per page is changed. */
  onPerPageChange: (value: PerPageOption) => void;
}

/**
 * Explore map component
 */
const ExploreMap = dynamic(() => import('./map-view').then((mod) => mod.ExploreMapView), {
  ssr: false,
});

/**
 * Compact card component
 */
function CompactCard({ resource, isSelected, onClick, onZoomTo }: CompactCardProps): JSX.Element {
  const plainDesc = resource.description ? stripHtml(resource.description) : '';

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-2 text-left transition-all ${
        isSelected
          ? 'border-blue-300 bg-blue-50 shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
      }`}
    >
      <div className="mb-0.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {resource.resource_type?.name && (
            <span className="rounded-full border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
              {resource.resource_type.name}
            </span>
          )}
          {resource.country && (
            <span className="text-[10px] text-gray-400">{resource.country}</span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {resource.link && (
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex h-5 w-5 items-center justify-center rounded text-gray-400 transition hover:bg-blue-100 hover:text-blue-600"
              title="Open resource"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {onZoomTo && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onZoomTo();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  onZoomTo();
                }
              }}
              className="flex h-5 w-5 items-center justify-center rounded text-gray-400 transition hover:bg-blue-100 hover:text-blue-600"
              title="Zoom to"
            >
              <Locate className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>
      <p className="line-clamp-1 text-xs font-medium text-gray-900">{resource.name}</p>
      {plainDesc && <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500">{plainDesc}</p>}
    </button>
  );
}

/**
 * Per page dropdown component
 */
function PerPageDropdown({
  perPage,
  onPerPageChange,
}: {
  perPage: PerPageOption;
  onPerPageChange: (v: PerPageOption) => void;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Side effect - close the dropdown when clicking outside
  useEffect(() => {
    if (!open) {
      return;
    }

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium text-gray-500 transition hover:bg-gray-100"
      >
        {perPage}
        <ChevronDown className="h-2.5 w-2.5" />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {PER_PAGE_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => {
                onPerPageChange(n);
                setOpen(false);
              }}
              className={`block w-full px-3 py-1 text-left text-[11px] transition ${
                perPage === n ? 'font-semibold text-[#526479]' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Compact pagination component
 */
function CompactPagination({
  perPage,
  onPerPageChange,
}: {
  perPage: PerPageOption;
  onPerPageChange: (v: PerPageOption) => void;
}): JSX.Element | null {
  const { currentRefinement, nbPages, refine } = usePagination();
  const currentPage = currentRefinement + 1;
  const totalPages = Math.max(1, nbPages);

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = computePageNumbers(totalPages, currentPage);

  return (
    <div className="flex items-center justify-between px-2 py-2">
      <div className="flex items-center gap-0.5">
        <button
          disabled={currentPage === 1}
          onClick={() => refine(currentPage - 2)}
          className="flex h-6 w-6 items-center justify-center rounded text-gray-500 transition hover:bg-gray-100 disabled:opacity-30"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
        {pageNumbers.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e-${i}`} className="px-1 text-[10px] text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => refine(p - 1)}
              className={`flex h-6 w-6 items-center justify-center rounded text-[11px] transition ${
                currentPage === p
                  ? 'bg-[#526479] font-semibold text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => refine(currentPage)}
          className="flex h-6 w-6 items-center justify-center rounded text-gray-500 transition hover:bg-gray-100 disabled:opacity-30"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <PerPageDropdown perPage={perPage} onPerPageChange={onPerPageChange} />
    </div>
  );
}

/**
 * Docked sidebar component
 */
function DockedSidebar({
  selectedId,
  onSelectResource,
  onZoomTo,
  onClearQuery,
  facetPanel,
  perPage,
  onPerPageChange,
}: DockedSidebarProps): JSX.Element {
  // State - define component states
  const { hits } = useHits<Resource>();
  const { nbHits } = useStats();
  const { status } = useInstantSearch();
  const { refine: clearAll, canRefine: hasActiveRefinements } = useClearRefinements();
  const { query, clear: clearSearch } = useSearchBox();

  // State - define component states
  const [facetsOpen, setFacetsOpen] = useState(false);
  const [noLocOpen, setNoLocOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Check if the search is loading or stalled
  const isSearching = status === 'loading' || status === 'stalled';

  // Check if there are any active filters
  const hasActiveFilters = hasActiveRefinements || query.trim() !== '';

  // Split hits into spatial and no-location
  const { spatialHits, noLocation } = useMemo(() => {
    const spatial: Resource[] = [];
    const noLoc: Resource[] = [];

    hits.forEach((hit) => {
      if (hasSpatialData(hit)) spatial.push(hit);
      else noLoc.push(hit);
    });

    return { spatialHits: spatial, noLocation: noLoc };
  }, [hits]);

  const handleClearAll = useCallback(() => {
    clearAll();
    clearSearch();
    onClearQuery();
  }, [clearAll, clearSearch, onClearQuery]);

  // Scroll to selected card when selection changes from map click
  useEffect(() => {
    if (!selectedId) return;
    const el = cardRefs.current.get(selectedId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedId]);

  return (
    <div className="flex w-[280px] shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Fixed header */}
      <div className="shrink-0">
        {/* Result count + clear */}
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
          <p className="text-xs font-medium text-gray-500">
            {isSearching ? (
              <span className="animate-pulse">Searching…</span>
            ) : (
              <>
                <span className="font-semibold text-gray-900">{nbHits.toLocaleString()}</span>{' '}
                {nbHits === 1 ? 'result' : 'results'}
              </>
            )}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="text-[11px] font-medium underline underline-offset-2 transition hover:text-gray-700"
              style={{ color: '#526479' }}
            >
              clear filters
            </button>
          )}
        </div>

        {/* Collapsible facets */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => setFacetsOpen(!facetsOpen)}
            className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-semibold tracking-wide text-gray-500 uppercase transition hover:bg-gray-50"
          >
            Filters
            {facetsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          <div
            className={`max-h-[40vh] overflow-y-auto px-3 pb-2 [&_.mb-5]:mb-2.5 [&_button]:px-1.5 [&_button]:py-1 [&_button]:text-[11px] [&_p]:mb-1.5 [&_p]:text-[11px] [&_span]:text-[11px] ${facetsOpen ? '' : 'hidden'}`}
          >
            {facetPanel}
          </div>
        </div>

        {/* Summary line */}
        <div className="border-b border-gray-100 px-3 py-1.5">
          <p className="text-[11px] text-gray-400">
            <span className="font-medium text-gray-600">{spatialHits.length}</span> on map
          </p>
        </div>
      </div>

      {/* Scrollable results */}
      <div ref={listRef} className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1.5 p-2">
          {spatialHits.map((hit) => (
            <div
              key={hit.id}
              ref={(el) => {
                if (el) cardRefs.current.set(hit.id, el);
              }}
            >
              <CompactCard
                resource={hit}
                isSelected={selectedId === hit.id}
                onClick={() => onSelectResource(selectedId === hit.id ? null : hit.id)}
                onZoomTo={() => onZoomTo(hit.id)}
              />
            </div>
          ))}
          {spatialHits.length === 0 && !isSearching && (
            <p className="py-4 text-center text-xs text-gray-400">No results with location data</p>
          )}
        </div>
      </div>

      {/* Fixed footer */}
      <div className="shrink-0">
        {/* Pagination */}
        <div className="border-t border-gray-100">
          <CompactPagination perPage={perPage} onPerPageChange={onPerPageChange} />
        </div>

        {/* No-location records */}
        {noLocation.length > 0 && (
          <div className="border-t border-gray-100">
            <button
              onClick={() => setNoLocOpen(!noLocOpen)}
              className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-semibold tracking-wide text-gray-500 uppercase transition hover:bg-gray-50"
            >
              <span>Other results ({noLocation.length})</span>
              {noLocOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {noLocOpen && (
              <div className="max-h-[30vh] overflow-y-auto">
                <div className="flex flex-col gap-1.5 p-2">
                  {noLocation.map((hit) => (
                    <div key={hit.id} className="opacity-50">
                      <CompactCard resource={hit} isSelected={false} onClick={() => {}} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Map mode layout component
 */
export function MapModeLayout({
  onClearQuery,
  focusResourceId,
  onClearFocus,
  facetPanel,
  searchBar,
  viewToggle,
  perPage,
  onPerPageChange,
}: MapModeLayoutProps): JSX.Element {
  const { hits } = useHits<Resource>();

  // Whether to show all results (markers/polygons) on the map
  const [showResults, setShowResults] = useState<boolean>(false);

  // Selection state (highlight only, no zoom)
  const [selectedId, setSelectedId] = useState<string | null>(focusResourceId);

  // Explicit zoom target
  const [zoomTargetId, setZoomTargetId] = useState<string | null>(focusResourceId);

  // Drawn polygon coordinates for geo search
  const [drawnPolygon, setDrawnPolygon] = useState<number[][] | null>(null);

  // When focusResourceId is set from list mode, select + zoom
  useEffect(() => {
    if (focusResourceId) {
      setSelectedId(focusResourceId);
      setZoomTargetId(focusResourceId);
    }
  }, [focusResourceId]);

  // Handle - select from sidebar
  const handleSelectFromSidebar = useCallback((id: string | null) => {
    setSelectedId(id);

    if (id) {
      setZoomTargetId(id);
    }
  }, []);

  // Handle - select from map
  const handleSelectFromMap = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  // Handle - zoom to
  const handleZoomTo = useCallback((id: string) => {
    setZoomTargetId(id);
  }, []);

  // Handle - zoom done
  const handleZoomDone = useCallback(() => {
    setZoomTargetId(null);
    onClearFocus();
  }, [onClearFocus]);

  // Handle - toggle results
  const handleToggleResults = useCallback(() => {
    setShowResults((prev) => !prev);
  }, []);

  // Handle - geo filter
  const handleGeoFilter = useCallback((coords: number[][] | null) => {
    setDrawnPolygon(coords);
    setShowResults(!!coords);
  }, []);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 5rem)' }}>
      {/* Configure insidePolygon */}
      {drawnPolygon && (
        <Configure {...({ insidePolygon: [drawnPolygon] } as Record<string, unknown>)} />
      )}

      {/* Top bar: search + view tabs */}
      <div className="shrink-0 bg-white">
        <div className="px-4 py-3">{searchBar}</div>
        {viewToggle}
      </div>

      {/* Content row: sidebar + map */}
      <div className="flex min-h-0 flex-1">
        {/* Docked sidebar */}
        <DockedSidebar
          selectedId={selectedId}
          onSelectResource={handleSelectFromSidebar}
          onZoomTo={handleZoomTo}
          onClearQuery={onClearQuery}
          facetPanel={facetPanel}
          perPage={perPage}
          onPerPageChange={onPerPageChange}
        />

        {/* Map */}
        <div className="min-w-0 flex-1">
          <ExploreMap
            hits={hits}
            showResults={showResults}
            onToggleResults={handleToggleResults}
            selectedId={selectedId}
            onSelectResource={handleSelectFromMap}
            focusResourceId={zoomTargetId}
            onFocusDone={handleZoomDone}
            onGeoFilter={handleGeoFilter}
            height="100%"
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
