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
import type { Supporter } from '@content-types/content';

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
  supporters?: Supporter[];
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
  supporters,
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

          {/* Supporters */}
          {supporters && supporters.length > 0 && (
            <div
              className="mt-6 border-t border-gray-200/80 pt-4"
              style={{ borderColor: 'var(--theme-accent, rgba(229, 231, 235, 0.8))' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                  Supported by
                </span>
                {supporters.map((supporter) => {
                  const logo = (
                    <Image
                      src={getAssetPath(supporter.logo)}
                      alt={supporter.name}
                      width={100}
                      height={32}
                      className="h-10 w-auto object-contain"
                    />
                  );

                  return supporter.url ? (
                    <a
                      key={supporter.name}
                      href={supporter.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-70"
                      title={supporter.name}
                    >
                      {logo}
                    </a>
                  ) : (
                    <span key={supporter.name} title={supporter.name}>
                      {logo}
                    </span>
                  );
                })}
              </div>
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
