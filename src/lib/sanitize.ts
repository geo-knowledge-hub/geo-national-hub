/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes an HTML string, keeping safe tags and attributes.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}

/**
 * Strips all HTML tags, returning plain text only.
 */
export function stripHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}
