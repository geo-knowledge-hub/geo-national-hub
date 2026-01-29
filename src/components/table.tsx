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

import type { Representative } from '@content-types/content';
import { getAssetPath } from '@lib/utils';

interface RepresentativesTableProps {
  members: Representative[];
}

export const RepresentativesTable: React.FC<RepresentativesTableProps> = ({ members }) => {
  return (
    <div className="glass-card overflow-hidden">
      <div className={`overflow-y-auto`} style={{ maxHeight: '450px' }}>
        <table className="w-full table-auto">
          <thead className="sticky top-0 z-10 bg-gray-50/95 shadow-sm">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Profile</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index} className="border-t border-gray-100 transition hover:bg-gray-50/80">
                <td className="flex items-center gap-4 px-6 py-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={getAssetPath(member.avatar)}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-gray-900">{member.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.role}</td>
                <td className="px-6 py-4">
                  <a
                    href={`${member.profile}`}
                    target={'_blank'}
                    className="glass-button inline-block rounded-xl px-4 py-1.5 text-sm"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
