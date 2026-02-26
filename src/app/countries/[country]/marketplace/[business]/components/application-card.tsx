/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX } from 'react';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { getAssetPath } from '@lib/utils';

import type { MarketplaceApplication } from '@content-types/content';

/**
 * Properties expected for the ApplicationCard component.
 */
interface ApplicationCardProps {
  /** Application data */
  application: MarketplaceApplication;
  /** Callback when the card is clicked */
  onClick: () => void;
}

/**
 * ApplicationCard Component
 *
 * @component
 * @param {ApplicationCardProps} props - Component props.
 * @returns {JSX.Element} The rendered ApplicationCard component.
 */
export function ApplicationCard({ application, onClick }: ApplicationCardProps): JSX.Element {
  // Render
  return (
    <button
      onClick={onClick}
      className="mp-card group flex w-full cursor-pointer items-start gap-4 p-5 text-left"
    >
      {/* App icon */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-gray-100 bg-white shadow-sm transition-shadow duration-200 group-hover:shadow-md">
        {application.icon ? (
          <Image
            src={getAssetPath(application.icon)}
            alt={application.title}
            width={64}
            height={64}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <div className="themed-bg flex h-full w-full items-center justify-center text-lg font-bold text-white opacity-80">
            {application.title
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Name */}
        <h3 className="text-base font-bold text-gray-900">{application.title}</h3>

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{application.description}</p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {application.focus_areas?.map((area) => (
            <span
              key={area}
              className="themed-title rounded-full border border-gray-200/60 bg-white/60 px-2 py-0.5 text-[11px] font-semibold"
            >
              {area}
            </span>
          ))}
          <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-500">
            {application.app_type}
          </span>
        </div>

        {/* CTA */}
        <div className="themed-title mt-3 flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Learn more
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </button>
  );
}
