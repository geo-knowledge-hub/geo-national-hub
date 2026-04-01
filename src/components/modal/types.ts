/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import type { Resource } from '@content-types/content';

/**
 * Props - Resource overview dialog
 */
export interface ResourceOverviewDialogProps {
  open: boolean;
  onClose: () => void;
  data: Resource;
  gkhOnline?: boolean;
}

/**
 * Props - GKH metadata dialog
 */
export interface GkhMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  data: Resource;
}
