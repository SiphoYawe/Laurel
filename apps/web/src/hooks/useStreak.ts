"use client";

import { useMemo } from "react";

import { trpc } from "@/lib/trpc/client";

/**
 * useStreak - Hook for accessing streak data with calculated info
 * Story 3-2: Streak Tracking and Display
 */

// Milestone thresholds
const STREAK_MILESTONES = [7, 14, 30, 66, 100, 180, 365] as const;

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  isAtRisk: boolean;
  nextMilestone: number;
  daysToMilestone: number;
  progress: number;
  isMilestone: boolean;
}

function getNextMilestone(currentStreak: number): number {
  for (const milestone of STREAK_MILESTONES) {
    if (currentStreak < milestone) {
      return milestone;
    }
  }
  // After 365, add 365-day milestones
  return Math.ceil((currentStreak + 1) / 365) * 365;
}

function getPreviousMilestone(currentStreak: number): number {
  let prev = 0;
  for (const milestone of STREAK_MILESTONES) {
    if (currentStreak < milestone) {
      return prev;
    }
    prev = milestone;
  }
  return prev;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date1, yesterday);
}

/**
 * Calculate streak info from raw data
 */
export function calculateStreakInfo(
  currentStreak: number,
  longestStreak: number,
  lastCompletedDate: string | null,
  completedToday: boolean
): StreakInfo {
  const today = new Date();
  const nextMilestone = getNextMilestone(currentStreak);
  const prevMilestone = getPreviousMilestone(currentStreak);
  const daysToMilestone = nextMilestone - currentStreak;
  const range = nextMilestone - prevMilestone;
  const progress = range > 0 ? (currentStreak - prevMilestone) / range : 1;

  // Determine if streak is at risk
  // At risk if: has a streak > 0, not completed today
  let isAtRisk = false;
  if (currentStreak > 0 && !completedToday && lastCompletedDate) {
    const lastDate = new Date(lastCompletedDate);
    // At risk if last completion was yesterday (streak would break tomorrow)
    isAtRisk = isYesterday(lastDate, today);
  }

  // Check if current streak is a milestone
  const isMilestone = STREAK_MILESTONES.includes(
    currentStreak as (typeof STREAK_MILESTONES)[number]
  );

  return {
    currentStreak,
    longestStreak,
    lastCompletedDate,
    isAtRisk,
    nextMilestone,
    daysToMilestone,
    progress,
    isMilestone,
  };
}

/**
 * Hook to get streak data for a specific habit
 */
export function useHabitStreak(habitId: string) {
  const {
    data: habit,
    isLoading,
    error,
  } = trpc.habits.getById.useQuery({ id: habitId }, { enabled: !!habitId });

  const streakInfo = useMemo(() => {
    if (!habit) return null;

    const streak = habit.streak || {
      current_streak: 0,
      longest_streak: 0,
      last_completed_date: null,
    };

    return calculateStreakInfo(
      streak.current_streak,
      streak.longest_streak,
      streak.last_completed_date,
      habit.isCompletedToday
    );
  }, [habit]);

  return {
    streakInfo,
    isLoading,
    error,
    habit,
  };
}

/**
 * Hook to get aggregate streak stats across all habits
 */
export function useOverallStreak() {
  const { data: habits, isLoading, error } = trpc.habits.list.useQuery();

  const stats = useMemo(() => {
    if (!habits || habits.length === 0) {
      return {
        totalActiveStreaks: 0,
        longestCurrentStreak: 0,
        longestEverStreak: 0,
        habitsAtRisk: 0,
        habitsCompletedToday: 0,
        totalHabits: 0,
      };
    }

    let longestCurrentStreak = 0;
    let longestEverStreak = 0;
    let habitsAtRisk = 0;
    let habitsCompletedToday = 0;
    let totalActiveStreaks = 0;

    for (const habit of habits) {
      const streak = habit.streak || {
        current_streak: 0,
        longest_streak: 0,
        last_completed_date: null,
      };

      if (streak.current_streak > 0) {
        totalActiveStreaks++;
      }

      if (streak.current_streak > longestCurrentStreak) {
        longestCurrentStreak = streak.current_streak;
      }

      if (streak.longest_streak > longestEverStreak) {
        longestEverStreak = streak.longest_streak;
      }

      if (habit.isCompletedToday) {
        habitsCompletedToday++;
      } else if (streak.current_streak > 0) {
        // Check if at risk
        const info = calculateStreakInfo(
          streak.current_streak,
          streak.longest_streak,
          streak.last_completed_date,
          false
        );
        if (info.isAtRisk) {
          habitsAtRisk++;
        }
      }
    }

    return {
      totalActiveStreaks,
      longestCurrentStreak,
      longestEverStreak,
      habitsAtRisk,
      habitsCompletedToday,
      totalHabits: habits.length,
    };
  }, [habits]);

  return {
    stats,
    habits,
    isLoading,
    error,
  };
}

/**
 * Get milestone info
 */
export function getMilestoneInfo(streak: number): {
  name: string;
  emoji: string;
  badge: string;
} | null {
  const milestoneMap: Record<number, { name: string; emoji: string; badge: string }> = {
    7: { name: "Week Warrior", emoji: "🥉", badge: "week-warrior" },
    14: { name: "Fortnight Fighter", emoji: "🥈", badge: "fortnight-fighter" },
    30: { name: "Monthly Master", emoji: "🥇", badge: "monthly-master" },
    66: { name: "Habit Hero", emoji: "👑", badge: "habit-hero" },
    100: { name: "Century Champion", emoji: "💎", badge: "century-champion" },
    180: { name: "Half-Year Hero", emoji: "🏆", badge: "half-year-hero" },
    365: { name: "Annual Champion", emoji: "🌟", badge: "annual-champion" },
  };

  return milestoneMap[streak] || null;
}
