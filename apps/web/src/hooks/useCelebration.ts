"use client";

import { useCallback } from "react";

import {
  useCelebrationQueue,
  createCompletionCelebration,
  createDailyCompleteCelebration,
  createMilestoneCelebration,
  createBadgeCelebration,
  createLevelUpCelebration,
} from "@/lib/celebration-queue";

/**
 * useCelebration - Hook for triggering celebrations
 * Story 3-5: Micro-Wins Celebration System
 */

export function useCelebration() {
  const { addCelebration, clearQueue, currentCelebration, isShowing } = useCelebrationQueue();

  /**
   * Celebrate completing a habit
   */
  const celebrateCompletion = useCallback(
    (habitName: string, xpEarned: number = 10) => {
      addCelebration(createCompletionCelebration(habitName, xpEarned));
    },
    [addCelebration]
  );

  /**
   * Celebrate completing all daily habits
   */
  const celebrateDailyComplete = useCallback(
    (totalHabits: number) => {
      addCelebration(createDailyCompleteCelebration(totalHabits));
    },
    [addCelebration]
  );

  /**
   * Celebrate a streak milestone
   */
  const celebrateMilestone = useCallback(
    (streakDays: number, badgeName: string, badgeEmoji: string) => {
      addCelebration(createMilestoneCelebration(streakDays, badgeName, badgeEmoji));
    },
    [addCelebration]
  );

  /**
   * Celebrate earning a badge
   */
  const celebrateBadge = useCallback(
    (badgeId: string, badgeName: string, badgeEmoji: string) => {
      addCelebration(createBadgeCelebration(badgeId, badgeName, badgeEmoji));
    },
    [addCelebration]
  );

  /**
   * Celebrate leveling up
   */
  const celebrateLevelUp = useCallback(
    (newLevel: number, levelName: string) => {
      addCelebration(createLevelUpCelebration(newLevel, levelName));
    },
    [addCelebration]
  );

  return {
    // Actions
    celebrateCompletion,
    celebrateDailyComplete,
    celebrateMilestone,
    celebrateBadge,
    celebrateLevelUp,
    clearQueue,

    // State
    currentCelebration,
    isShowing,
  };
}
