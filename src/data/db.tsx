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

import iconAcademic from '@public/content/resources/academic.svg';
import iconUsers from '@public/content/resources/user-story.svg';

import { Resource } from '@data/content/resources';

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

  // Initialize resources data (from all countries)
  const resources: Resource[][] = _map(_entries(data.countries), ([, countryData]) => {
    // This definition is provisional until we transfer content to a proper database.
    const countryCapacityBuildingActivities = _map(
      countryData.capacityBuildingActivities,
      (activity) => {
        return {
          id: crypto.randomUUID(),
          title: activity['title'],
          description: activity['description'],
          country: countryData.title,
          type: 'Training material',
          icon: iconAcademic,
          uploaded: 'April 1, 2025',
          challenges: [],
          extras: ['Capacity building Activity'],
        };
      },
    );

    // Initialize country community of practice data
    let communityOfPractice: Resource[] = [];

    if (countryData?.communityOfPractice?.name) {
      // This definition is provisional until we transfer content to a proper database.
      communityOfPractice = [
        {
          id: crypto.randomUUID(),
          title: countryData.communityOfPractice.name,
          description: countryData.communityOfPractice.description,
          icon: iconUsers,
          type: 'Community Activity',
          uploaded: 'April 3, 2025',
          challenges: [],
          link: countryData.communityOfPractice.link,
          country: countryData.title,
          extras: ['Capacity building Activity', 'Community of Practice'],
        },
      ];
    }

    // Initialize country resources data
    const countryResources: Resource[] = _map(countryData.resources, (resource) => {
      return {
        ...resource,
        id: crypto.randomUUID(),
        country: countryData.title,
      };
    });

    // @ts-expect-error `_flatten` is applied to avoid shape error
    return _flatten([countryResources, communityOfPractice, countryCapacityBuildingActivities]);
  });

  return _flatten(resources);
};

export default initDatabase();
