/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { getAllCountries } from '@lib/typesense';
import { HomePageContent } from './content';

/**
 * HomePage Component - Server component that fetches countries and renders the home page.
 *
 * @component
 * @returns {Promise<JSX.Element>} The rendered HomePage component.
 */
export default async function HomePage() {
  // Fetch all countries server-side
  const countries = await getAllCountries();

  return <HomePageContent initialCountries={countries} />;
}
