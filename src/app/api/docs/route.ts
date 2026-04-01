/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { ApiReference } from '@scalar/nextjs-api-reference';

import { generateOpenApiSpec } from '../search/openapi';

export const GET = ApiReference({
  content: generateOpenApiSpec(),
  pageTitle: 'National GEO Knowledge Hub — API Reference',
});
