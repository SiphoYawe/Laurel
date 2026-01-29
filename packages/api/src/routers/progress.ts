import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Progress Router
 * Story 3-3: Streak Calendar Visualization
 *
 * Handles progress-related queries including calendar data
 */

/**
 * Get Supabase client for database operations
 */
function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }

  const key = supabaseServiceKey || supabaseAnonKey;
  if (!key) {
    throw new Error(
      "No Supabase key available (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    );
  }

  return createClient(supabaseUrl, key);
}

export const progressRouter = router({
  /**
   * Get calendar data for habit completions
   * Returns completions grouped by date for the heatmap visualization
   */
  getCalendarData: protectedProcedure
    .input(
      z.object({
        startDate: z.string(), // ISO date string
        endDate: z.string(), // ISO date string
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Fetch completions in the date range with habit details
      const { data: completions, error } = await supabase
        .from("habit_completions")
        .select(
          `
          id,
          habit_id,
          completed_at,
          habits (
            id,
            title
          )
        `
        )
        .eq("user_id", userId)
        .gte("completed_at", input.startDate)
        .lte("completed_at", input.endDate)
        .order("completed_at", { ascending: false });

      if (error) {
        console.error("Error fetching calendar data:", error);
        throw new Error("Failed to fetch calendar data");
      }

      // Transform data for the calendar
      const transformedCompletions = (completions || []).map((c) => {
        const habit = c.habits as unknown as { id: string; title: string } | null;
        return {
          habitId: c.habit_id,
          habitTitle: habit?.title || "Unknown Habit",
          completedAt: c.completed_at,
        };
      });

      return {
        completions: transformedCompletions,
        startDate: input.startDate,
        endDate: input.endDate,
      };
    }),

  /**
   * Get overall progress statistics
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const supabase = getSupabaseClient();

    // Get total habits count
    const { count: totalHabits } = await supabase
      .from("habits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true);

    // Get total completions count
    const { count: totalCompletions } = await supabase
      .from("habit_completions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    // Get completions this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const { count: weekCompletions } = await supabase
      .from("habit_completions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("completed_at", weekStart.toISOString());

    // Get completions today
    const today = new Date().toISOString().split("T")[0];
    const { count: todayCompletions } = await supabase
      .from("habit_completions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("completed_at", `${today}T00:00:00Z`)
      .lte("completed_at", `${today}T23:59:59Z`);

    // Get longest current streak across all habits
    const { data: streaks } = await supabase
      .from("habit_streaks")
      .select("current_streak, longest_streak")
      .eq("habit_id", supabase.from("habits").select("id").eq("user_id", userId));

    let longestCurrentStreak = 0;
    let longestEverStreak = 0;

    if (streaks) {
      for (const streak of streaks) {
        if (streak.current_streak > longestCurrentStreak) {
          longestCurrentStreak = streak.current_streak;
        }
        if (streak.longest_streak > longestEverStreak) {
          longestEverStreak = streak.longest_streak;
        }
      }
    }

    return {
      totalHabits: totalHabits || 0,
      totalCompletions: totalCompletions || 0,
      weekCompletions: weekCompletions || 0,
      todayCompletions: todayCompletions || 0,
      longestCurrentStreak,
      longestEverStreak,
    };
  }),
});
