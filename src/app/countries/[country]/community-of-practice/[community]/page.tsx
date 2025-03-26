/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use client';

import React, { JSX, use } from 'react';

import Image from 'next/image';

import toolDiscordIcon from '@public/content/tools/discord.svg';
import toolForumIcon from '@public/content/tools/forum.svg';

import db from '@data/db';
import { Country } from '@data/content/resources';

import {
  ActivityCard,
  DocumentCard,
  EngagementBlock,
  CoPRepresentativesSection,
} from './components';

import { BackButton } from '@components/global';

/**
 * Community of practice page props
 */
interface CommunityOfPracticePageProps {
  params: Promise<{ id: string; country: string }>;
}

/**
 * ResourcePage Component
 *
 * @component
 * @param {CommunityOfPracticePageProps} props - Component props.
 * @returns {JSX.Element} The rendered CommunityOfPracticePage component.
 */
const CommunityOfPracticePage: React.FC<CommunityOfPracticePageProps> = ({
  params,
}: CommunityOfPracticePageProps): JSX.Element => {
  // Get country data.
  const { country } = use(params);
  const countryData: Country = db.countries[country];

  // Get community of practice metadata (assuming for this example, one CoP)
  const communityOfPractice = countryData.communityOfPractice[0];

  // Get representatives
  const representatives = communityOfPractice.representatives;

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-20">
          <BackButton />
        </div>

        {/* Goal (Hero block) */}
        <section className="mb-20">
          <div className="grid items-center gap-10 md:grid-cols-[2fr_1fr]">
            <div>
              <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">
                {communityOfPractice.name}
              </h1>
              <p className="mb-6 text-lg text-gray-600">{communityOfPractice.description}</p>
            </div>
            <div className="hidden justify-center md:flex">
              <Image src={communityOfPractice.logo} alt="CoP logo" width={250} height={250} />
            </div>
          </div>
        </section>

        {/* Activities */}
        <section className="mb-20">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Activities</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <ActivityCard
              title="Monthly Webinars"
              description="Join regular webinars to explore new methodologies and community updates."
            />
            <ActivityCard
              title="Working Groups"
              description="Participate in focused groups tackling specific challenges and projects."
            />
            <ActivityCard
              title="Capacity Building"
              description="Collaborate on training programs and educational initiatives."
            />
          </div>
        </section>

        {/* Documents */}
        <section className="mb-20">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Documents and Meeting Notes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <DocumentCard
              title="Meeting Notes - March 2025"
              description="Summary and key takeaways from the March CoP meeting."
              date="March 15, 2024"
              link="#"
            />
            <DocumentCard
              title="Knowledge Sharing Webinar"
              description="Community-driven examples of applied solutions and case studies."
              date="February 28, 2025"
              link="#"
            />
          </div>
        </section>

        {/* Engagement Opportunities */}
        <section className="mb-20">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Engagement tools</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <EngagementBlock
              title="Join our Discord"
              description="Be part of real-time discussions, Q&As, and networking."
              buttonLabel="Join Discord"
              buttonLink="#"
              imageSrc={toolDiscordIcon}
            />
            <EngagementBlock
              title="Visit the Community Forum"
              description="Ask questions, share ideas, and collaborate on community projects."
              buttonLabel="Go to Forum"
              buttonLink="#"
              imageSrc={toolForumIcon}
            />
          </div>
        </section>

        {/* Community of practice contacts */}
        <CoPRepresentativesSection
          communityName={communityOfPractice.name}
          representatives={representatives}
        />
      </div>
    </div>
  );
};

export default CommunityOfPracticePage;
