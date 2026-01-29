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

import Link from 'next/link';
import Image from 'next/image';

import { BookOpenIcon } from '@heroicons/react/24/solid';

import { Badge } from '@components/global';

import type { CapacityBuildingActivity } from '@content-types/content';
import { getAssetPath } from '@lib/utils';

/**
 * Properties of the ActivityItem component.
 */
interface ActivityItemProps {
  activity: CapacityBuildingActivity;
}

/**
 * ActivityItem Component
 *
 * @component
 * @param {ActivityItemProps} params Component params.
 * @returns {JSX.Element} The rendered ActivityItem component.
 */
export function ActivityItem({ activity }: ActivityItemProps): JSX.Element {
  // Check if logo is an image path or empty (use default icon)
  const hasImageLogo = activity.logo && activity.logo.startsWith('/');

  // Format date for display
  const formatDate = (dateString?: string): string | null => {
    if (!dateString) return null;
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return null;
    }
  };

  // Check if event is in the future
  const isFutureEvent = (dateString?: string): boolean => {
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
  };

  const formattedDate = formatDate(activity.date);
  const isFuture = isFutureEvent(activity.date);

  return (
    <div className="glass-card group flex items-center justify-between p-6">
      <div className="flex-1 space-y-3">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {formattedDate && <Badge color="gray-900" textColor="white" label={formattedDate} />}
          {activity.recurring && (
            <Badge color="purple-100" textColor="purple-800" label="Recurring" />
          )}
          {isFuture && <Badge color="green-100" textColor="green-800" label="Upcoming" />}
        </div>

        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            <Link href={activity.link} target="_blank">
              {activity.title}
            </Link>
          </h3>
        </div>
        <p className="mt-1 text-sm text-gray-600">{activity.description}</p>

        <Link
          href={activity.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block font-medium text-gray-800 transition hover:text-gray-900"
        >
          Explore →
        </Link>
      </div>
      <div className="rounded-md bg-gray-100 p-5 transition group-hover:bg-gray-200/80">
        {hasImageLogo ? (
          <Image
            src={getAssetPath(activity.logo)}
            alt="Activity icon"
            className="flex h-6 w-6 items-center justify-center rounded-lg"
            width={24}
            height={24}
          />
        ) : (
          <BookOpenIcon className="flex h-6 w-6 items-center justify-center rounded-lg text-gray-600" />
        )}
      </div>
    </div>
  );
}
