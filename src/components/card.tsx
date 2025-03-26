/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { StaticImageData } from 'next/image';

interface FeatureCardProps {
  image: StaticImageData | string;
  imageAlt: string;
  title: string;
  href?: string;
  external?: boolean;
  imageClass?: string;
}

interface CallToActionCardProps {
  title: string;
  subtitle?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  illustration?: string;
  illustrationAlt?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  imageAlt,
  title,
  href,
  external = false,
  imageClass = 'mb-6 h-28 w-28',
}) => {
  const content = (
    <div className="flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-xl bg-white p-8 shadow-sm transition hover:shadow-md">
      <div className={imageClass}>
        <Image src={image} alt={imageAlt} className="h-full w-full object-contain" />
      </div>
      <h3 className="flex items-center gap-2 text-center text-sm font-semibold text-gray-900">
        {title}
      </h3>
    </div>
  );

  // Define base content
  let hrefContent = content;

  // If ``href`` and ``external``, use ``a``
  if (href && external) {
    hrefContent = (
      <a href={href} target="_blank" rel="noopener noreferrer" className="h-full">
        {content}
      </a>
    );
  } else if (href) {
    // Otherwise, use next navigation link
    hrefContent = (
      <Link href={href} className="h-full">
        {content}
      </Link>
    );
  }

  return hrefContent;
};

export const CallToActionCard: React.FC<CallToActionCardProps> = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  illustration,
  illustrationAlt,
}) => {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-between rounded-xl bg-white p-8 shadow-sm transition hover:shadow-md`}
    >
      <div className="grid w-full items-center gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          {subtitle && (
            <span className="text-sm font-semibold text-pink-500 uppercase">{subtitle}</span>
          )}
          <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-2xl">{title}</h2>
          <p className="mt-4 text-gray-700">{description}</p>
          <a
            href={buttonLink}
            className="mt-6 inline-block rounded-full bg-gray-900 px-6 py-3 text-white shadow-lg transition hover:bg-gray-800"
          >
            {buttonText}
          </a>
        </div>
        <div className="flex items-center justify-end">
          {illustration && (
            <Image
              src={illustration}
              alt={illustrationAlt || ''}
              width={320}
              height={320}
              className="object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};
