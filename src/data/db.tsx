/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import data from '@data/content/resources';

import _map from 'lodash/map';
import _flatten from 'lodash/flatten';
import _entries from 'lodash/entries';
import _uniqBy from 'lodash/uniqBy';
import _set from 'lodash/set';

const initDatabase = () => {
  // Organize the database to facilitate indexing / search
  _map(_entries(data.countries), ([, countryData]) => {
    // Get all challenges
    const countryChallenges = _uniqBy(
      _flatten(
        _map(countryData.resources, (resource) => {
          if (!resource?.challenges) {
            return [];
          }

          return resource.challenges;
        }),
      ),
      'id',
    );

    // Get all GEO Focus Areas (by challenge)
    const countryFocusAreas = _uniqBy(
      _flatten(
        _map(countryChallenges, (challenge) => {
          if (!challenge?.tags) {
            return [];
          }

          return challenge.tags;
        }),
      ),
      'id',
    );

    // Update country object
    _set(countryData, 'focusAreas', countryFocusAreas);
    _set(countryData, 'challenges', countryChallenges);
  });

  return data;
};

export const initResourcesDatabase = () => {
  const data = initDatabase();

  const resources = _map(_entries(data.countries), ([, countryData]) => {
    return _map(countryData.resources, (resource) => {
      resource['country'] = countryData.title;

      return resource;
    });
  });

  return _map(_flatten(resources), (resource, index) => {
    resource['id'] = index;
    return resource;
  });
};

export default initDatabase();
