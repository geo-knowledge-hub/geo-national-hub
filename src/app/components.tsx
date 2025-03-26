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
import Link from 'next/link';
import Image from 'next/image';

/**
 * Properties of the ``NavItem`` .
 */
type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

/**
 * Properties expected for the ``Header`` component.
 */
interface HeaderProps {
  logoSrc: string;
  logoAlt: string;
  navItems: NavItem[];
  contactLink: string;
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
 * Common header for the GEO National Knowledge Hub.
 *
 * @component
 * @param {HeaderProps} props - Component props.
 * @param {string} props.logoSrc - Logo image address.
 * @param {string} props.logoAlt - Logo image alternative text.
 * @param {NavItem} props.navItems - Navigation items.
 * @param {string} props.contactLink - Contact link / email address.
 * @returns {JSX.Element} The rendered Header component.
 */
export const Header: React.FC<HeaderProps> = ({
  logoSrc,
  logoAlt,
  navItems,
  contactLink,
}: HeaderProps): JSX.Element => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-23 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" passHref>
              <div className="flex cursor-pointer items-center space-x-2">
                <Image src={logoSrc} alt={logoAlt} height={64} />
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center space-x-10 md:flex">
            {navItems.map((item, index) =>
              item.external ? (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-700 hover:text-gray-900"
                >
                  {item.label}
                </a>
              ) : (
                <Link key={index} href={item.href} passHref>
                  <span className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                    {item.label}
                  </span>
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <a
              href={contactLink}
              className="rounded-full bg-gray-900 px-4 py-2 text-white transition hover:bg-gray-800"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
