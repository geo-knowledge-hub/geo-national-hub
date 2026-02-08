/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import Image, { StaticImageData } from 'next/image';

import { BackButton } from '@components/global';
import { getAssetPath } from '@lib/utils';

interface HeroClassicProps {
  title: string;
  description: string;
  imageSrc?: string | StaticImageData;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageClass?: string;
  primaryColor?: string;
  hideBackButton?: boolean;
  managedBy?: string;
  managedByLink?: string;
}

/**
 * Hero Variant: Classic
 * Simple hero layout with title, description, and country flag
 */
export function HeroClassic({
  title,
  description,
  imageSrc,
  imageAlt,
  imageWidth = 300,
  imageHeight = 200,
  imageClass = 'h-full w-full object-fit',
  hideBackButton = false,
  managedBy,
  managedByLink,
}: HeroClassicProps) {
  return (
    <section className="py-5">
      {!hideBackButton && (
        <div className="mb-10">
          <BackButton />
        </div>
      )}

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="themed-title mb-4 text-4xl font-extrabold md:text-5xl">{title}</h1>
          <p className="text-lg text-gray-600">{description}</p>

          {/* Managed by */}
          {managedBy && (
            <div
              className="mt-6 border-t border-gray-200/80 pt-4"
              style={{ borderColor: 'var(--theme-accent, rgba(229, 231, 235, 0.8))' }}
            >
              <p className="mb-2 text-sm font-medium tracking-wide text-gray-500 uppercase">
                Managed by
              </p>
              {managedByLink ? (
                <a
                  href={managedByLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-[var(--theme-primary)]"
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
                <p className="text-lg font-semibold text-gray-900">{managedBy}</p>
              )}
            </div>
          )}
        </div>
        {imageSrc && imageAlt && (
          <div className="flex justify-end md:justify-center">
            <div
              className="h-40 w-64 overflow-hidden rounded-md border border-gray-200/80 shadow-sm"
              style={
                {
                  borderColor: 'var(--theme-accent, rgba(229, 231, 235, 0.8))',
                } as React.CSSProperties
              }
            >
              <Image
                src={typeof imageSrc === 'string' ? getAssetPath(imageSrc) : imageSrc}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className={imageClass}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
