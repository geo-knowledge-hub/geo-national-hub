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

import {
  Database,
  Package,
  Globe,
  GraduationCap,
  Presentation,
  Video,
  BookUser,
  FileText,
} from 'lucide-react';

/**
 * Icon map
 */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  dataset: Database,
  'knowledge-package': Package,
  knowledge: Package,
  'web-portal': Globe,
  'journal-article': GraduationCap,
  'publication-article': GraduationCap,
  presentation: Presentation,
  video: Video,
  'user-story': BookUser,
};

interface ResourceIconProps {
  resourceTypeId: string;
  className?: string;
}

export function ResourceIcon({
  resourceTypeId,
  className = 'h-5 w-5',
}: ResourceIconProps): JSX.Element {
  const Icon = ICON_MAP[resourceTypeId] || FileText;
  return <Icon className={className} />;
}
