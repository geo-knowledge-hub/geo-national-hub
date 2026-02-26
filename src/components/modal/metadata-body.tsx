/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import { ExternalLink } from 'lucide-react';

import type { MetadataFields, GkhRelatedIdentifier } from './types';
import { resolveI18n, addBlankTargetToLinks } from './utils';
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
 * Related works component.
 *
 * @component
 * @param {RelatedWorksProps} props - The properties for the ``RelatedWorks`` component.
 * @returns {JSX.Element} The rendered ``RelatedWorks`` component.
 *
 */
function RelatedWorks({ items }: { items: GkhRelatedIdentifier[] }) {
  // If there are no items, return null
  if (items.length === 0) {
    return null;
  }

  // Render!
  return (
    <section>
      <SectionTitle>Related Works ({items.length})</SectionTitle>

      <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
        {items.map((rel, i) => {
          // Get the href
          const href =
            rel.scheme === 'doi'
              ? `https://doi.org/${rel.identifier}`
              : rel.identifier.startsWith('http')
                ? rel.identifier
                : undefined;

          // Get the relation label
          const relationLabel = rel.relation_type
            ? resolveI18n(rel.relation_type.title)
            : undefined;

          // Render the inner content
          const inner = (
            <div className="flex min-w-0 items-center gap-3">
              <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="min-w-0 flex-1 truncate text-sm">{rel.title ?? rel.identifier}</span>

              {relationLabel && (
                <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                  {relationLabel}
                </span>
              )}

              {rel.scheme === 'doi' && (
                <span className="shrink-0 rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-bold text-yellow-800">
                  DOI
                </span>
              )}
            </div>
          );

          const rowClass = `px-4 py-2.5 ${i > 0 ? 'border-t border-gray-100' : ''}`;

          // Render the row
          return href ? (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block transition hover:bg-gray-50 ${rowClass}`}
            >
              {inner}
            </a>
          ) : (
            <div key={i} className={rowClass}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Metadata body component
 *
 * @param fields - Metadata fields.
 * @param children - Children to display inside the metadata body (e.g. ResourceBrowser).
 * @returns Metadata body element.
 *
 * @component
 */
export function MetadataBody({
  fields,
  children,
}: {
  fields: MetadataFields;
  children?: React.ReactNode;
}) {
  // Data - Detail items
  const detailItems: { label: string; value: string }[] = [];

  // Publisher
  if (fields.publisher) {
    detailItems.push({ label: 'Publisher', value: fields.publisher });
  }

  // Resource type
  if (fields.resourceTypeTitle) {
    detailItems.push({ label: 'Resource Type', value: fields.resourceTypeTitle });
  }

  // Languages
  if (fields.languages.length > 0) {
    const languageNames = fields.languages
      .map((l) => resolveI18n(l.title))
      .filter(Boolean)
      .join(', ');

    if (languageNames) {
      detailItems.push({ label: 'Languages', value: languageNames });
    }
  }

  // Render!
  return (
    <div className="space-y-6">
      {/* Description */}
      {fields.description && (
        <section>
          <SectionTitle>Description</SectionTitle>
          <div
            className="text-sm leading-relaxed text-gray-700 [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800 [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-gray-900 [&_li]:ml-4 [&_li]:list-disc [&_ol]:my-2 [&_ol]:space-y-1 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:space-y-1"
            dangerouslySetInnerHTML={{ __html: addBlankTargetToLinks(fields.description) }}
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
      {fields.targetAudiences.length > 0 && (
        <section>
          <SectionTitle>Target Audience</SectionTitle>
          <TagList
            items={fields.targetAudiences
              .map((a) => resolveI18n(a.title))
              .filter((s): s is string => !!s)}
          />
        </section>
      )}

      {/* Keywords */}
      {fields.subjects.length > 0 && (
        <section>
          <SectionTitle>Keywords</SectionTitle>
          <TagList items={fields.subjects.map((s) => s.subject)} />
        </section>
      )}

      {/* GEO Theme */}
      {fields.engagementPriorities.length > 0 && (
        <section>
          <SectionTitle>GEO Theme</SectionTitle>
          <div className="space-y-1">
            {fields.engagementPriorities.map((ep, i) => (
              <p key={i} className="text-sm text-gray-700">
                {resolveI18n(ep.title)}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* GEO Work Programme Activity */}
      {fields.gwpActivity && (
        <section>
          <SectionTitle>GEO Work Programme Activity</SectionTitle>
          <p className="text-sm text-gray-700">{resolveI18n(fields.gwpActivity.title)}</p>
        </section>
      )}

      {/* Rights */}
      {fields.rights.length > 0 && (
        <section>
          <SectionTitle>Rights</SectionTitle>
          <div className="space-y-2">
            {fields.rights.map((r, i) => (
              <div key={i}>
                {r.props?.url ? (
                  <a
                    href={r.props.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {resolveI18n(r.title)}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-gray-900">{resolveI18n(r.title)}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Works */}
      {fields.relatedIdentifiers && <RelatedWorks items={fields.relatedIdentifiers} />}
    </div>
  );
}
