/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';

import { BackButton } from '@components/global';
import { getAssetPath } from '@lib/utils';

// Resource type icons
import iconKnowledgePackage from '@public/content/resources/knowledge-package.svg';
import iconPlatform from '@public/content/resources/platform.svg';
import iconAcademic from '@public/content/resources/academic.svg';
import iconPresentation from '@public/content/resources/presentation.svg';
import iconVideo from '@public/content/resources/video.svg';
import iconUserStory from '@public/content/resources/user-story.svg';

// Resource type to icon mapping
const resourceTypeIcons: Record<string, StaticImageData> = {
  'Knowledge Package': iconKnowledgePackage,
  'Web Portal': iconPlatform,
  'Training material': iconAcademic,
  Presentation: iconPresentation,
  Video: iconVideo,
  'User Story': iconUserStory,
};

// Resource type labels
const resourceTypeLabels: Record<string, string> = {
  'Knowledge Package': 'Packages',
  'Web Portal': 'Platforms',
  'Training material': 'Training materials',
  Presentation: 'Webinars',
  Video: 'Videos',
  'User Story': 'User Stories',
};

// Selected resource types to display
const selectedResourceTypes = [
  'Knowledge Package',
  'Web Portal',
  'Training material',
  'Presentation',
  'Video',
  'User Story',
];

interface HeroConnectionsProps {
  title: string;
  description: string;
  imageSrc?: string | StaticImageData;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageClass?: string;
  primaryColor?: string;
  managedBy?: string;
  managedByLink?: string;
  hideBackButton?: boolean;
}

/**
 * Hero Variant: Connections
 * Hero with connected nodes showing resource types around the central image
 */
export function HeroConnections({
  title,
  description,
  imageSrc,
  imageAlt,
  imageWidth = 400,
  imageHeight = 300,
  imageClass = 'h-full w-full object-contain',
  managedBy,
  managedByLink,
  hideBackButton = false,
}: HeroConnectionsProps) {
  return (
    <section className="py-5">
      <div className="relative mx-auto max-w-7xl px-6">
        {!hideBackButton && (
          <div className="mb-8">
            <BackButton />
          </div>
        )}

        <div className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* Left side - Content */}
          <div className="space-y-6">
            <h1 className="themed-title text-4xl font-bold tracking-tight md:text-5xl lg:text-5xl">
              {title}
            </h1>
            <p className="text-xl text-gray-700 md:text-2xl">{description}</p>

            {/* Managed by */}
            {managedBy && (
              <div
                className="border-t border-gray-200/80 pt-4"
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

          {/* Right side - Connected nodes */}
          {imageSrc && imageAlt && (
            <div className="flex justify-center md:justify-end">
              <div className="relative h-[450px] w-full md:h-[500px] md:w-[500px]">
                <svg
                  className="absolute inset-0 h-full w-full overflow-visible"
                  viewBox="0 0 500 500"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g transform="translate(250, 250)">
                    {(() => {
                      const positions = [
                        { x: -220, y: -180 },
                        { x: 180, y: -220 },
                        { x: 220, y: 180 },
                        { x: -180, y: 220 },
                        { x: 0, y: -200 },
                        { x: 0, y: 200 },
                      ];

                      return (
                        <>
                          {/* Connection lines */}
                          {selectedResourceTypes.map((type, index) => {
                            const pos = positions[index];
                            const controlX = pos.x * 0.5;
                            const controlY = pos.y * 0.5;
                            const offsetX = pos.y * 0.2;
                            const offsetY = -pos.x * 0.2;

                            return (
                              <path
                                key={`line-${index}`}
                                d={`M 0 0 Q ${controlX + offsetX} ${controlY + offsetY} ${pos.x} ${pos.y}`}
                                strokeWidth="1.5"
                                strokeOpacity="0.4"
                                fill="none"
                                className="animate-pulse"
                                style={{
                                  stroke: 'var(--theme-accent, #cbd5e1)',
                                  animationDelay: `${index * 0.2}s`,
                                }}
                              />
                            );
                          })}

                          {/* Resource icons */}
                          {selectedResourceTypes.map((type, index) => {
                            const icon = resourceTypeIcons[type];
                            const label = resourceTypeLabels[type] || type;
                            const pos = positions[index];

                            return (
                              <g
                                key={type}
                                className="group cursor-pointer"
                                transform={`translate(${pos.x}, ${pos.y})`}
                              >
                                <foreignObject x="-32" y="-32" width="64" height="64">
                                  <div className="glass-card relative flex h-16 w-16 items-center justify-center p-3">
                                    {icon && (
                                      <Image
                                        src={icon}
                                        alt={label}
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 object-contain"
                                      />
                                    )}
                                  </div>
                                </foreignObject>
                                <text
                                  x="0"
                                  y="50"
                                  textAnchor="middle"
                                  fontSize="12"
                                  fill="#4b5563"
                                  fontWeight="500"
                                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                                >
                                  {label}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </g>
                </svg>

                {/* Central logo card */}
                <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div
                      className="relative rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                      style={
                        {
                          borderColor: 'var(--theme-primary, rgba(229, 231, 235, 0.8))',
                        } as React.CSSProperties
                      }
                    >
                      <div className="h-48 w-64 overflow-hidden rounded-xl md:h-56 md:w-80">
                        <Image
                          src={typeof imageSrc === 'string' ? getAssetPath(imageSrc) : imageSrc}
                          alt={imageAlt}
                          width={imageWidth}
                          height={imageHeight}
                          className={imageClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth',
              });
            }}
            className="group flex flex-col items-center gap-2 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Scroll down"
          >
            <span className="text-sm font-medium tracking-wider uppercase">Explore</span>
            <svg
              className="h-6 w-6 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
