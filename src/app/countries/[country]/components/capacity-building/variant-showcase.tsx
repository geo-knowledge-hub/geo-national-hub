/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getAssetPath } from '@lib/utils';

import type { CapacityBuildingActivity } from '@content-types/content';

/**
 * Properties expected for the CapacityBuildingShowcase variant.
 */
interface CapacityBuildingShowcaseProps {
  countryId: string;
  countryTitle: string;
  activities: CapacityBuildingActivity[];
  /** Hide the "Explore Activities" link when already on the CB page. */
  showExploreLink?: boolean;
}

/**
 * Hex cell interface
 */
interface HexCell {
  row: number;
  col: number;
}

/**
 * Pointy-top hexagon clip-path
 */
const hexClip = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

/**
 * Height-to-width ratio for a regular pointy-top hexagon (2 / sqrt(3))
 */
const HEX_RATIO = 1.155;

/**
 * Base hex width. All positions are computed from this so hexagons tile
 * in a honeycomb pattern with a small uniform gap
 */
const BASE_W = 115;
const BASE_H = Math.round(BASE_W * HEX_RATIO); // ≈ 133
const GAP = 5; // px gap between adjacent hexagons
const COL_STEP = BASE_W + GAP; // 120
const ROW_STEP = Math.round(BASE_H * 0.75) + GAP; // ≈ 105
const ODD_OFFSET = Math.round(COL_STEP / 2); // ≈ 60

const hexCells: HexCell[] = [
  // Row 0 — even (4 hexagons)
  { row: 0, col: 0 },
  { row: 0, col: 1 },
  { row: 0, col: 2 },
  { row: 0, col: 3 },
  // Row 1 — odd, offset (3 hexagons)
  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: 1, col: 2 },
  // Row 2 — even (4 hexagons)
  { row: 2, col: 0 },
  { row: 2, col: 1 },
  { row: 2, col: 2 },
  { row: 2, col: 3 },
  // Row 3 — odd, offset (3 hexagons)
  { row: 3, col: 0 },
  { row: 3, col: 1 },
  { row: 3, col: 2 },
];

/**
 * Derive pixel position for a hex cell on the honeycomb grid
 */
function getHexPosition(cell: HexCell) {
  const isOddRow = cell.row % 2 === 1;
  return {
    x: cell.col * COL_STEP + (isOddRow ? ODD_OFFSET : 0),
    y: cell.row * ROW_STEP,
  };
}

/**
 * Overall grid bounding box (used for the container)
 */
const GRID_WIDTH = 3 * COL_STEP + BASE_W; // 475
const GRID_HEIGHT = 3 * ROW_STEP + BASE_H; // 448

/**
 * HexImage component
 */
function HexImage({ src, alt, x, y }: { src: string; alt: string; x: number; y: number }) {
  const borderWidth = 2;

  return (
    <div className="group/hex absolute" style={{ left: x, top: y, width: BASE_W, height: BASE_H }}>
      {/* Border layer — primary colour (always visible) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: hexClip,
          backgroundColor: 'var(--theme-primary, #526479)',
        }}
      />

      {/* Border layer — accent colour*/}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover/hex:opacity-100"
        style={{
          clipPath: hexClip,
          backgroundColor: 'var(--theme-accent, #8b9bb0)',
        }}
      />

      {/* Inner hex = image */}
      <div
        className="absolute overflow-hidden"
        style={{
          clipPath: hexClip,
          top: borderWidth,
          left: borderWidth,
          right: borderWidth,
          bottom: borderWidth,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={600}
          height={600}
          quality={85}
          sizes={`${BASE_W * 2}px`}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

/**
 * Capacity Building Variant: Showcase
 *
 * Displays a text section on the left with a CTA, and a contiguous honeycomb
 * image grid on the right showcasing country capacity building photos.
 *
 * For now, images are loaded from /content/showcase/{countryId}/{countryId}-cb-{n}.jpg
 *
 * @component
 * @param {CapacityBuildingShowcaseProps} props - Component props.
 * @returns {JSX.Element | null} The rendered variant or null if no activities.
 */
export function CapacityBuildingShowcase({
  countryId,
  countryTitle,
  activities,
  showExploreLink = true,
}: CapacityBuildingShowcaseProps) {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  // Define capacity building link
  const capacityBuildingPageLink = `${countryId}/capacity-building/activities`;

  // Discover available showcase images
  useEffect(() => {
    const maxImages = hexCells.length;
    const results: (string | null)[] = Array(maxImages).fill(null);
    let checked = 0;

    for (let i = 0; i < maxImages; i++) {
      const path = getAssetPath(`/content/showcase/${countryId}/${countryId}-cb-${i + 1}.jpg`);
      const img = new window.Image();

      img.onload = () => {
        results[i] = path;
        checked++;
        if (checked === maxImages) setLoadedImages(results.filter(Boolean) as string[]);
      };

      img.onerror = () => {
        checked++;
        if (checked === maxImages) setLoadedImages(results.filter(Boolean) as string[]);
      };

      img.src = path;
    }
  }, [countryId]);

  if (!activities || activities.length === 0) {
    return null;
  }

  const innerContent = (
    <div className="grid items-center gap-12 md:grid-cols-[1fr_1.2fr] lg:gap-20">
      {/* Left column — unified text block */}
      <div>
        <span className="themed-muted text-xs font-semibold tracking-widest uppercase">
          Learn. Engage. Create.
        </span>

        <h2 className="themed-title mt-3 text-3xl leading-tight font-bold lg:text-4xl">
          Capacity building in {countryTitle}
        </h2>

        <p className="mt-4 max-w-md text-base leading-relaxed text-gray-600">
          Join capacity-building activities in {countryTitle} to learn, connect, and drive change
          with Earth Observation.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <span className="themed-title text-5xl font-extrabold">{activities.length}</span>
          <span className="text-sm leading-snug text-gray-500">
            {activities.length === 1 ? 'activity' : 'activities'}
            <br />
            available
          </span>
        </div>

        {showExploreLink && (
          <Link
            href={capacityBuildingPageLink}
            className="themed-bg mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
          >
            Explore Activities
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      {/* Right column — Honeycomb image grid */}
      <div className="hidden md:flex md:justify-end">
        <div
          className="relative overflow-visible"
          style={{ width: GRID_WIDTH, height: GRID_HEIGHT }}
        >
          {loadedImages.length > 0
            ? loadedImages.map((src, index) => {
                const cell = hexCells[index];
                if (!cell) return null;
                const pos = getHexPosition(cell);

                return (
                  <HexImage
                    key={index}
                    src={src}
                    alt={`${countryTitle} capacity building ${index + 1}`}
                    x={pos.x}
                    y={pos.y}
                  />
                );
              })
            : hexCells.map((cell, index) => {
                const pos = getHexPosition(cell);
                return (
                  <div
                    key={index}
                    className="absolute animate-pulse"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      width: BASE_W,
                      height: BASE_H,
                      clipPath: hexClip,
                      backgroundColor: 'var(--theme-accent, #e5e7eb)',
                      opacity: 0.2,
                    }}
                  />
                );
              })}
        </div>
      </div>
    </div>
  );

  // Dedicated CB page
  if (!showExploreLink) {
    return <div id="learn">{innerContent}</div>;
  }

  // Country overview page
  return (
    <section id="learn" className="px-6 py-12">
      <div className="mx-auto max-w-7xl">{innerContent}</div>
    </section>
  );
}
