"use client";

import { useCallback } from "react";

import { trpc } from "@/lib/trpc/client";

/**
 * useGamification - Hook for gamification state and actions
 * Story 4-2, 4-3, 4-4: XP, Levels, and Badges
 */

export function useGamification() {
  // Fetch user stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = trpc.gamification.getStats.useQuery();

  // Fetch badge definitions
  const { data: badgeDefinitions, isLoading: isLoadingBadges } =
    trpc.gamification.getBadgeDefinitions.useQuery();

  // Fetch user's earned badges
  const {
    data: userBadges,
    isLoading: isLoadingUserBadges,
    refetch: refetchUserBadges,
  } = trpc.gamification.getUserBadges.useQuery();

  // Fetch level progression
  const { data: levelProgression } = trpc.gamification.getLevelProgression.useQuery();

  // Mutations
  const awardXpMutation = trpc.gamification.awardXp.useMutation({
    onSuccess: () => {
      refetchStats();
    },
  });

  const awardBadgeMutation = trpc.gamification.awardBadge.useMutation({
    onSuccess: () => {
      refetchStats();
      refetchUserBadges();
    },
  });

  // Award XP for completing a habit
  const awardHabitXp = useCallback(
    async (habitId: string, streakDays: number) => {
      // Base XP for completion
      const baseXp = 10;

      // Streak bonus: +10% per day, max +100%
      const streakMultiplier = Math.min(1 + streakDays * 0.1, 2);
      const totalXp = Math.round(baseXp * streakMultiplier);

      await awardXpMutation.mutateAsync({
        amount: totalXp,
        reason: "habit_completion",
        referenceId: habitId,
        referenceType: "habit",
      });

      // Return the result for celebration
      return {
        xpAwarded: totalXp,
        streakBonus: totalXp - baseXp,
        leveledUp: awardXpMutation.data?.leveledUp || false,
        newLevel: awardXpMutation.data?.newLevel,
      };
    },
    [awardXpMutation]
  );

  // Check and award streak badges
  const checkStreakBadges = useCallback(
    async (streakDays: number) => {
      if (!badgeDefinitions || !userBadges) return [];

      const streakBadges = badgeDefinitions.filter(
        (b) => b.requirementType === "streak_days" && b.requirementValue <= streakDays
      );

      const earnedBadgeIds = new Set(userBadges.map((ub) => ub?.badge?.id).filter(Boolean));
      const unearnedStreakBadges = streakBadges.filter((b) => !earnedBadgeIds.has(b.id));

      const newlyEarned = [];
      for (const badge of unearnedStreakBadges) {
        const result = await awardBadgeMutation.mutateAsync({ badgeId: badge.id });
        if (result.success) {
          newlyEarned.push(badge);
        }
      }

      return newlyEarned;
    },
    [badgeDefinitions, userBadges, awardBadgeMutation]
  );

  // Get badges by category for display
  const getBadgesByCategory = useCallback(() => {
    if (!badgeDefinitions) return {};

    const earnedBadgeIds = new Set(userBadges?.map((ub) => ub?.badge?.id).filter(Boolean) || []);

    return badgeDefinitions.reduce(
      (acc, badge) => {
        if (!acc[badge.category]) {
          acc[badge.category] = [];
        }
        acc[badge.category].push({
          ...badge,
          earned: earnedBadgeIds.has(badge.id),
          earnedAt: userBadges?.find((ub) => ub?.badge?.id === badge.id)?.earnedAt,
        });
        return acc;
      },
      {} as Record<
        string,
        Array<(typeof badgeDefinitions)[0] & { earned: boolean; earnedAt?: string }>
      >
    );
  }, [badgeDefinitions, userBadges]);

  return {
    // Stats
    stats: stats || {
      totalXp: 0,
      currentLevel: 1,
      levelTitle: "Seedling",
      coins: 0,
      nextLevelXp: 100,
      progress: 0,
    },
    isLoadingStats,

    // Badges
    badgeDefinitions: badgeDefinitions || [],
    userBadges: userBadges || [],
    isLoadingBadges: isLoadingBadges || isLoadingUserBadges,
    getBadgesByCategory,

    // Level progression
    levelProgression: levelProgression || [],

    // Actions
    awardHabitXp,
    checkStreakBadges,
    awardBadge: awardBadgeMutation.mutateAsync,

    // Refresh
    refetch: () => {
      refetchStats();
      refetchUserBadges();
    },
  };
}
