/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import React, { useEffect, useRef, useCallback, useState, JSX } from 'react';

import { Square, Pentagon, X, Maximize, MapPin, EyeOff } from 'lucide-react';

import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Popup,
  LayersControl,
  ZoomControl,
  useMap,
} from 'react-leaflet';

import type { Resource } from '@content-types/content';
import { stripHtml } from '@lib/sanitize';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

/**
 * Draw state type
 */
type DrawState = 'idle' | 'drawing' | 'active';

/**
 * Fly to resource props
 */
interface FlyToResourceProps {
  hits: Resource[];
  focusResourceId: string | null;
  onDone: () => void;
}

/**
 * Geoman draw props
 */
interface DrawProps {
  onGeoFilter: (coords: number[][] | null) => void;
  controlRef: React.MutableRefObject<{
    startDraw: (shape: 'Rectangle' | 'Polygon') => void;
    clearDraw: () => void;
    fitAll: () => void;
  } | null>;
  onDrawStateChange: (state: DrawState) => void;
  hits: Resource[];
}

/**
 * Spatial search bar props
 */
interface SpatialSearchBarProps {
  drawState: DrawState;
  showResults: boolean;
  onToggleResults: () => void;
  controlRef: React.MutableRefObject<{
    startDraw: (shape: 'Rectangle' | 'Polygon') => void;
    clearDraw: () => void;
    fitAll: () => void;
  } | null>;
}

/**
 * Resource popup props
 */
interface ResourcePopupProps {
  resource: Resource;
}

/**
 * Explore map view props
 */
export interface ExploreMapViewProps {
  hits: Resource[];
  showResults: boolean;
  onToggleResults: () => void;
  selectedId?: string | null;
  onSelectResource?: (id: string) => void;
  focusResourceId?: string | null;
  onFocusDone?: () => void;
  onGeoFilter?: (coords: number[][] | null) => void;
  height?: string;
  className?: string;
}

/**
 * Theme color
 */
const THEME_COLOR = '#526479';

/**
 * Default style for the resource polygons
 */
const DEFAULT_STYLE = {
  color: THEME_COLOR,
  weight: 2,
  fillColor: THEME_COLOR,
  fillOpacity: 0.2,
};

/**
 * Selected style for the resource polygons
 */
const SELECTED_STYLE = {
  color: '#2563eb',
  weight: 3,
  fillColor: '#2563eb',
  fillOpacity: 0.35,
};

/**
 * Style for the user-drawn search shape
 */
const SEARCH_SHAPE_STYLE: L.PathOptions = {
  color: '#e67e22',
  weight: 2,
  dashArray: '6, 4',
  fillColor: '#e67e22',
  fillOpacity: 0.08,
};

/**
 * Default center for the map
 */
const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_ZOOM = 2;

/**
 * Check if a resource has at least one spatial element
 * @param resource - The resource to check
 * @returns True if the resource has at least one spatial element
 */
export function hasSpatialData(resource: Resource): boolean {
  return (
    (Array.isArray(resource.locations?.bbox) && resource.locations!.bbox!.length >= 3) ||
    (Array.isArray(resource.locations?.centroid) && resource.locations!.centroid!.length === 2)
  );
}

/**
 * Get the bounds or center for a resource's spatial data
 * @param resource - The resource to get the bounds or center for
 * @returns The bounds or center for the resource's spatial data
 */
function getResourceBounds(resource: Resource): L.LatLngBounds | L.LatLng | null {
  const bbox = resource.locations?.bbox;
  const centroid = resource.locations?.centroid;

  if (Array.isArray(bbox) && bbox.length >= 3) {
    return L.latLngBounds(bbox as [number, number][]);
  }

  if (Array.isArray(centroid) && centroid.length === 2) {
    return L.latLng(centroid[0], centroid[1]);
  }

  return null;
}

/**
 * Focus on a resource on the map
 * @param hits - The resources to focus on
 * @param focusResourceId - The ID of the resource to focus on
 * @param onDone - The function to call when the focus is done
 * @returns null
 */
function FlyToResource({ hits, focusResourceId, onDone }: FlyToResourceProps): null {
  const map = useMap();

  useEffect(() => {
    // If there is no resource, no focus
    if (!focusResourceId) {
      return;
    }

    const resource = hits.find((h) => h.id === focusResourceId);
    if (!resource) {
      return;
    }

    const target = getResourceBounds(resource);
    if (!target) {
      return;
    }

    if (target instanceof L.LatLngBounds) {
      map.fitBounds(target, { padding: [60, 60], maxZoom: 12 });
    } else {
      map.flyTo(target, 10);
    }

    onDone();
  }, [focusResourceId, hits, map, onDone]);

  return null;
}

/**
 * Convert a layer to coordinates
 * @param layer - The layer to convert
 * @returns The coordinates of the layer
 */
function layerToCoords(layer: L.Layer): number[][] | null {
  if (layer instanceof L.Polygon) {
    const latlngs = layer.getLatLngs()[0] as L.LatLng[];

    if (latlngs.length < 3) {
      return null;
    }

    return latlngs.map((ll) => [ll.lat, ll.lng]);
  }
  return null;
}

/**
 * Draw component
 * @param onGeoFilter - The function to call when the geo filter is updated
 * @param controlRef - The ref to the control
 * @param onDrawStateChange - The function to call when the draw state changes
 * @param hits - The resources to draw
 * @returns null
 */
function Draw({ onGeoFilter, controlRef, onDrawStateChange, hits }: DrawProps): null {
  // State - define component state
  const map = useMap();
  const drawnLayerRef = useRef<L.Layer | null>(null);

  // Callback - Update the geo filter
  const updateFilter = useCallback(
    (layer: L.Layer | null) => {
      if (layer) {
        onGeoFilter(layerToCoords(layer));
        onDrawStateChange('active');
      } else {
        onGeoFilter(null);
        onDrawStateChange('idle');
      }
    },
    [onGeoFilter, onDrawStateChange],
  );

  // Effect - Expose imperative controls
  useEffect(() => {
    controlRef.current = {
      startDraw: (shape) => {
        // Remove previous shape before drawing new one
        if (drawnLayerRef.current) {
          map.removeLayer(drawnLayerRef.current);
          drawnLayerRef.current = null;
        }
        onDrawStateChange('drawing');
        map.pm.enableDraw(shape, {
          pathOptions: SEARCH_SHAPE_STYLE,
        });
      },
      clearDraw: () => {
        map.pm.disableDraw();
        if (drawnLayerRef.current) {
          map.removeLayer(drawnLayerRef.current);
          drawnLayerRef.current = null;
        }
        updateFilter(null);
      },
      fitAll: () => {
        const boundsPoints: [number, number][] = [];
        hits.forEach((hit) => {
          const bbox = hit.locations?.bbox;
          const centroid = hit.locations?.centroid;
          if (Array.isArray(bbox) && bbox.length >= 3) {
            bbox.forEach((point) => boundsPoints.push(point));
          } else if (Array.isArray(centroid) && centroid.length === 2) {
            boundsPoints.push(centroid as [number, number]);
          }
        });
        if (boundsPoints.length > 0) {
          map.fitBounds(L.latLngBounds(boundsPoints), { padding: [32, 32], maxZoom: 10 });
        } else {
          map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
        }
      },
    };
    return () => {
      controlRef.current = null;
    };
  }, [map, controlRef, onDrawStateChange, updateFilter, hits]);

  // Effect - Set up event listeners
  useEffect(() => {
    // Configure global options
    map.pm.setGlobalOptions({
      pathOptions: SEARCH_SHAPE_STYLE,
    } as Parameters<typeof map.pm.setGlobalOptions>[0]);

    const handleCreate = (e: { layer: L.Layer }) => {
      if (drawnLayerRef.current) {
        map.removeLayer(drawnLayerRef.current);
      }
      drawnLayerRef.current = e.layer;
      updateFilter(e.layer);
    };

    const handleRemove = (e: { layer: L.Layer }) => {
      if (drawnLayerRef.current === e.layer) {
        drawnLayerRef.current = null;
        updateFilter(null);
      }
    };

    map.on('pm:create', handleCreate);
    map.on('pm:remove', handleRemove);

    return () => {
      map.off('pm:create', handleCreate);
      map.off('pm:remove', handleRemove);
      map.pm.disableDraw();
      if (drawnLayerRef.current) {
        map.removeLayer(drawnLayerRef.current);
      }
    };
  }, [map, updateFilter]);

  return null;
}

/**
 * Spatial search bar component
 * @param drawState - The state of the draw
 * @param showResults - Whether to show results
 * @param onToggleResults - The function to call when the toggle results is clicked
 * @param controlRef - The ref to the control
 * @returns null
 */
function SpatialSearchBar({
  drawState,
  showResults,
  onToggleResults,
  controlRef,
}: SpatialSearchBarProps): JSX.Element {
  return (
    <div className="absolute top-3 left-1/2 z-[1000] flex -translate-x-1/2 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-md">
      {drawState === 'idle' && (
        <>
          {/* Show / hide results on map */}
          <button
            onClick={onToggleResults}
            className={`flex h-7 items-center gap-1.5 rounded px-2 text-xs font-medium transition ${
              showResults ? 'text-gray-500 hover:bg-gray-100' : 'hover:bg-blue-50'
            }`}
            style={showResults ? undefined : { color: THEME_COLOR }}
            title={showResults ? 'Hide all results from map' : 'Show all results on map'}
          >
            {showResults ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                Hide all results
              </>
            ) : (
              <>
                <MapPin className="h-3.5 w-3.5" />
                Show all results
              </>
            )}
          </button>
          <div className="mx-1 h-4 w-px bg-gray-200" />
          <span className="mr-1 text-xs text-gray-500">Draw to search</span>
          <button
            onClick={() => controlRef.current?.startDraw('Rectangle')}
            className="flex h-7 w-7 items-center justify-center rounded transition hover:bg-gray-100"
            title="Draw rectangle"
          >
            <Square className="h-3.5 w-3.5 text-gray-600" />
          </button>
          <button
            onClick={() => controlRef.current?.startDraw('Polygon')}
            className="flex h-7 w-7 items-center justify-center rounded transition hover:bg-gray-100"
            title="Draw polygon"
          >
            <Pentagon className="h-3.5 w-3.5 text-gray-600" />
          </button>
          <div className="mx-1 h-4 w-px bg-gray-200" />
          <button
            onClick={() => controlRef.current?.fitAll()}
            className="flex h-7 w-7 items-center justify-center rounded transition hover:bg-gray-100"
            title="Fit all results"
          >
            <Maximize className="h-3.5 w-3.5 text-gray-600" />
          </button>
        </>
      )}
      {drawState === 'drawing' && (
        <>
          <span className="mr-1 animate-pulse text-xs text-gray-500">Drawing…</span>
          <button
            onClick={() => controlRef.current?.clearDraw()}
            className="flex h-7 items-center gap-1 rounded px-2 text-xs text-gray-500 transition hover:bg-gray-100"
          >
            Cancel
          </button>
        </>
      )}
      {drawState === 'active' && (
        <>
          <span className="mr-1 text-xs font-medium" style={{ color: THEME_COLOR }}>
            Searching in area
          </span>
          <button
            onClick={() => controlRef.current?.clearDraw()}
            className="flex h-7 items-center gap-1 rounded px-2 text-xs text-red-500 transition hover:bg-red-50"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
          <div className="mx-1 h-4 w-px bg-gray-200" />
          <button
            onClick={() => controlRef.current?.fitAll()}
            className="flex h-7 w-7 items-center justify-center rounded transition hover:bg-gray-100"
            title="Fit all results"
          >
            <Maximize className="h-3.5 w-3.5 text-gray-600" />
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Resource popup component
 * @param resource - The resource to display
 * @returns null
 */
function ResourcePopup({ resource }: ResourcePopupProps): JSX.Element {
  const plainDesc = resource.description ? stripHtml(resource.description) : null;
  const snippet = plainDesc ? plainDesc.slice(0, 100) + (plainDesc.length > 100 ? '…' : '') : null;

  return (
    <div style={{ minWidth: '200px', maxWidth: '280px', fontFamily: 'inherit' }}>
      {/* Type badge */}
      {resource.resource_type?.name && (
        <span
          style={{
            display: 'inline-block',
            marginBottom: '6px',
            padding: '2px 8px',
            borderRadius: '9999px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            fontSize: '11px',
            fontWeight: 500,
            color: '#4b5563',
          }}
        >
          {resource.resource_type.name}
        </span>
      )}

      {/* Title */}
      <p
        style={{
          margin: '0 0 4px 0',
          fontSize: '14px',
          fontWeight: 600,
          color: '#111827',
          lineHeight: '1.3',
        }}
      >
        {resource.name}
      </p>

      {/* Description snippet */}
      {snippet && (
        <p
          style={{
            margin: '0 0 8px 0',
            fontSize: '12px',
            color: '#6b7280',
            lineHeight: '1.4',
          }}
        >
          {snippet}
        </p>
      )}

      {/* View link */}
      {resource.link && (
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: THEME_COLOR,
            textDecoration: 'none',
          }}
        >
          View &rarr;
        </a>
      )}
    </div>
  );
}

/**
 * React-Leaflet map showing search results that have spatial data.
 *
 * This component is meant to be dynamically imported (ssr: false) because
 * Leaflet requires the browser's window object.
 *
 * @component
 */
export function ExploreMapView({
  hits,
  showResults,
  onToggleResults,
  selectedId,
  onSelectResource,
  focusResourceId,
  onFocusDone,
  onGeoFilter,
  height = '500px',
  className = 'overflow-hidden rounded-xl border border-gray-100',
}: ExploreMapViewProps): JSX.Element {
  // State - define component state
  const spatialHits = hits.filter(hasSpatialData);
  const popupRefs = useRef<Map<string, L.Popup>>(new Map());

  // State - draw state + imperative ref
  const [drawState, setDrawState] = useState<DrawState>('idle');
  const drawControlRef = useRef<{
    startDraw: (shape: 'Rectangle' | 'Polygon') => void;
    clearDraw: () => void;
    fitAll: () => void;
  } | null>(null);

  // Render the map
  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Spatial search floating bar */}
      {onGeoFilter && (
        <SpatialSearchBar
          drawState={drawState}
          showResults={showResults}
          onToggleResults={onToggleResults}
          controlRef={drawControlRef}
        />
      )}

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Zoom control — bottom-left to avoid overlap */}
        <ZoomControl position="bottomleft" />

        {/* Base layer switcher */}
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Draw tools for spatial search */}
        {onGeoFilter && (
          <Draw
            onGeoFilter={onGeoFilter}
            controlRef={drawControlRef}
            onDrawStateChange={setDrawState}
            hits={spatialHits}
          />
        )}

        {/* Fly to a focused resource (works even when show-all is off) */}
        {focusResourceId && onFocusDone && (
          <FlyToResource
            hits={spatialHits}
            focusResourceId={focusResourceId}
            onDone={onFocusDone}
          />
        )}

        {/* Render spatial hits: all when showResults, or just the selected one */}
        {(showResults ? spatialHits : spatialHits.filter((h) => h.id === selectedId)).map((hit) => {
          const bbox = hit.locations?.bbox;
          const centroid = hit.locations?.centroid;
          const isSelected = selectedId === hit.id;

          const handleClick = () => onSelectResource?.(hit.id);

          if (Array.isArray(bbox) && bbox.length >= 3) {
            const positions = bbox as [number, number][];

            return (
              <Polygon
                key={hit.id}
                positions={positions}
                pathOptions={isSelected ? SELECTED_STYLE : DEFAULT_STYLE}
                eventHandlers={{ click: handleClick }}
              >
                <Popup
                  ref={(ref) => {
                    if (ref) popupRefs.current.set(hit.id, ref);
                  }}
                >
                  <ResourcePopup resource={hit} />
                </Popup>
              </Polygon>
            );
          }

          if (Array.isArray(centroid) && centroid.length === 2) {
            return (
              <Marker
                key={hit.id}
                position={centroid as [number, number]}
                eventHandlers={{ click: handleClick }}
              >
                <Popup
                  ref={(ref) => {
                    if (ref) popupRefs.current.set(hit.id, ref);
                  }}
                >
                  <ResourcePopup resource={hit} />
                </Popup>
              </Marker>
            );
          }

          return null;
        })}
      </MapContainer>
    </div>
  );
}
