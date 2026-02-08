/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Icon Registry
 *
 * Maps icon names (stored in JSON/Typesense) to React components.
 * This allows challenge icons to be specified as strings in data
 * and resolved to actual components at runtime.
 */

import {
  GlobeAltIcon,
  CloudIcon,
  BugAntIcon,
  ExclamationTriangleIcon,
  ScissorsIcon,
  PercentBadgeIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

/**
 * Registry mapping icon names to HeroIcon components
 */
export const iconRegistry = {
  GlobeAltIcon,
  CloudIcon,
  BugAntIcon,
  ExclamationTriangleIcon,
  ScissorsIcon,
  PercentBadgeIcon,
  ExclamationCircleIcon,
} as const;

/**
 * Valid icon names that can be stored in JSON/Typesense
 */
export type IconName = keyof typeof iconRegistry;

/**
 * Get icon component by name
 *
 * @param name - The icon name from the registry
 * @returns The icon component or null if not found
 */
export function getIcon(name: string) {
  return iconRegistry[name as IconName] ?? null;
}
