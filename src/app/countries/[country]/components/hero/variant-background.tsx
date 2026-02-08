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

import { BackButton } from '@components/global';
import { getAssetPath } from '@lib/utils';

interface HeroBackgroundProps {
  title: string;
  description: string;
  countryId?: string;
  primaryColor?: string;
  hideBackButton?: boolean;
  managedBy?: string;
  managedByLink?: string;
}

/**
 * Hero Variant: Background
 * Full-width hero with background image and bottom-left text overlay
 * Uses rectangular/portrait-friendly images: /content/background/{countryId}-rect.[jpg|png]
 */
export function HeroBackground({
  title,
  description,
  countryId,
  primaryColor,
  hideBackButton = false,
  managedBy,
  managedByLink,
}: HeroBackgroundProps) {
  const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Try to load background image (jpg first, then png)
  useEffect(() => {
    if (!countryId) {
      setImageError(true);
      return;
    }

    // Try jpg first (rect suffix for rectangular/portrait-friendly images)
    // Assuming those are the supported formats - it will be replaced with upload in future
    const jpgPath = getAssetPath(`/content/background/${countryId}-rect.jpg`);
    const pngPath = getAssetPath(`/content/background/${countryId}-rect.png`);

    // Create an image element to test if jpg exists
    const img = new window.Image();
    img.onload = () => {
      setBackgroundSrc(jpgPath);
      setImageError(false);
    };

    img.onerror = () => {
      // Try png as fallback
      const pngImg = new window.Image();

      pngImg.onload = () => {
        setBackgroundSrc(pngPath);
        setImageError(false);
      };
      pngImg.onerror = () => {
        setImageError(true);
      };

      pngImg.src = pngPath;
    };
    img.src = jpgPath;
  }, [countryId]);

  // Fallback background color from theme
  const fallbackBgStyle: React.CSSProperties = {
    backgroundColor: primaryColor || 'var(--theme-primary, #526479)',
  };

  return (
    <section className="relative mt-[-2.5rem] h-[320px] w-full overflow-hidden md:h-[520px]">
      {/* Background Image or Solid Color Fallback */}
      <div className="absolute inset-0 h-full w-full">
        {backgroundSrc && !imageError ? (
          <Image
            src={backgroundSrc}
            alt={`${title} background`}
            fill
            sizes="100vw"
            className="object-cover object-center"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full" style={fallbackBgStyle} />
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Back Button */}
      {!hideBackButton && (
        <div className="relative z-20 px-4 pt-4 md:px-6 md:pt-6">
          <BackButton variant="hero" accentColor={primaryColor} />
        </div>
      )}

      {/* Content - Bottom Left Aligned */}
      <div className="absolute right-0 bottom-0 left-0 z-10 p-4 md:p-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-2xl font-bold text-white drop-shadow-lg md:mb-3 md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm text-white/90 drop-shadow-md md:text-xl">{description}</p>

          {/* Managed by - hidden on mobile */}
          {managedBy && (
            <div className="mt-3 hidden border-t border-white/20 pt-3 md:mt-4 md:block">
              <p className="mb-1 text-xs font-medium tracking-wide text-white/60 uppercase">
                Managed by
              </p>
              {managedByLink ? (
                <a
                  href={managedByLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-white/80"
                >
                  {managedBy}
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ) : (
                <p className="text-sm font-semibold text-white">{managedBy}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
