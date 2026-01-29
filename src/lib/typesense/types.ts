/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Typesense Utility Types
 *
 * Types specific to Typesense operations and schema definitions.
 */

/**
 * Typesense field definition for schema creation
 */
export interface TypesenseField {
  name: string;
  type:
    | 'string'
    | 'string[]'
    | 'int32'
    | 'int32[]'
    | 'int64'
    | 'int64[]'
    | 'float'
    | 'float[]'
    | 'bool'
    | 'bool[]'
    | 'object'
    | 'object[]'
    | 'auto';
  facet?: boolean;
  optional?: boolean;
  index?: boolean;
  sort?: boolean;
}

/**
 * Generic search hit wrapper for Typesense results
 */
export interface SearchHit<T> {
  document: T;
  highlight?: Record<string, unknown>;
  highlights?: Array<{ field: string; snippet: string }>;
}
