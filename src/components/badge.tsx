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
 * Background color mapping for Tailwind CSS classes
 */
const bgColorMap: Record<string, string> = {
  'gray-100': 'bg-gray-100',
  'gray-200': 'bg-gray-200',
  'gray-900': 'bg-gray-900',
  'blue-100': 'bg-blue-100',
  'purple-100': 'bg-purple-100',
  'green-100': 'bg-green-100',
};

/**
 * Text color mapping for Tailwind CSS classes
 */
const textColorMap: Record<string, string> = {
  'gray-700': 'text-gray-700',
  'gray-800': 'text-gray-800',
  white: 'text-white',
  'blue-800': 'text-blue-800',
  'purple-800': 'text-purple-800',
  'green-800': 'text-green-800',
};

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
}: BadgeProps): JSX.Element => {
  const bgClass = bgColorMap[color] || 'bg-gray-100';
  const textClass = textColorMap[textColor] || 'text-gray-800';

  return (
    <span className={`${bgClass} ${textClass} rounded-full px-3 py-1 text-xs font-medium`}>
      {label}
    </span>
  );
};
