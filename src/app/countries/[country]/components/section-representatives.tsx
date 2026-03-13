/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

import { Button } from '@ui/button';
import { Card, CardContent } from '@ui/card';

import { getAssetPath } from '@lib/utils';
import type { Country } from '@content-types/content';

/**
 * Properties expected for the KeyRepresentativesSection component.
 */
interface KeyRepresentativesSectionProps {
  countryData: Country;
}

/**
 * Key representative section component
 *
 * @component
 */
export function KeyRepresentativesSection({
  countryData,
}: KeyRepresentativesSectionProps): JSX.Element {
  const representatives = countryData.representatives || [];

  if (representatives.length === 0) {
    return <></>;
  }

  return (
    <section id="representatives" className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <h2 className="themed-title mb-2 text-3xl font-bold">Key representatives</h2>
          <p className="mb-4 text-gray-600">
            The representatives supporting the National GKH activities and collaboration.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {representatives.map((rep, index) => (
            <Card key={index} className="glass-card group border-0 shadow-none">
              <CardContent className="flex flex-col items-center p-5 text-center">
                {/* Avatar */}
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-gray-100 shadow-sm">
                  <Image
                    src={getAssetPath(rep.avatar)}
                    alt={rep.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="mt-3 text-sm font-bold text-gray-900">{rep.name}</h3>

                {/* Role */}
                <p className="mt-0.5 text-xs text-gray-500">{rep.role}</p>

                {/* Profile link */}
                {rep.profile && rep.profile !== '#' && (
                  <Button variant="ghost" size="sm" asChild className="mt-3 h-auto px-2 py-1">
                    <a
                      href={rep.profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="themed-title text-xs font-medium"
                    >
                      View profile
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
