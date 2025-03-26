/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';

/**
 * HeaderProps - Define the properties accepted in the ``Badge`` component.
 */
interface BadgeProps {
  color: string;
  textColor: string;
  label: string;
}

/**
 * Badge component.
 *
 * @component
 * @param {BadgeProps} props - Component props.
 * @param {string} props.color - Badge background color.
 * @param {string} props.textColor - Badge text color.
 * @param {string} props.label - Badge text.
 * @returns {JSX.Element} The rendered Badge component.
 */
export const Badge: React.FC<BadgeProps> = ({
  color,
  textColor,
  label,
}: BadgeProps): JSX.Element => (
  <span className={`bg-${color} text-${textColor} rounded-full px-3 py-1 text-xs`}>{label}</span>
);
