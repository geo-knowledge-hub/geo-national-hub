/*
 * This file is part of GEO-Country-Profile.
 * Copyright (C) 2025 GEO Knowledge Hub Developers.
 *
 * GEO-Country-Profile is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import './globals.css';

import logoGEO from '@public/images/logo-geo-full.png';
import logoGKH from '@public/images/logo-full-blue.svg';

/**
 * LayoutProps Interface - Defines the expected properties for the Layout component.
 */
interface LayoutProps {
  /** The child components that will be rendered inside the layout */
  children: ReactNode;
}

/**
 * Layout Component - Provides the main structure of the application.
 *
 * @component
 * @param {LayoutProps} props - The properties for the Layout component.
 * @param {ReactNode} props.children - The main content of the page.
 * @returns {JSX.Element} The rendered Layout component.
 */
const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps): JSX.Element => {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-gray-50 font-sans antialiased">
        {/* Header */}
        <header className="absolute top-0 left-0 z-50 w-full bg-white px-6 py-5 shadow-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            {/* Logo on the left */}
            <Link href="/" className="flex items-center font-bold text-gray-900">
              <Image src={logoGKH} alt="GKH Logo" width={220} height={100} priority />
            </Link>

            {/* Navigation Links - Responsive */}
            <nav className="absolute left-1/2 hidden -translate-x-1/2 transform space-x-8 font-medium text-gray-800 md:flex">
              <Link href="/countries" className="transition hover:text-gray-600">
                Country Profiles
              </Link>
              <Link
                href="https://gkhub.earthobservations.org"
                className="transition hover:text-gray-600"
              >
                Knowledge
              </Link>
              <Link
                href="https://gkhub.earthobservations.org/marketplace"
                className="transition hover:text-gray-600"
              >
                Marketplace
              </Link>
            </nav>

            {/* Login button on the right */}
            <Link href="#" className="flex items-center text-gray-800 hover:text-gray-600">
              Log in <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pt-24 pb-10">
          <div className="mx-auto max-w-7xl px-6">{children}</div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 py-10 text-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 lg:flex-row">
            {/* Footer Links */}
            <div className="grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-4">
              {/* About */}
              <div className="flex flex-col">
                <h4 className="mb-3 text-lg font-semibold">Documentation</h4>
                <Link
                  href="https://gkhub.earthobservations.org/doc"
                  className="text-sm hover:text-gray-300"
                >
                  About
                </Link>
              </div>

              {/* Communication */}
              <div className="flex flex-col">
                <h4 className="mb-3 text-lg font-semibold">Communication</h4>
                <Link
                  href="https://www.linkedin.com/company/geo-knowledge-hub"
                  className="text-sm hover:text-gray-300"
                >
                  LinkedIn
                </Link>
                <Link
                  href="https://gkhub.earthobservations.org/feed/"
                  className="text-sm hover:text-gray-300"
                >
                  Feed
                </Link>
              </div>

              {/* Help */}
              <div className="flex flex-col">
                <h4 className="mb-3 text-lg font-semibold">Help</h4>
                <Link
                  href="https://gkhub.earthobservations.org/doc/docs/why"
                  className="text-sm hover:text-gray-300"
                >
                  FAQ
                </Link>
                <Link href="https://discord.gg/wfPQHWNRkV" className="text-sm hover:text-gray-300">
                  Forum
                </Link>
                <Link
                  href="https://gkhub.earthobservations.org/doc/docs/introduction/"
                  className="text-sm hover:text-gray-300"
                >
                  Documentation
                </Link>
              </div>

              {/* Developers */}
              <div className="flex flex-col">
                <h4 className="mb-3 text-lg font-semibold">Developers</h4>
                <Link
                  href="https://github.com/geo-knowledge-hub"
                  className="text-sm hover:text-gray-300"
                >
                  GitHub
                </Link>
                <Link
                  href="https://gkhub.earthobservations.org/doc/development/introduction"
                  className="text-sm hover:text-gray-300"
                >
                  REST API
                </Link>
              </div>
            </div>

            {/* Footer Logo */}
            <div className="flex flex-col items-center lg:items-end">
              <h4 className="mb-3 text-lg font-semibold">Brought to you by</h4>
              <Link href="https://earthobservations.org/">
                <Image src={logoGEO} alt="GEO Logo" width={210} height={80} priority />
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default Layout;
