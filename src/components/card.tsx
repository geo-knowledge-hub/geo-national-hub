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

import { getAssetPath } from '@lib/utils';

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
  buttonLinkTarget?: string;
  illustration?: StaticImageData | string;
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
    <div className="glass-card group flex h-full w-full cursor-pointer flex-col items-center justify-between p-8">
      <div className={imageClass}>
        <Image
          src={typeof image === 'string' ? getAssetPath(image) : image}
          alt={imageAlt}
          width={112}
          height={112}
          className="h-full w-full object-contain"
        />
      </div>
      <h3 className="themed-link flex items-center gap-2 text-center text-sm font-semibold text-gray-900 transition-colors">
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
  buttonLinkTarget,
  illustration,
  illustrationAlt,
}) => {
  return (
    <div className="glass-card flex h-full w-full flex-col items-center justify-between p-8">
      <div className="grid w-full items-center gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          {subtitle && (
            <span className="themed-title text-sm font-semibold uppercase">{subtitle}</span>
          )}
          <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-2xl">{title}</h2>
          <p className="mt-4 text-gray-700">{description}</p>
          <a
            href={buttonLink}
            target={buttonLinkTarget}
            className="themed-bg mt-6 inline-block rounded-xl px-6 py-3 text-white shadow-md transition hover:opacity-90"
          >
            {buttonText}
          </a>
        </div>
        <div className="flex items-center justify-end">
          {illustration && (
            <Image
              src={typeof illustration === 'string' ? getAssetPath(illustration) : illustration}
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
