/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Constant - Logger prefix.
 */
const PREFIX = '[sync]';

/**
 * Log an informational message with optional context.
 *
 * @param {string} message - The log message.
 * @param {Record<string, unknown>} [context] - Optional context object.
 */
export function info(message: string, context?: Record<string, unknown>): void {
  // Log with context
  if (context) {
    console.log(PREFIX, message, context);
  } else {
    console.log(PREFIX, message);
  }
}

/**
 * Log a warning message with optional context.
 *
 * @param {string} message - The log message.
 * @param {Record<string, unknown>} [context] - Optional context object.
 */
export function warn(message: string, context?: Record<string, unknown>): void {
  if (context) {
    console.warn(PREFIX, message, context);
  } else {
    console.warn(PREFIX, message);
  }
}

/**
 * Log an error message with optional context.
 *
 * @param {string} message - The log message.
 * @param {Record<string, unknown>} [context] - Optional context object.
 */
export function error(message: string, context?: Record<string, unknown>): void {
  if (context) {
    console.error(PREFIX, message, context);
  } else {
    console.error(PREFIX, message);
  }
}

export const logger = { info, warn, error };
