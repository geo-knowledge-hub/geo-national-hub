/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useEffect, JSX } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';

import type { ResourceLocations } from '@content-types/content';

import 'leaflet/dist/leaflet.css';

/**
 * Props for the OverviewMapInner component
 */
interface OverviewMapInnerProps {
  locations: ResourceLocations;
}

/**
 * Tile URL for the map
 */
const TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';

/**
 * Style for the polygon
 */
const POLYGON_STYLE = {
  color: '#526479',
  weight: 2,
  fillColor: '#526479',
  fillOpacity: 0.15,
};

/**
 * Fit the bounds of the map to the locations
 */
function FitBounds({ locations }: OverviewMapInnerProps): null {
  const map = useMap();

  useEffect(() => {
    const bbox = locations.bbox;
    const centroid = locations.centroid;

    if (Array.isArray(bbox) && bbox.length >= 3) {
      const bounds = bbox as LatLngBoundsExpression;

      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 8 });
    } else if (Array.isArray(centroid) && centroid.length === 2) {
      map.setView(centroid as [number, number], 5);
    }
  }, [locations, map]);

  return null;
}

/**
 * Overview map inner component
 */
export function OverviewMapInner({ locations }: OverviewMapInnerProps): JSX.Element {
  const bbox = locations.bbox;
  const centroid = locations.centroid;

  const center: [number, number] =
    Array.isArray(centroid) && centroid.length === 2 ? (centroid as [number, number]) : [20, 0];

  return (
    <MapContainer
      center={center}
      zoom={3}
      className="h-[200px] w-full rounded-lg"
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      attributionControl={false}
    >
      <TileLayer url={TILE_URL} />
      <FitBounds locations={locations} />

      {Array.isArray(bbox) && bbox.length >= 3 && (
        <Polygon positions={bbox as [number, number][]} pathOptions={POLYGON_STYLE} />
      )}

      {Array.isArray(centroid) &&
        centroid.length === 2 &&
        !(Array.isArray(bbox) && bbox.length >= 3) && (
          <Marker position={centroid as [number, number]} />
        )}
    </MapContainer>
  );
}
