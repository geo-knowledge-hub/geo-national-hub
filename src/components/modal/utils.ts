/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { sanitizeHtml } from '@lib/sanitize';

/**
 * Formats an ISO date string into a human-readable form.
 *
 * @param dateStr - ISO date string.
 * @returns Formatted date like "January 5, 2026".
 */
export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Sanitizes an HTML string and ensures all anchor tags open in a new tab.
 *
 * @param html - Raw HTML string.
 * @returns Sanitized HTML with all links opening in new tabs.
 */
export function addBlankTargetToLinks(html: string): string {
  const clean = sanitizeHtml(html);
  return clean.replace(/<a\s/gi, '<a target="_blank" rel="noopener noreferrer" ');
}
