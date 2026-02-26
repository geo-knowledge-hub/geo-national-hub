/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { JSX } from 'react';

/**
 * Sidebar section component.
 *
 * @param title - The title of the section.
 * @param children - The content of the section.
 * @returns Sidebar section element.
 *
 * @component
 */
export function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="border-t border-gray-100 pt-4">
      <h4 className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">{title}</h4>
      {children}
    </div>
  );
}
