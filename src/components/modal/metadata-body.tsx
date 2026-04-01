/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import type { Resource } from '@content-types/content';
import { addBlankTargetToLinks } from './utils';
import { TagList } from './tag-list';

/**
 * Section heading style for all metadata sections.
 */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold tracking-widest text-gray-500 uppercase">
      {children}
    </h3>
  );
}

/**
 * Metadata body component.
 *
 * Renders description, details grid, target audiences, keywords,
 * engagement priorities, GWP activity, and rights.
 *
 * @param resource - The resource to display.
 * @param children - Optional children (e.g. future ResourceBrowser).
 *
 * @component
 */
export function MetadataBody({
  resource,
  children,
}: {
  resource: Resource;
  children?: React.ReactNode;
}) {
  // Detail items grid
  const detailItems: { label: string; value: string }[] = [];

  if (resource.publisher) {
    detailItems.push({ label: 'Publisher', value: resource.publisher });
  }

  if (resource.resource_type?.name) {
    detailItems.push({ label: 'Resource Type', value: resource.resource_type.name });
  }

  return (
    <div className="space-y-6">
      {/* Description */}
      {resource.description && (
        <section>
          <SectionTitle>Description</SectionTitle>
          <div
            className="text-sm leading-relaxed text-gray-700 [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800 [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-gray-900 [&_li]:ml-4 [&_li]:list-disc [&_ol]:my-2 [&_ol]:space-y-1 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:space-y-1"
            dangerouslySetInnerHTML={{ __html: addBlankTargetToLinks(resource.description) }}
          />
        </section>
      )}

      {/* Children (e.g. ResourceBrowser for packages) */}
      {children}

      {/* Details */}
      {detailItems.length > 0 && (
        <section>
          <SectionTitle>Details</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {detailItems.map((item, i) => (
              <div
                key={i}
                className={`rounded-lg bg-gray-50 px-3 py-2 ${
                  detailItems.length % 2 !== 0 && i === detailItems.length - 1 ? 'col-span-2' : ''
                }`}
              >
                <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase">
                  {item.label}
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Target Audience */}
      {(resource.target_audiences ?? []).length > 0 && (
        <section>
          <SectionTitle>Target Audience</SectionTitle>
          <TagList items={resource.target_audiences!.map((ta) => ta.name)} />
        </section>
      )}

      {/* Keywords */}
      {(resource.subjects ?? []).length > 0 && (
        <section>
          <SectionTitle>Keywords</SectionTitle>
          <TagList items={resource.subjects!} />
        </section>
      )}

      {/* Engagement Priorities */}
      {(resource.engagement_priorities ?? []).length > 0 && (
        <section>
          <SectionTitle>GEO Theme</SectionTitle>
          <div className="space-y-1">
            {resource.engagement_priorities!.map((ep, i) => (
              <p key={i} className="text-sm text-gray-700">
                {ep.name}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* GEO Work Programme Activity */}
      {resource.geo_work_programme_activity && (
        <section>
          <SectionTitle>GEO Work Programme Activity</SectionTitle>
          <p className="text-sm text-gray-700">{resource.geo_work_programme_activity.name}</p>
        </section>
      )}

      {/* Rights */}
      {(resource.rights ?? []).length > 0 && (
        <section>
          <SectionTitle>Rights</SectionTitle>
          <div className="space-y-2">
            {resource.rights!.map((r, i) => (
              <div key={i}>
                {r.link ? (
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {r.title?.en || r.id}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-gray-900">{r.title?.en || r.id}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
