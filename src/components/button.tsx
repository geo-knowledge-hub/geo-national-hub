/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

import { cn } from '@lib/utils';
import { Button } from './ui/button';

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
 * Thin wrapper around shadcn Button with ChevronLeft Lucide icon.
 *
 * @component
 * @param {BackButtonProps} props - The properties for the ``BackButton`` component.
 * @returns {JSX.Element} The rendered ``BackButton`` component.
 */
export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  className = '',
  variant = 'default',
  accentColor,
}: BackButtonProps): JSX.Element => {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const isLight = variant === 'light';
  const isHero = variant === 'hero';

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

  return (
    <Button
      variant={isHero || isLight ? 'ghost' : 'glass'}
      className={cn(
        'group cursor-pointer rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105',
        isHero && 'border text-white shadow-lg backdrop-blur-xl hover:opacity-90',
        isLight &&
          'border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20',
        className,
      )}
      style={heroInlineStyle}
      onClick={handleGoBack}
    >
      <ChevronLeft
        className={cn(
          'mr-1 h-5 w-5 transition-all duration-300',
          isLight || isHero
            ? 'text-white/95 group-hover:text-white'
            : 'text-gray-500 group-hover:text-gray-700',
        )}
      />
      <span
        className={cn(
          'font-medium transition-all duration-300',
          isLight || isHero
            ? 'text-white group-hover:text-white'
            : 'text-gray-700 group-hover:text-gray-900',
        )}
      >
        {label}
      </span>
    </Button>
  );
};
