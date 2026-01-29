/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';

import { useRouter } from 'next/navigation';

/**
 * BackButtonProps - Define the properties for the ``BackButton`` component.
 */
interface BackButtonProps {
  /** The label text displayed on the button (default: "Back") */
  label?: string;
  /** Additional CSS classes for customization */
  className?: string;
  /** Visual variant for different backgrounds (default: "default") */
  variant?: 'default' | 'light' | 'hero';
  /** Optional accent color for hero variant (e.g. theme primary) – used as border/tint */
  accentColor?: string;
}

/**
 * BackButton Component
 *
 * @component
 * @param {BackButtonProps} props - The properties for the ``BackButton`` component.
 * @param {string} [props.label="Back"] - The text label of the button.
 * @param {string} [props.className] - Optional additional CSS classes.
 * @param {string} [props.variant="default"] - Visual variant: "default" for dark text, "light" for white text on dark backgrounds, "hero" for hero overlays (glass that adapts to image).
 * @param {string} [props.accentColor] - Optional accent color for hero variant (e.g. theme primary).
 * @returns {JSX.Element} The rendered ``BackButton`` component.
 */
export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  className = '',
  variant = 'default',
  accentColor,
}: BackButtonProps): JSX.Element => {
  /**
   * States
   */
  const router = useRouter();

  /**
   * Auxiliary function
   */
  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // Style variants
  const isLight = variant === 'light';
  const isHero = variant === 'hero';

  // Hero with country theme: use theme primary for background tint and border
  const heroInlineStyle =
    isHero && accentColor
      ? {
          backgroundColor: `${accentColor}40`,
          borderColor: accentColor,
          boxShadow: `0 0 0 1px ${accentColor}60`,
        }
      : isHero
        ? { backgroundColor: 'rgba(0,0,0,0.25)', borderColor: 'rgba(255,255,255,0.3)' }
        : undefined;

  const buttonStyles = isHero
    ? 'backdrop-blur-xl border text-white shadow-lg hover:opacity-90'
    : isLight
      ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
      : 'glass-button text-gray-700';

  const iconStyles =
    isLight || isHero
      ? 'text-white/95 group-hover:text-white'
      : 'text-gray-500 group-hover:text-gray-700';

  const textStyles =
    isLight || isHero
      ? 'text-white group-hover:text-white'
      : 'text-gray-700 group-hover:text-gray-900';

  return (
    <button
      className={`group flex cursor-pointer items-center rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105 ${buttonStyles} ${className}`}
      style={heroInlineStyle}
      onClick={handleGoBack}
    >
      <svg
        className={`mr-2 h-5 w-5 transition-all duration-300 ${iconStyles}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
      </svg>
      <span className={`font-medium transition-all duration-300 ${textStyles}`}>{label}</span>
    </button>
  );
};
