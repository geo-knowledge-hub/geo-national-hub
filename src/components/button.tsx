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
}

/**
 * BackButton Component
 *
 * @component
 * @param {BackButtonProps} props - The properties for the ``BackButton`` component.
 * @param {string} [props.label="Back"] - The text label of the button.
 * @param {string} [props.className] - Optional additional CSS classes.
 * @returns {JSX.Element} The rendered ``BackButton`` component.
 */
export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  className = '',
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

  return (
    <button
      className={`group flex cursor-pointer items-center rounded-full border border-gray-400 bg-white/60 px-4 py-2 text-gray-800 shadow-md backdrop-blur-lg transition-all duration-300 hover:bg-white/80 ${className}`}
      onClick={handleGoBack}
    >
      <svg
        className="mr-2 h-5 w-5 text-gray-800 transition-all duration-300 group-hover:text-gray-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
      </svg>
      <span className="font-medium text-gray-900 transition-all duration-300 group-hover:text-gray-700">
        {label}
      </span>
    </button>
  );
};
