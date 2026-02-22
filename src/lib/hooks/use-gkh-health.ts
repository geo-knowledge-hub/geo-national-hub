/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { HealthStatus } from '@content-types/content';

/**
 * Properties of the health status hook
 */
interface UseGkhHealthResult {
  online: boolean;
  latency_ms: number;
  checked_at: string | null;
}

/**
 * Polls the GKH health endpoint and returns the current status.
 *
 * @param {number} [refreshInterval=60000] - Polling interval in milliseconds.
 * @returns {UseGkhHealthResult} Current GKH health status.
 */
export function useGkhHealth(refreshInterval = 60_000): UseGkhHealthResult {
  // State - current health status
  const [status, setStatus] = useState<UseGkhHealthResult>({
    online: true,
    latency_ms: 0,
    checked_at: null,
  });

  // Function - fetch GKH health status
  const fetchHealth = useCallback(async () => {
    try {
      // Fetch GKH health status
      const res = await fetch('/national/api/health');

      // If the response is ok, set the health status
      if (res.ok) {
        // Parse data
        const data: HealthStatus = await res.json();

        // Set the health status
        setStatus({
          online: data.online,
          latency_ms: data.latency_ms,
          checked_at: data.checked_at,
        });
      }
    } catch {
      // If the health endpoint itself fails, keep previous state
    }
  }, []);

  // Effect - Setup polling
  useEffect(() => {
    // Fetch initial health status
    fetchHealth();

    // Setup polling interval
    const interval = setInterval(fetchHealth, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchHealth, refreshInterval]);

  // Return!
  return status;
}
