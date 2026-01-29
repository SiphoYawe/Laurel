import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Get Supabase client for database operations
 * Creates a service-role client for server-side operations
 */
function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }

  // Use service role key if available (bypasses RLS), otherwise use anon key
  const key = supabaseServiceKey || supabaseAnonKey;
  if (!key) {
    throw new Error(
      "No Supabase key available (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    );
  }

  return createClient(supabaseUrl, key);
}

/**
 * Zod schema for habit creation
 */
const createHabitSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  cueTrigger: z.string().max(200).optional(),
  routine: z.string().min(1).max(500),
  reward: z.string().max(200).optional(),
  twoMinuteVersion: z.string().max(200).optional(),
  category: z.enum([
    "study",
    "exercise",
    "health",
    "productivity",
    "mindfulness",
    "social",
    "creative",
    "other",
  ]),
  frequency: z.enum(["daily", "weekdays", "weekends", "weekly", "custom"]).default("daily"),
  frequencyDays: z
    .array(z.number().int().min(0).max(6))
    .refine((days) => new Set(days).size === days.length, {
      message: "Frequency days must not contain duplicates",
    })
    .optional()
    .nullable(),
  durationMinutes: z.number().int().min(1).max(480).optional().default(15),
  targetTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
});

/**
 * Zod schema for habit update
 */
const updateHabitSchema = createHabitSchema.partial().extend({
  id: z.string().uuid(),
  isActive: z.boolean().optional(),
});

/**
 * Habits router for habit CRUD operations
 */
export const habitsRouter = router({
  /**
   * List all habits for the authenticated user
   */
  list: protectedProcedure
    .input(
      z
        .object({
          filter: z.enum(["all", "active", "inactive"]).default("active"),
          category: z
            .enum([
              "study",
              "exercise",
              "health",
              "productivity",
              "mindfulness",
              "social",
              "creative",
              "other",
            ])
            .optional(),
          limit: z.number().min(1).max(100).default(50),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();
      const filter = input?.filter ?? "active";

      // Build query conditions
      let query = supabase
        .from("habits")
        .select(
          `
          *,
          habit_streaks (
            current_streak,
            longest_streak,
            last_completed_date
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(input?.limit ?? 50);

      // Apply filter
      if (filter === "active") {
        query = query.eq("is_active", true);
      } else if (filter === "inactive") {
        query = query.eq("is_active", false);
      }

      // Apply category filter
      if (input?.category) {
        query = query.eq("category", input.category);
      }

      const { data: habits, error } = await query;

      if (error) {
        console.error("Error fetching habits:", error);
        throw new Error("Failed to fetch habits");
      }

      // Get today's date for completion check
      const today = new Date().toISOString().split("T")[0];

      // Check which habits are completed today
      const habitIds = habits?.map((h) => h.id) || [];

      if (habitIds.length === 0) {
        return [];
      }

      const { data: completions } = await supabase
        .from("habit_completions")
        .select("habit_id")
        .in("habit_id", habitIds)
        .gte("completed_at", `${today}T00:00:00Z`)
        .lte("completed_at", `${today}T23:59:59Z`);

      const completedTodaySet = new Set(completions?.map((c) => c.habit_id) || []);

      return (habits || []).map((habit) => ({
        ...habit,
        streak: habit.habit_streaks?.[0] || {
          current_streak: 0,
          longest_streak: 0,
          last_completed_date: null,
        },
        isCompletedToday: completedTodaySet.has(habit.id),
      }));
    }),

  /**
   * Get a single habit by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const { data: habit, error } = await supabase
        .from("habits")
        .select(
          `
        *,
        habit_streaks (
          current_streak,
          longest_streak,
          last_completed_date
        )
      `
        )
        .eq("id", input.id)
        .eq("user_id", userId)
        .single();

      if (error || !habit) {
        throw new Error("Habit not found");
      }

      // Get last 7 days completion history
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: completions } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("habit_id", input.id)
        .gte("completed_at", sevenDaysAgo.toISOString())
        .order("completed_at", { ascending: false });

      // Check if completed today
      const today = new Date().toISOString().split("T")[0];
      const isCompletedToday = completions?.some((c) => c.completed_at?.startsWith(today)) || false;

      return {
        ...habit,
        streak: habit.habit_streaks?.[0] || {
          current_streak: 0,
          longest_streak: 0,
          last_completed_date: null,
        },
        completionHistory: completions || [],
        isCompletedToday,
      };
    }),

  /**
   * Create a new habit
   */
  create: protectedProcedure.input(createHabitSchema).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const supabase = getSupabaseClient();

    // Create the habit
    const { data: habit, error: habitError } = await supabase
      .from("habits")
      .insert({
        user_id: userId,
        title: input.title,
        description: input.description || null,
        cue_trigger: input.cueTrigger || null,
        routine: input.routine,
        reward: input.reward || null,
        two_minute_version: input.twoMinuteVersion || null,
        category: input.category,
        frequency: input.frequency,
        frequency_days: input.frequencyDays || null,
        duration_minutes: input.durationMinutes,
        target_time: input.targetTime || null,
        is_active: true,
      })
      .select()
      .single();

    if (habitError || !habit) {
      console.error("Error creating habit:", habitError);
      throw new Error("Failed to create habit");
    }

    // Initialize habit streak record
    const { error: streakError } = await supabase.from("habit_streaks").insert({
      habit_id: habit.id,
      current_streak: 0,
      longest_streak: 0,
      last_completed_date: null,
    });

    if (streakError) {
      console.error("Error creating streak record:", streakError);
      // Don't fail the whole operation for this
    }

    return {
      ...habit,
      streak: {
        current_streak: 0,
        longest_streak: 0,
        last_completed_date: null,
      },
      isCompletedToday: false,
    };
  }),

  /**
   * Update an existing habit
   */
  update: protectedProcedure.input(updateHabitSchema).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const supabase = getSupabaseClient();
    const { id, ...updates } = input;

    // Convert camelCase to snake_case for database
    const dbUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.cueTrigger !== undefined) dbUpdates.cue_trigger = updates.cueTrigger;
    if (updates.routine !== undefined) dbUpdates.routine = updates.routine;
    if (updates.reward !== undefined) dbUpdates.reward = updates.reward;
    if (updates.twoMinuteVersion !== undefined)
      dbUpdates.two_minute_version = updates.twoMinuteVersion;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency;
    if (updates.frequencyDays !== undefined) dbUpdates.frequency_days = updates.frequencyDays;
    if (updates.durationMinutes !== undefined) dbUpdates.duration_minutes = updates.durationMinutes;
    if (updates.targetTime !== undefined) dbUpdates.target_time = updates.targetTime;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

    const { data: habit, error } = await supabase
      .from("habits")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error || !habit) {
      console.error("Error updating habit:", error);
      throw new Error("Failed to update habit");
    }

    return habit;
  }),

  /**
   * Delete a habit
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", input.id)
        .eq("user_id", userId);

      if (error) {
        console.error("Error deleting habit:", error);
        throw new Error("Failed to delete habit");
      }

      return { success: true };
    }),

  /**
   * Complete a habit for today
   */
  complete: protectedProcedure
    .input(
      z.object({
        habitId: z.string().uuid(),
        durationMinutes: z.number().int().min(1).max(480).optional(),
        notes: z.string().max(500).optional(),
        qualityRating: z.number().int().min(1).max(5).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Verify the habit belongs to the user
      const { data: habit, error: habitError } = await supabase
        .from("habits")
        .select("id, duration_minutes")
        .eq("id", input.habitId)
        .eq("user_id", userId)
        .single();

      if (habitError || !habit) {
        throw new Error("Habit not found");
      }

      // Check if already completed today
      const today = new Date().toISOString().split("T")[0];
      const { data: existingCompletion } = await supabase
        .from("habit_completions")
        .select("id")
        .eq("habit_id", input.habitId)
        .gte("completed_at", `${today}T00:00:00Z`)
        .lte("completed_at", `${today}T23:59:59Z`)
        .single();

      if (existingCompletion) {
        throw new Error("Habit already completed today");
      }

      // Create completion record
      const { data: completion, error: completionError } = await supabase
        .from("habit_completions")
        .insert({
          habit_id: input.habitId,
          user_id: userId,
          completed_at: new Date().toISOString(),
          duration_minutes: input.durationMinutes || habit.duration_minutes,
          notes: input.notes || null,
          quality_rating: input.qualityRating || null,
        })
        .select()
        .single();

      if (completionError || !completion) {
        console.error("Error creating completion:", completionError);
        throw new Error("Failed to complete habit");
      }

      // Update streak
      const { data: streak } = await supabase
        .from("habit_streaks")
        .select("*")
        .eq("habit_id", input.habitId)
        .single();

      const currentStreak = (streak?.current_streak || 0) + 1;
      const longestStreak = Math.max(streak?.longest_streak || 0, currentStreak);

      await supabase
        .from("habit_streaks")
        .upsert({
          habit_id: input.habitId,
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_completed_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq("habit_id", input.habitId);

      return {
        completion,
        streak: {
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_completed_date: today,
        },
      };
    }),

  /**
   * Uncomplete a habit (undo completion)
   */
  uncomplete: protectedProcedure
    .input(z.object({ habitId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Find today's completion
      const today = new Date().toISOString().split("T")[0];
      const { data: completion, error: findError } = await supabase
        .from("habit_completions")
        .select("id")
        .eq("habit_id", input.habitId)
        .eq("user_id", userId)
        .gte("completed_at", `${today}T00:00:00Z`)
        .lte("completed_at", `${today}T23:59:59Z`)
        .single();

      if (findError || !completion) {
        throw new Error("Completion not found for today");
      }

      // Delete the completion
      const { error: deleteError } = await supabase
        .from("habit_completions")
        .delete()
        .eq("id", completion.id);

      if (deleteError) {
        console.error("Error deleting completion:", deleteError);
        throw new Error("Failed to uncomplete habit");
      }

      // Update streak (decrement)
      const { data: streak } = await supabase
        .from("habit_streaks")
        .select("*")
        .eq("habit_id", input.habitId)
        .single();

      if (streak) {
        await supabase
          .from("habit_streaks")
          .update({
            current_streak: Math.max(0, (streak.current_streak || 0) - 1),
            updated_at: new Date().toISOString(),
          })
          .eq("habit_id", input.habitId);
      }

      return { success: true };
    }),
});
