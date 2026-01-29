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

  /**
   * Get habits with completions for calendar view
   * Story 3-6: Calendar View for Habits
   */
  getHabitsForCalendar: protectedProcedure
    .input(
      z.object({
        startDate: z.string(), // ISO date string
        endDate: z.string(), // ISO date string
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Fetch all active habits for the user
      const { data: habits, error: habitsError } = await supabase
        .from("habits")
        .select(
          `
          id,
          title,
          description,
          category,
          target_time,
          duration_minutes,
          frequency,
          frequency_days,
          is_active
        `
        )
        .eq("user_id", userId)
        .eq("is_active", true);

      if (habitsError) {
        console.error("Error fetching habits:", habitsError);
        throw new Error("Failed to fetch habits");
      }

      // Fetch completions in the date range
      const { data: completions, error: completionsError } = await supabase
        .from("habit_completions")
        .select("id, habit_id, completed_at")
        .eq("user_id", userId)
        .gte("completed_at", input.startDate)
        .lte("completed_at", `${input.endDate}T23:59:59Z`);

      if (completionsError) {
        console.error("Error fetching completions:", completionsError);
        throw new Error("Failed to fetch completions");
      }

      // Create a set of completed habit+date combos
      const completedMap = new Map<string, string>();
      for (const c of completions || []) {
        const dateKey = c.completed_at.split("T")[0];
        const key = `${c.habit_id}-${dateKey}`;
        completedMap.set(key, c.id);
      }

      // Transform habits for calendar display
      const calendarHabits = (habits || []).map((h) => ({
        id: h.id,
        title: h.title,
        description: h.description,
        category: h.category || "other",
        targetTime: h.target_time || "09:00",
        durationMinutes: h.duration_minutes || 30,
        frequency: h.frequency || "daily",
        frequencyDays: h.frequency_days,
      }));

      return {
        habits: calendarHabits,
        completedMap: Object.fromEntries(completedMap),
        startDate: input.startDate,
        endDate: input.endDate,
      };
    }),

  /**
   * Get user's day count since first habit
   * Story 3-4: Plateau of Latent Potential Visualization
   */
  getUserDayCount: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const supabase = getSupabaseClient();

    // Find the earliest habit created by this user
    const { data: firstHabit } = await supabase
      .from("habits")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (!firstHabit) {
      return {
        dayCount: 0,
        firstHabitDate: null,
      };
    }

    // Calculate days since first habit
    const firstHabitDate = new Date(firstHabit.created_at);
    const today = new Date();

    // Reset time to start of day for accurate day calculation
    firstHabitDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - firstHabitDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Day 1 is the first day, not day 0
    const dayCount = Math.max(1, diffDays + 1);

    return {
      dayCount,
      firstHabitDate: firstHabit.created_at,
    };
  }),
});
