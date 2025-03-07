/*
 * This file is part of GEO-Country-Profile.
 * Copyright (C) 2025 GEO Knowledge Hub Developers.
 *
 * GEO-Country-Profile is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX } from 'react';
import Link from 'next/link';

/**
 * BackButtonProps - Define the properties for the ``BackButton`` component.
 */
interface BackButtonProps {
  /** The URL to navigate to when clicked */
  href: string;
  /** The label text displayed on the button (default: "Back") */
  label?: string;
  /** Additional CSS classes for customization */
  className?: string;
}

/**
 * HeroSearch Component
 *
 * @component
 * @param {object} props - Component props.
 * @param {string} props.searchTerm - Current search term.
 * @param {Function} props.setSearchTerm - Function to update the search term.
 * @returns {JSX.Element} The rendered HeroSearch component.
 */
export const HeroSearch: React.FC<{
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}> = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}): JSX.Element => {
  return (
    <section className="relative mb-25 bg-gray-50 px-4 py-3">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          National GEO Knowledge Hub
        </h1>
        <p className="mb-6 text-lg text-gray-700">
          Search and discover EO Applications and solutions tailored for your country.
        </p>

        {/* Search Bar */}
        <form className="relative mx-auto w-full max-w-md">
          <label htmlFor="search-input" className="sr-only">
            Search for a country
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 19l-4-4m2-6A7 7 0 1 1 3 10a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search-input"
              className="block w-full rounded-lg border border-gray-300 bg-white p-4 pl-10 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search for a country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

/**
 * BackButton Component
 *
 * @component
 * @param {BackButtonProps} props - The properties for the ``BackButton`` component.
 * @param {string} props.href - The destination URL.
 * @param {string} [props.label="Back"] - The text label of the button.
 * @param {string} [props.className] - Optional additional CSS classes.
 * @returns {JSX.Element} The rendered ``BackButton`` component.
 */
export const BackButton: React.FC<BackButtonProps> = ({
  href,
  label = 'Back',
  className = '',
}: BackButtonProps): JSX.Element => {
  return (
    <Link
      href={href}
      className={`group flex items-center rounded-full border border-gray-400 bg-white/60 px-4 py-2 text-gray-800 shadow-md backdrop-blur-lg transition-all duration-300 hover:bg-white/80 ${className}`}
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
    </Link>
  );
};
