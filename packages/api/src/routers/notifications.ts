import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Notifications Router
 * Story 3-7: Habit Reminder Notifications
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

// Valid IANA timezone check
function isValidTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export const notificationsRouter = router({
  /**
   * Register a push token for the current user
   */
  registerPushToken: protectedProcedure
    .input(
      z.object({
        token: z.string(),
        platform: z.enum(["web", "ios", "android"]),
        endpoint: z.string().optional(),
        p256dh: z.string().optional(),
        auth: z.string().optional(),
        deviceInfo: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Upsert push token
      const { data, error } = await supabase
        .from("user_push_tokens")
        .upsert(
          {
            user_id: userId,
            token: input.token,
            platform: input.platform,
            endpoint: input.endpoint,
            p256dh: input.p256dh,
            auth: input.auth,
            device_info: input.deviceInfo,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,token",
          }
        )
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register push token",
          cause: error,
        });
      }

      return { success: true, tokenId: data?.id };
    }),

  /**
   * Remove a push token
   */
  removePushToken: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from("user_push_tokens")
        .delete()
        .eq("user_id", userId)
        .eq("token", input.token);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove push token",
          cause: error,
        });
      }

      return { success: true };
    }),

  /**
   * Get notification preferences
   */
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch notification preferences",
        cause: error,
      });
    }

    // Return defaults if no preferences exist
    if (!data) {
      return {
        remindersEnabled: true,
        streakWarningsEnabled: true,
        dailySummaryEnabled: false,
        quietHoursEnabled: false,
        quietHoursStart: "22:00",
        quietHoursEnd: "07:00",
        streakWarningTime: "22:00",
        reminderOffsetMinutes: 0,
        timezone: "UTC",
      };
    }

    return {
      remindersEnabled: data.reminders_enabled,
      streakWarningsEnabled: data.streak_warnings_enabled,
      dailySummaryEnabled: data.daily_summary_enabled,
      quietHoursEnabled: data.quiet_hours_enabled,
      quietHoursStart: data.quiet_hours_start,
      quietHoursEnd: data.quiet_hours_end,
      streakWarningTime: data.streak_warning_time,
      reminderOffsetMinutes: data.reminder_offset_minutes,
      timezone: data.timezone,
    };
  }),

  /**
   * Update notification preferences
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        remindersEnabled: z.boolean().optional(),
        streakWarningsEnabled: z.boolean().optional(),
        dailySummaryEnabled: z.boolean().optional(),
        quietHoursEnabled: z.boolean().optional(),
        quietHoursStart: z.string().optional(),
        quietHoursEnd: z.string().optional(),
        streakWarningTime: z.string().optional(),
        reminderOffsetMinutes: z.number().optional(),
        timezone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const updateData: Record<string, unknown> = {
        user_id: userId,
        updated_at: new Date().toISOString(),
      };

      if (input.remindersEnabled !== undefined) {
        updateData.reminders_enabled = input.remindersEnabled;
      }
      if (input.streakWarningsEnabled !== undefined) {
        updateData.streak_warnings_enabled = input.streakWarningsEnabled;
      }
      if (input.dailySummaryEnabled !== undefined) {
        updateData.daily_summary_enabled = input.dailySummaryEnabled;
      }
      if (input.quietHoursEnabled !== undefined) {
        updateData.quiet_hours_enabled = input.quietHoursEnabled;
      }
      if (input.quietHoursStart !== undefined) {
        updateData.quiet_hours_start = input.quietHoursStart;
      }
      if (input.quietHoursEnd !== undefined) {
        updateData.quiet_hours_end = input.quietHoursEnd;
      }
      if (input.streakWarningTime !== undefined) {
        updateData.streak_warning_time = input.streakWarningTime;
      }
      if (input.reminderOffsetMinutes !== undefined) {
        updateData.reminder_offset_minutes = input.reminderOffsetMinutes;
      }
      if (input.timezone !== undefined) {
        if (!isValidTimezone(input.timezone)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Invalid timezone: ${input.timezone}`,
          });
        }
        updateData.timezone = input.timezone;
      }

      const { error } = await supabase.from("notification_preferences").upsert(updateData, {
        onConflict: "user_id",
      });

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update notification preferences",
          cause: error,
        });
      }

      return { success: true };
    }),

  /**
   * Get scheduled notifications for current user
   */
  getScheduledNotifications: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("scheduled_notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "pending")
      .order("scheduled_for", { ascending: true })
      .limit(20);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch scheduled notifications",
        cause: error,
      });
    }

    return data || [];
  }),

  /**
   * Cancel a scheduled notification
   */
  cancelNotification: protectedProcedure
    .input(z.object({ notificationId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from("scheduled_notifications")
        .update({ status: "cancelled" })
        .eq("id", input.notificationId)
        .eq("user_id", userId)
        .eq("status", "pending");

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to cancel notification",
          cause: error,
        });
      }

      return { success: true };
    }),

  /**
   * Get notification history
   */
  getHistory: protectedProcedure
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
        .from("notification_history")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("sent_at", { ascending: false })
        .range(input.offset, input.offset + input.limit - 1);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch notification history",
          cause: error,
        });
      }

      return {
        notifications: data || [],
        total: count || 0,
      };
    }),

  /**
   * Schedule a notification for a habit reminder
   */
  scheduleHabitReminder: protectedProcedure
    .input(
      z.object({
        habitId: z.string().uuid(),
        habitTitle: z.string(),
        scheduledFor: z.string().datetime(),
        durationMinutes: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const durationText = input.durationMinutes ? ` - ${input.durationMinutes} minutes` : "";

      const { data, error } = await supabase
        .from("scheduled_notifications")
        .insert({
          user_id: userId,
          habit_id: input.habitId,
          type: "reminder",
          title: "Time for your habit!",
          body: `${input.habitTitle}${durationText}`,
          data: {
            habitId: input.habitId,
            deepLink: `/habits/${input.habitId}`,
          },
          scheduled_for: input.scheduledFor,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to schedule notification",
          cause: error,
        });
      }

      return { success: true, notificationId: data?.id };
    }),

  /**
   * Schedule a streak warning notification
   */
  scheduleStreakWarning: protectedProcedure
    .input(
      z.object({
        habitId: z.string().uuid(),
        habitTitle: z.string(),
        currentStreak: z.number(),
        scheduledFor: z.string().datetime(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const streakText =
        input.currentStreak > 0
          ? `Your ${input.currentStreak}-day streak is on the line!`
          : "Don't miss your habit today!";

      const { data, error } = await supabase
        .from("scheduled_notifications")
        .insert({
          user_id: userId,
          habit_id: input.habitId,
          type: "streak_warning",
          title: "Streak at risk! 🔥",
          body: `You haven't completed ${input.habitTitle} today. ${streakText}`,
          data: {
            habitId: input.habitId,
            deepLink: `/habits/${input.habitId}`,
            actions: [
              { action: "complete_now", title: "Complete now" },
              { action: "snooze", title: "Snooze 30min" },
            ],
          },
          scheduled_for: input.scheduledFor,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to schedule streak warning",
          cause: error,
        });
      }

      return { success: true, notificationId: data?.id };
    }),
});
