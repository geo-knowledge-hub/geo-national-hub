/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use server';

import { getFocusAreas, getChallenges, getChallenge, getChallengesByFocusArea } from '../queries';
import type { FocusArea, FocusAreaChallenge } from '@content-types/content';
import type { ActionResponse } from './types';

/**
 * Gets all focus areas
 */
export async function getFocusAreasAction(): Promise<ActionResponse<FocusArea[]>> {
  try {
    const focusAreas = await getFocusAreas();
    return { success: true, data: focusAreas };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch focus areas',
    };
  }
}

/**
 * Gets all challenges
 */
export async function getChallengesAction(): Promise<ActionResponse<FocusAreaChallenge[]>> {
  try {
    const challenges = await getChallenges();
    return { success: true, data: challenges };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch challenges',
    };
  }
}

/**
 * Gets a challenge by ID
 */
export async function getChallengeAction(id: string): Promise<ActionResponse<FocusAreaChallenge>> {
  try {
    const challenge = await getChallenge(id);
    if (!challenge) {
      return { success: false, error: `Challenge '${id}' not found` };
    }
    return { success: true, data: challenge };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch challenge',
    };
  }
}

/**
 * Gets challenges for a focus area
 */
export async function getChallengesByFocusAreaAction(
  focusAreaId: string,
): Promise<ActionResponse<FocusAreaChallenge[]>> {
  try {
    const challenges = await getChallengesByFocusArea(focusAreaId);
    return { success: true, data: challenges };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch challenges',
    };
  }
}
