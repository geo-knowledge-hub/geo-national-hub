/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import logoGKH from '@public/images/logo-blue.svg';
import db from '@data/db';

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
  const [showInfo, setShowInfo] = useState(false);

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="pointer-events-none fixed inset-0 h-full w-screen" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:py-20" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left side  */}
          <div className="relative z-10 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span>GEO Knowledge Hub Platform</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-bold tracking-tight">
                <span
                  className="mt-2 block text-5xl md:text-3xl lg:text-4xl"
                  style={{ color: '#526479' }}
                >
                  National
                </span>
                <span
                  className="block text-5xl md:text-3xl lg:text-4xl"
                  style={{ color: '#526479' }}
                >
                  GEO Knowledge Hub
                </span>
              </h1>
              <p className="text-xl text-gray-600 md:text-2xl lg:max-w-2xl">
                Discover EO applications and solutions tailored for your country.
              </p>
            </div>

            {/* CTA Links */}
            <div className="flex flex-wrap gap-3">
              <a
                href={'https://gkhub.earthobservations.org/'}
                target={'_blank'}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
              >
                <Image src={logoGKH} alt="Global GKH icon" className="h-4 w-4" />
                Global GKH
              </a>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Learn more
              </button>
            </div>
          </div>

          {/* Right side */}
          <div className="relative hidden items-center justify-center lg:flex">
            <div className="relative h-[500px] w-full max-w-lg">
              <svg
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 500 500"
                preserveAspectRatio="xMidYMid meet"
              >
                <g transform="translate(350, 250)">
                  {(() => {
                    // Positions
                    const positions = [
                      { x: -200, y: -140 }, // Above Global (slightly left)
                      { x: -220, y: 0 }, // Center/level with Global (more left)
                      { x: -200, y: 140 }, // Below Global (slightly left)
                      { x: 0, y: -190 }, // On top of Global
                      { x: -20, y: 230 }, // On bottom of Global (slightly left, more distant to avoid label overlap)
                    ];

                    return (
                      <>
                        {positions.map((pos, index) => {
                          // Calculate control point for curve
                          const controlX = pos.x * 0.5;
                          const controlY = pos.y * 0.5;

                          // Add perpendicular offset for smooth curve effect
                          const offsetX = pos.y * 0.2;
                          const offsetY = -pos.x * 0.2;

                          return (
                            <path
                              key={`line-${index}`}
                              d={`M ${pos.x} ${pos.y} Q ${controlX + offsetX} ${controlY + offsetY} 0 0`}
                              stroke="#cbd5e1"
                              strokeWidth="1.5"
                              strokeOpacity="0.4"
                              fill="none"
                              className="animate-pulse-line"
                              style={{
                                animationDelay: `${index * 0.2}s`,
                              }}
                            />
                          );
                        })}

                        {positions.map((pos, index) => (
                          <g key={`national-${index}`} transform={`translate(${pos.x}, ${pos.y})`}>
                            <foreignObject x="-50" y="-50" width="100" height="100">
                              <div className="relative flex h-20 w-20 items-center justify-center rounded-xl bg-white/90 p-4 ring-1 ring-gray-200/50 backdrop-blur-sm">
                                <Image
                                  src={logoGKH}
                                  alt={`National Hub ${index + 1}`}
                                  width={100}
                                  height={100}
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            </foreignObject>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </g>
              </svg>

              {/* National Hub labels */}
              {(() => {
                const positions = [
                  { x: -200, y: -140 },
                  { x: -220, y: 0 },
                  { x: -200, y: 140 },
                  { x: 0, y: -190 },
                  { x: -20, y: 230 },
                ];

                return positions.map((pos, index) => {
                  const iconX = 345 + pos.x;
                  const iconY = 250 + pos.y;
                  const labelY = iconY + 29;

                  const xPercent = (iconX / 500) * 98;
                  const yPercent = (labelY / 500) * 100;

                  return (
                    <div
                      key={`label-${index}`}
                      className="absolute z-10"
                      style={{
                        left: `${xPercent}%`,
                        top: `${yPercent}%`,
                        transform: 'translate(-50%, 0)',
                      }}
                    >
                      <span className="px-1 py-1 text-xs font-medium whitespace-nowrap text-gray-600">
                        National Hub
                      </span>
                    </div>
                  );
                });
              })()}

              <div className="absolute top-1/2 right-0 z-10 -translate-y-1/2">
                <div className="relative">
                  <div className="animate-pulse-glow absolute inset-0 rounded-2xl bg-blue-200/40"></div>
                  <div className="relative rounded-2xl bg-white/90 p-8 shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-sm">
                    <Image src={logoGKH} alt="Global GKH logo" width={180} height={180} />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm">
                      Global GKH
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learn more */}
        {showInfo && (
          <div className="animate-fade-in relative z-10 mx-auto mt-12 max-w-4xl">
            <div className="rounded-2xl bg-white/95 p-10 shadow-xl ring-1 ring-gray-200/50 backdrop-blur-sm">
              <div className="space-y-8">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    What is the National GEO Knowledge Hub?
                  </h3>
                  <button
                    onClick={() => setShowInfo(false)}
                    className="text-gray-400 transition-colors hover:text-gray-600"
                    aria-label="Close info"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-md space-y-6 text-base leading-relaxed text-gray-600">
                  <p>
                    The National GEO Knowledge Hub (GKH) empowers National GEOs to deploy and manage
                    national-level digital platforms built on the GEO Knowledge Hub infrastructure.
                    Each National GKH provides full national ownership, allowing countries to
                    configure the platform to reflect their specific environmental priorities,
                    policy needs, and research agendas.
                  </p>
                  <p>
                    Although each National GKH is independently managed and customized, it operates
                    on the shared GEO Knowledge Hub infrastructure. This guarantees consistent
                    standards for data stewardship, including long-term preservation,
                    interoperability, and global discoverability of published resources.
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="mb-6 text-lg font-semibold text-gray-900">Key Features</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-5 transition-all hover:border-[#526479] hover:bg-gray-100/50">
                      <div
                        className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: '#5264791a' }}
                      >
                        <svg
                          className="h-6 w-6"
                          style={{ color: '#526479' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <h5 className="mb-2 font-semibold text-gray-900">National Ownership</h5>
                      <p className="text-sm leading-relaxed text-gray-600">
                        Full National GEO control over governance, configuration, and published
                        content.
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-5 transition-all hover:border-[#526479] hover:bg-gray-100/50">
                      <div
                        className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: '#5264791a' }}
                      >
                        <svg
                          className="h-6 w-6"
                          style={{ color: '#526479' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          />
                        </svg>
                      </div>
                      <h5 className="mb-2 font-semibold text-gray-900">Customizable Content</h5>
                      <p className="text-sm leading-relaxed text-gray-600">
                        Ability to highlight national datasets, tools, and services.
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-5 transition-all hover:border-[#526479] hover:bg-gray-100/50">
                      <div
                        className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: '#5264791a' }}
                      >
                        <svg
                          className="h-6 w-6"
                          style={{ color: '#526479' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <h5 className="mb-2 font-semibold text-gray-900">Trusted Infrastructure</h5>
                      <p className="text-sm leading-relaxed text-gray-600">
                        Built on GEO Knowledge Hub services for preservation and global
                        discoverability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Explore content */}
        <div className="relative z-10 mt-20 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium tracking-wider text-gray-500 uppercase">
              Explore Content
            </span>
            <button
              onClick={() => {
                const searchSection = document.querySelector('.search-section');

                if (searchSection) {
                  searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  window.scrollTo({
                    top: window.innerHeight * 0.9,
                    behavior: 'smooth',
                  });
                }
              }}
              className="text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Scroll to search"
            >
              <svg
                className="animate-bounce-slow h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="search-section relative z-10 mt-32 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <div className="hover:shadow-3xl relative rounded-2xl bg-white/95 p-1.5 shadow-2xl ring-2 ring-gray-200/60 backdrop-blur-md transition-all hover:ring-[#526479]/40">
              <input
                type="text"
                id="search-input"
                className="text-md block w-full rounded-xl border-0 bg-transparent p-4 pr-10 pl-4 font-medium text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                placeholder="Search for a country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
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
