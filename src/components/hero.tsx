/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import Image, { StaticImageData } from 'next/image';

import { HeroIcon } from '@data/content/geo';
import { BackButton } from './button';

interface HeroCountryProps {
  title: string;
  description: string;
  imageSrc?: string | StaticImageData;
  imageIcon?: HeroIcon;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageClass?: string;
}

interface HeroTopicProps {
  title: string;
  description: string;
  message?: string;
  imageSrc?: string | StaticImageData;
  imageIcon?: HeroIcon;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageClass?: string;
  ctaLabel?: string;
  ctaLink?: string;
  ctaMessage?: string;
  enableBackButton?: boolean;
}

export const HeroCountry: React.FC<HeroCountryProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  imageWidth = 300,
  imageHeight = 200,
  imageClass = 'h-full w-full object-fit',
}: HeroCountryProps) => {
  return (
    <section className="py-5">
      <div className="mb-10">
        <BackButton />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">{title}</h1>
          <p className="text-lg text-gray-600">{description}</p>
        </div>
        {imageSrc && imageAlt && (
          <div className="flex justify-end md:justify-center">
            <div className="h-40 w-64 overflow-hidden rounded-md shadow-md">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className={imageClass}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const HeroTopic: React.FC<HeroTopicProps> = ({
  title,
  description,
  imageSrc,
  imageIcon,
  imageAlt,
  imageWidth = 300,
  imageHeight = 200,
  imageClass = 'h-full w-full object-cover',
  ctaLabel,
  ctaLink,
  ctaMessage,
  enableBackButton = true,
}) => {
  // Components
  const ImageIcon = imageIcon;

  return (
    <section className="py-5">
      {enableBackButton && (
        <>
          {ctaLabel && ctaLink ? (
            <div className="mb-20">
              <BackButton />
            </div>
          ) : (
            <BackButton />
          )}
        </>
      )}

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">{title}</h1>
          <p className="text-2xl text-gray-600">{description}</p>
        </div>
        <div className="flex justify-end md:justify-center">
          {ctaLabel && ctaLink ? (
            <div className="flex flex-col flex-wrap space-y-2">
              <p>{ctaMessage}</p>

              <a
                href={ctaLink}
                className="inline-block rounded-full bg-gray-900 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-gray-800"
              >
                {ctaLabel}
              </a>
            </div>
          ) : imageIcon ? (
            // @ts-expect-error temporary solution
            <ImageIcon className="h-32 w-32 overflow-hidden rounded-md" />
          ) : imageSrc && imageAlt ? (
            <div className="h-64 w-64 overflow-hidden rounded-md md:h-48 md:w-72">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className={imageClass}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
