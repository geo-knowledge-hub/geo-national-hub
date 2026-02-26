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

interface HeroWideProps {
  title: string;
  description: string;
  countryId?: string;
  primaryColor?: string;
  hideBackButton?: boolean;
  managedBy?: string;
  managedByLink?: string;
}

/**
 * Hero Variant: Wide
 * Full-width hero optimized for wide/banner-style images
 * Uses wide images: /content/background/{countryId}-wide.[jpg|png]
 */
export function HeroWide({
  title,
  description,
  countryId,
  primaryColor,
  hideBackButton = false,
  managedBy,
  managedByLink,
}: HeroWideProps) {
  const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string>('3/1'); // fallback until image loads

  // Try to load background image (jpg first, then png) and read its dimensions
  useEffect(() => {
    if (!countryId) {
      setImageError(true);
      return;
    }

    const jpgPath = getAssetPath(`/content/background/${countryId}-wide.jpg`);
    const pngPath = getAssetPath(`/content/background/${countryId}-wide.png`);

    const applyDimensions = (img: HTMLImageElement, src: string) => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      if (w > 0 && h > 0) {
        setAspectRatio(`${w}/${h}`);
      }

      setBackgroundSrc(src);
      setImageError(false);
    };

    const img = new window.Image();

    img.onload = () => applyDimensions(img, jpgPath);
    img.onerror = () => {
      const pngImg = new window.Image();
      pngImg.onload = () => applyDimensions(pngImg, pngPath);
      pngImg.onerror = () => setImageError(true);
      pngImg.src = pngPath;
    };

    img.src = jpgPath;
  }, [countryId]);

  // Fallback background color from theme
  const fallbackBgStyle: React.CSSProperties = {
    backgroundColor: primaryColor || 'var(--theme-primary, #526479)',
  };

  return (
    <section
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        marginTop: '-2.5rem', // Counteract pt-10 from parent container
      }}
    >
      {/* Background Image Container - min height on mobile to prevent overlap, aspect ratio on larger screens */}
      <div className="relative min-h-[280px] w-full md:min-h-0" style={{ aspectRatio }}>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back Button */}
        {!hideBackButton && (
          <div className="absolute top-0 left-0 z-20 px-4 pt-4 md:px-12 md:pt-10">
            <BackButton variant="hero" accentColor={primaryColor} />
          </div>
        )}

        {/* Content */}
        <div className="absolute right-0 bottom-0 left-0 z-10 p-4 md:p-12 lg:p-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white drop-shadow-xl md:mb-4 md:text-3xl lg:text-4xl xl:text-5xl">
              {title}
            </h1>
            <p className="max-w-3xl text-sm font-medium text-white/90 drop-shadow-lg md:text-lg lg:text-xl">
              {description}
            </p>

            {/* Managed by - hidden on mobile to prevent overlap */}
            {managedBy && (
              <div className="mt-3 hidden border-t border-white/20 pt-3 md:mt-5 md:block md:pt-4">
                <p className="mb-1 text-sm font-medium tracking-wide text-white/60 uppercase">
                  Managed by
                </p>
                {managedByLink ? (
                  <a
                    href={managedByLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base font-semibold text-white transition-colors hover:text-white/80 md:text-lg"
                  >
                    {managedBy}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ) : (
                  <p className="text-base font-semibold text-white md:text-lg">{managedBy}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
