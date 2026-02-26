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
import { BookOpen, ExternalLink } from 'lucide-react';

import type { CapacityBuildingActivity } from '@content-types/content';
import { getAssetPath } from '@lib/utils';

/**
 * Properties of the ActivityItem component.
 */
interface ActivityItemProps {
  activity: CapacityBuildingActivity;
}

/**
 * Format a YYYY-MM-DD date string for display.
 */
function formatDate(dateString?: string): string | null {
  if (!dateString) {
    return null;
  }

  try {
    const [year, month, day] = dateString.split('-').map(Number);

    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return null;
  }
}

/**
 * Returns true if the date is today or in the future.
 */
function isFutureEvent(dateString?: string): boolean {
  if (!dateString) return false;
  try {
    const [year, month, day] = dateString.split('-').map(Number);

    const eventDate = new Date(year, month - 1, day);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return eventDate >= today;
  } catch {
    return false;
  }
}

/**
 * ActivityItem Component
 *
 * @component
 * @param {ActivityItemProps} props - Component props.
 * @returns {JSX.Element} The rendered ActivityItem component.
 */
export function ActivityItem({ activity }: ActivityItemProps): JSX.Element {
  // Check if the activity has an image logo.
  const hasImageLogo = !!activity.logo && activity.logo.startsWith('/');

  // Format the date.
  const formattedDate = formatDate(activity.date);

  // Check if the event is in the future.
  const isFuture = isFutureEvent(activity.date);

  // Render!
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[color:var(--theme-primary,#526479)]/20 hover:shadow-md">
      {/* Left accent line */}
      <div
        className="absolute inset-y-0 left-0 w-0.5 rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100"
        style={{ backgroundColor: 'var(--theme-primary, #526479)' }}
      />

      <div className="flex items-start gap-5">
        <div className="hidden shrink-0 sm:block">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
            {hasImageLogo ? (
              <Image src={getAssetPath(activity.logo)} alt="Activity icon" width={22} height={22} />
            ) : (
              <BookOpen className="h-5 w-5 text-gray-300" />
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {/* Badges */}
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
            {formattedDate && (
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                {formattedDate}
              </span>
            )}
            {activity.recurring && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-400">
                Recurring
              </span>
            )}
            {isFuture && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-700 uppercase">
                Upcoming
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="mb-1.5 text-base leading-snug font-semibold text-gray-900 transition group-hover:text-[color:var(--theme-primary,#526479)]">
            <a
              href={activity.link}
              target="_blank"
              rel="noopener noreferrer"
              className="after:absolute after:inset-0"
            >
              {activity.title}
            </a>
          </h3>

          {/* Description */}
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
            {activity.description}
          </p>

          {/* Action */}
          <div className="relative z-10 mt-4">
            <a
              href={activity.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition hover:opacity-80"
              style={{ color: 'var(--theme-primary, #526479)' }}
            >
              Access
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
