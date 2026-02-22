/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { createHash } from 'crypto';
import type { FilterRule } from './config';
import type { Resource } from '@content-types/content';

/**
 * Compute an MD5 hash of a metadata object for change detection.
 *
 * @param {object} metadata - Metadata object to hash.
 * @returns {string} Hex-encoded MD5 hash string.
 */
export function hashMetadata(metadata: object): string {
  // Stringify metadata
  const content = JSON.stringify(metadata);

  // Create hash
  return createHash('md5').update(content).digest('hex');
}

/**
 * Apply filter rules to a list of resources
 *
 * @param {Resource[]} resources - Resources to filter.
 * @param {FilterRule[]} [include] - Rules that must all match for a resource to be included.
 * @param {FilterRule[]} [exclude] - Rules where any match causes a resource to be excluded.
 * @returns {Resource[]} The filtered list of resources.
 */
export function applyFilters(
  resources: Resource[],
  include?: FilterRule[],
  exclude?: FilterRule[],
): Resource[] {
  // Filter resources
  return resources.filter((resource) => {
    // Check if include rules are present
    if (include && include.length > 0) {
      const included = include.every((rule) => matchesRule(resource, rule));

      if (!included) {
        return false;
      }
    }

    // Check if exclude rules are present
    if (exclude && exclude.length > 0) {
      const excluded = exclude.some((rule) => matchesRule(resource, rule));
      if (excluded) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Checks whether a resource matches a single filter rule.
 *
 * @param {Resource} resource - The resource to check.
 * @param {FilterRule} rule - The filter rule to apply.
 * @returns {boolean} True if the resource matches the rule.
 */
function matchesRule(resource: Resource, rule: FilterRule): boolean {
  // Get the field value
  const fieldValue = resource[rule.field as keyof Resource];

  // Check the operator
  switch (rule.operator) {
    // Equal
    case 'eq':
      return fieldValue === rule.value;

    // Not equal
    case 'neq':
      return fieldValue !== rule.value;

    // In
    case 'in': {
      // Get the values
      const values = Array.isArray(rule.value) ? rule.value : [rule.value];

      // Check if the field value is an array
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((v) => values.includes(v));
      }

      return values.includes(fieldValue as string);
    }

    // Not in
    case 'nin': {
      // Get the values
      const values = Array.isArray(rule.value) ? rule.value : [rule.value];

      // Check if the field value is an array
      if (Array.isArray(fieldValue)) {
        return !fieldValue.some((v) => values.includes(v));
      }

      // Return the result
      return !values.includes(fieldValue as string);
    }

    // Default
    default:
      // Return false
      return false;
  }
}
