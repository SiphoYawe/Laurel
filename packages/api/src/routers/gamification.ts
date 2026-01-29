import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Gamification Router
 * Story 4-1: Create Gamification Database Schema
 */

// Singleton Supabase client
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Supabase URL not configured",
    });
  }

  const key = supabaseServiceKey || supabaseAnonKey;
  if (!key) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Supabase key not configured",
    });
  }

  supabaseClient = createClient(supabaseUrl, key);
  return supabaseClient;
}

// Level progression configuration
const LEVEL_CONFIG = [
  { level: 1, title: "Seedling", xpRequired: 0 },
  { level: 2, title: "Sprout", xpRequired: 100 },
  { level: 3, title: "Sapling", xpRequired: 300 },
  { level: 4, title: "Growing", xpRequired: 600 },
  { level: 5, title: "Blooming", xpRequired: 1000 },
  { level: 6, title: "Flourishing", xpRequired: 1500 },
  { level: 7, title: "Thriving", xpRequired: 2500 },
  { level: 8, title: "Laurel Champion", xpRequired: 4000 },
];

/**
 * Calculate level from total XP
 */
function calculateLevel(totalXp: number): {
  level: number;
  title: string;
  nextLevelXp: number;
  progress: number;
} {
  let currentLevel = LEVEL_CONFIG[0];

  for (const config of LEVEL_CONFIG) {
    if (totalXp >= config.xpRequired) {
      currentLevel = config;
    } else {
      break;
    }
  }

  const currentIndex = LEVEL_CONFIG.findIndex((c) => c.level === currentLevel.level);
  const nextLevel = LEVEL_CONFIG[currentIndex + 1];

  if (!nextLevel) {
    return {
      level: currentLevel.level,
      title: currentLevel.title,
      nextLevelXp: currentLevel.xpRequired,
      progress: 100,
    };
  }

  const xpInCurrentLevel = totalXp - currentLevel.xpRequired;
  const xpForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired;
  const progress = Math.round((xpInCurrentLevel / xpForNextLevel) * 100);

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    nextLevelXp: nextLevel.xpRequired,
    progress: Math.min(progress, 100),
  };
}

export const gamificationRouter = router({
  /**
   * Get user's gamification stats
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("user_gamification")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch gamification stats",
        cause: error,
      });
    }

    // Return defaults if no record exists
    if (!data) {
      return {
        totalXp: 0,
        currentLevel: 1,
        levelTitle: "Seedling",
        coins: 0,
        nextLevelXp: 100,
        progress: 0,
      };
    }

    const levelInfo = calculateLevel(data.total_xp);

    return {
      totalXp: data.total_xp,
      currentLevel: levelInfo.level,
      levelTitle: levelInfo.title,
      coins: data.coins,
      nextLevelXp: levelInfo.nextLevelXp,
      progress: levelInfo.progress,
    };
  }),

  /**
   * Award XP to user
   */
  awardXp: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(1),
        reason: z.string(),
        referenceId: z.string().uuid().optional(),
        referenceType: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Insert XP transaction
      const { error: txError } = await supabase.from("xp_transactions").insert({
        user_id: userId,
        amount: input.amount,
        reason: input.reason,
        reference_id: input.referenceId,
        reference_type: input.referenceType,
      });

      if (txError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to record XP transaction",
          cause: txError,
        });
      }

      // Upsert user gamification stats
      const { data: currentStats } = await supabase
        .from("user_gamification")
        .select("total_xp, current_level")
        .eq("user_id", userId)
        .single();

      const newTotalXp = (currentStats?.total_xp || 0) + input.amount;
      const levelInfo = calculateLevel(newTotalXp);

      const { error: upsertError } = await supabase.from("user_gamification").upsert({
        user_id: userId,
        total_xp: newTotalXp,
        current_level: levelInfo.level,
      });

      if (upsertError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update gamification stats",
          cause: upsertError,
        });
      }

      // Check for level up
      const previousLevel = currentStats?.current_level || 1;
      const leveledUp = levelInfo.level > previousLevel;

      return {
        success: true,
        newTotalXp,
        newLevel: levelInfo.level,
        levelTitle: levelInfo.title,
        leveledUp,
        xpAwarded: input.amount,
      };
    }),

  /**
   * Get all badge definitions
   */
  getBadgeDefinitions: protectedProcedure.query(async () => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("badge_definitions")
      .select("*")
      .eq("is_active", true)
      .order("category")
      .order("requirement_value");

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch badge definitions",
        cause: error,
      });
    }

    return (data || []).map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      category: badge.category,
      requirementType: badge.requirement_type,
      requirementValue: badge.requirement_value,
      xpReward: badge.xp_reward,
      rarity: badge.rarity,
    }));
  }),

  /**
   * Get user's earned badges
   */
  getUserBadges: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("user_badges")
      .select(
        `
        id,
        earned_at,
        badge:badge_definitions (
          id,
          name,
          description,
          icon,
          category,
          requirement_type,
          requirement_value,
          xp_reward,
          rarity
        )
      `
      )
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user badges",
        cause: error,
      });
    }

    return (data || [])
      .map((item) => {
        // Handle the joined badge data - can be array or single object depending on Supabase version
        const badgeData = Array.isArray(item.badge) ? item.badge[0] : item.badge;
        const badge = badgeData as {
          id: string;
          name: string;
          description: string;
          icon: string;
          category: string;
          requirement_type: string;
          requirement_value: number;
          xp_reward: number;
          rarity: string;
        } | null;

        if (!badge) {
          return null;
        }

        return {
          id: item.id,
          earnedAt: item.earned_at,
          badge: {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            category: badge.category,
            requirementType: badge.requirement_type,
            requirementValue: badge.requirement_value,
            xpReward: badge.xp_reward,
            rarity: badge.rarity,
          },
        };
      })
      .filter(Boolean);
  }),

  /**
   * Award a badge to user
   */
  awardBadge: protectedProcedure
    .input(z.object({ badgeId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Check if badge already earned
      const { data: existing } = await supabase
        .from("user_badges")
        .select("id")
        .eq("user_id", userId)
        .eq("badge_id", input.badgeId)
        .single();

      if (existing) {
        return { success: false, alreadyEarned: true };
      }

      // Get badge info for XP reward
      const { data: badge, error: badgeError } = await supabase
        .from("badge_definitions")
        .select("name, xp_reward")
        .eq("id", input.badgeId)
        .single();

      if (badgeError || !badge) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Badge not found",
        });
      }

      // Award badge
      const { error: insertError } = await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: input.badgeId,
      });

      if (insertError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to award badge",
          cause: insertError,
        });
      }

      // Award XP if badge has reward
      if (badge.xp_reward > 0) {
        await supabase.from("xp_transactions").insert({
          user_id: userId,
          amount: badge.xp_reward,
          reason: "badge_earned",
          reference_id: input.badgeId,
          reference_type: "badge",
        });

        // Update total XP
        const { data: currentStats } = await supabase
          .from("user_gamification")
          .select("total_xp")
          .eq("user_id", userId)
          .single();

        const newTotalXp = (currentStats?.total_xp || 0) + badge.xp_reward;
        const levelInfo = calculateLevel(newTotalXp);

        await supabase.from("user_gamification").upsert({
          user_id: userId,
          total_xp: newTotalXp,
          current_level: levelInfo.level,
        });
      }

      return {
        success: true,
        badgeName: badge.name,
        xpAwarded: badge.xp_reward,
      };
    }),

  /**
   * Get XP transaction history
   */
  getXpHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const { data, error, count } = await supabase
        .from("xp_transactions")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(input.offset, input.offset + input.limit - 1);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch XP history",
          cause: error,
        });
      }

      return {
        transactions: (data || []).map((tx) => ({
          id: tx.id,
          amount: tx.amount,
          reason: tx.reason,
          referenceId: tx.reference_id,
          referenceType: tx.reference_type,
          createdAt: tx.created_at,
        })),
        total: count || 0,
      };
    }),

  /**
   * Get level progression info
   */
  getLevelProgression: protectedProcedure.query(async () => {
    return LEVEL_CONFIG.map((config) => ({
      level: config.level,
      title: config.title,
      xpRequired: config.xpRequired,
    }));
  }),
});
