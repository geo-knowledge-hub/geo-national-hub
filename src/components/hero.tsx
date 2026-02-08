/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useMemo } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import type { HeroIcon } from '@content-types/content';
import { BackButton } from './button';
import { getAssetPath } from '@lib/utils';

// Resource type icons
import iconAcademic from '@public/content/resources/academic.svg';
import iconKnowledgePackage from '@public/content/resources/knowledge-package.svg';
import iconPlatform from '@public/content/resources/platform.svg';
import iconPresentation from '@public/content/resources/presentation.svg';
import iconUserStory from '@public/content/resources/user-story.svg';
import iconVideo from '@public/content/resources/video.svg';

// Resource type to icon mapping
const resourceTypeIcons: Record<string, StaticImageData> = {
  'Knowledge Package': iconKnowledgePackage,
  'Web Portal': iconPlatform,
  'Training material': iconAcademic,
  'Community Activity': iconUserStory,
  Academic: iconAcademic,
  Presentation: iconPresentation,
  Video: iconVideo,
  'User Story': iconUserStory,
  Platform: iconPlatform,
};

// Resource type labels
const resourceTypeLabels: Record<string, string> = {
  'Knowledge Package': 'Packages',
  'Web Portal': 'Platforms',
  'Training material': 'Training materials',
  'Community Activity': 'Community',
  Presentation: 'Webinars',
  Video: 'Videos',
  'User Story': 'User Stories',
  Platform: 'Platforms',
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

interface HeroCountryProps {
  title: string;
  description: string;
  imageSrc?: string | StaticImageData;
  imageIcon?: HeroIcon;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageClass?: string;
  managedBy?: string;
  managedByLink?: string;
}

interface HeroTopicProps {
  title: string;
  description: string;
  message?: string;
  imageSrc?: string | StaticImageData;
  imageIcon?: HeroIcon;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageClass?: string;
  ctaLabel?: string;
  ctaLink?: string;
  ctaMessage?: string;
  enableBackButton?: boolean;
}

export const HeroCountry: React.FC<HeroCountryProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  imageWidth = 300,
  imageHeight = 200,
  imageClass = 'h-full w-full object-fit',
}: HeroCountryProps) => {
  return (
    <section className="py-5">
      <div className="mb-10">
        <BackButton />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">{title}</h1>
          <p className="text-lg text-gray-600">{description}</p>
        </div>
        {imageSrc && imageAlt && (
          <div className="flex justify-end md:justify-center">
            <div className="h-40 w-64 overflow-hidden rounded-md shadow-md">
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
};

export const HeroSouthAfrica: React.FC<HeroCountryProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  imageWidth = 400,
  imageHeight = 300,
  imageClass = 'h-full w-full object-contain',
  managedBy = 'South African Group on Earth Observations (SA-GEO)',
  managedByLink = 'https://neoss.co.za/sa-geo',
}: HeroCountryProps) => {
  return (
    <section className="py-5">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-blue-100/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-gray-200/20 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-blue-50/30 blur-2xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <BackButton />
        </div>

        <div className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* Left side - Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-5xl">
              {title}
            </h1>
            <p className="text-xl text-gray-700 md:text-2xl">{description}</p>

            {/* Managed by */}
            {managedBy && (
              <div className="border-t border-gray-200 pt-4">
                <p className="mb-2 text-sm font-medium tracking-wide text-gray-500 uppercase">
                  Managed by
                </p>
                {managedByLink ? (
                  <a
                    href={managedByLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-[#526479]"
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

          {/* Right side */}
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
                        { x: -220, y: -180 }, // Top-left (more left, slightly up)
                        { x: 180, y: -220 }, // Top-right (more up, slightly left)
                        { x: 220, y: 180 }, // Bottom-right (more right, slightly down)
                        { x: -180, y: 220 }, // Bottom-left (more down, slightly left)
                        { x: 0, y: -200 }, // Top center
                        { x: 0, y: 200 }, // Bottom center
                      ];

                      return (
                        <>
                          {selectedResourceTypes.map((type, index) => {
                            const pos = positions[index];

                            // Calculate control point for curve
                            const controlX = pos.x * 0.5;
                            const controlY = pos.y * 0.5;

                            // Add perpendicular offset for curve effect
                            const offsetX = pos.y * 0.2;
                            const offsetY = -pos.x * 0.2;

                            return (
                              <path
                                key={`line-${index}`}
                                d={`M 0 0 Q ${controlX + offsetX} ${controlY + offsetY} ${pos.x} ${pos.y}`}
                                stroke="#cbd5e1"
                                strokeWidth="1.5"
                                strokeOpacity="0.4"
                                fill="none"
                                className="animate-pulse-line"
                                style={{
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
                                  <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-white p-3">
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
                    <div className="animate-pulse-glow absolute inset-0 rounded-2xl bg-blue-200/30"></div>
                    <div className="relative rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200/50">
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
              className="animate-bounce-slow h-6 w-6"
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
};

export const HeroTopic: React.FC<HeroTopicProps> = ({
  title,
  description,
  imageSrc,
  imageIcon,
  imageAlt,
  imageWidth = 300,
  imageHeight = 200,
  imageClass = 'h-full w-full object-cover',
  ctaLabel,
  ctaLink,
  ctaMessage,
  enableBackButton = true,
}) => {
  // Components
  const ImageIcon = imageIcon;

  return (
    <section className="py-5">
      {enableBackButton && (
        <div className="mx-auto mb-8 max-w-7xl px-6">
          <BackButton />
        </div>
      )}

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="themed-title mb-4 text-4xl font-extrabold md:text-5xl">{title}</h1>
          <p className="text-2xl text-gray-600">{description}</p>
        </div>

        {/* CTA — desktop only */}
        {ctaLabel && ctaLink ? (
          <div className="hidden md:flex md:justify-end">
            <div className="flex flex-col items-center space-y-3 text-center">
              <p className="text-sm text-gray-600">{ctaMessage}</p>

              <Link
                href={ctaLink}
                className="glass-button inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium shadow-sm transition-all hover:border-gray-400 hover:shadow-md"
              >
                {ctaLabel}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          /* Image/icon — desktop only */
          <div className="hidden md:flex md:justify-end">
            {imageIcon ? (
              // @ts-expect-error temporary solution
              <ImageIcon className="h-32 w-32 overflow-hidden rounded-md" />
            ) : imageSrc && imageAlt ? (
              <div className="h-48 w-72 overflow-hidden rounded-md">
                <Image
                  src={typeof imageSrc === 'string' ? getAssetPath(imageSrc) : imageSrc}
                  alt={imageAlt}
                  width={imageWidth}
                  height={imageHeight}
                  className={imageClass}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
};
