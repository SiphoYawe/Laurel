import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Pods Router
 * Story 5-1 through 5-7: Accountability Pods
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

/**
 * Generate a unique 6-character invite code
 */
function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const podsRouter = router({
  /**
   * List user's pods
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const supabase = getSupabaseClient();

    // Get pods where user is a member
    const { data: memberships, error: memberError } = await supabase
      .from("pod_members")
      .select("pod_id, role, joined_at")
      .eq("user_id", userId);

    if (memberError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch pod memberships",
        cause: memberError,
      });
    }

    if (!memberships || memberships.length === 0) {
      return [];
    }

    const podIds = memberships.map((m) => m.pod_id);

    // Get pod details with member count
    const { data: pods, error: podsError } = await supabase
      .from("pods")
      .select(
        `
        *,
        pod_members (count)
      `
      )
      .in("id", podIds)
      .eq("is_active", true);

    if (podsError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch pods",
        cause: podsError,
      });
    }

    // Merge membership info with pod info
    return (pods || []).map((pod) => {
      const membership = memberships.find((m) => m.pod_id === pod.id);
      const memberCount = Array.isArray(pod.pod_members) ? pod.pod_members[0]?.count || 0 : 0;

      return {
        id: pod.id,
        name: pod.name,
        description: pod.description,
        inviteCode: pod.invite_code,
        maxMembers: pod.max_members,
        memberCount,
        role: membership?.role || "member",
        joinedAt: membership?.joined_at,
        createdAt: pod.created_at,
        isOwner: pod.created_by === userId,
      };
    });
  }),

  /**
   * Get single pod details
   */
  getById: protectedProcedure
    .input(z.object({ podId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Verify user is a member
      const { data: membership, error: memberError } = await supabase
        .from("pod_members")
        .select("role, joined_at")
        .eq("pod_id", input.podId)
        .eq("user_id", userId)
        .single();

      if (memberError || !membership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pod not found or you are not a member",
        });
      }

      // Get pod details
      const { data: pod, error: podError } = await supabase
        .from("pods")
        .select("*")
        .eq("id", input.podId)
        .single();

      if (podError || !pod) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pod not found",
        });
      }

      // Get members with their streak info
      const { data: members, error: membersError } = await supabase
        .from("pod_members")
        .select(
          `
          user_id,
          role,
          joined_at,
          profiles:user_id (
            email,
            full_name,
            avatar_url
          )
        `
        )
        .eq("pod_id", input.podId);

      if (membersError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch pod members",
        });
      }

      return {
        id: pod.id,
        name: pod.name,
        description: pod.description,
        inviteCode: pod.invite_code,
        maxMembers: pod.max_members,
        createdAt: pod.created_at,
        isOwner: pod.created_by === userId,
        role: membership.role,
        joinedAt: membership.joined_at,
        members: (members || []).map((m) => {
          const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
          return {
            userId: m.user_id,
            role: m.role,
            joinedAt: m.joined_at,
            email: profile?.email,
            fullName: profile?.full_name,
            avatarUrl: profile?.avatar_url,
          };
        }),
      };
    }),

  /**
   * Create a new pod
   * Story 5-2: Create Accountability Pod
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
        description: z.string().max(200).optional(),
        maxMembers: z.number().int().min(2).max(50).default(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Generate unique invite code
      let inviteCode = generateInviteCode();
      let attempts = 0;
      const maxAttempts = 5;

      // Ensure invite code is unique
      while (attempts < maxAttempts) {
        const { data: existing } = await supabase
          .from("pods")
          .select("id")
          .eq("invite_code", inviteCode)
          .single();

        if (!existing) break;

        inviteCode = generateInviteCode();
        attempts++;
      }

      // Create the pod
      const { data: pod, error: createError } = await supabase
        .from("pods")
        .insert({
          name: input.name,
          description: input.description || null,
          invite_code: inviteCode,
          created_by: userId,
          max_members: input.maxMembers,
        })
        .select()
        .single();

      if (createError || !pod) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create pod",
          cause: createError,
        });
      }

      // The trigger should auto-add the creator as owner
      // But let's verify
      const { data: membership } = await supabase
        .from("pod_members")
        .select("id")
        .eq("pod_id", pod.id)
        .eq("user_id", userId)
        .single();

      if (!membership) {
        // Manually add if trigger didn't fire
        await supabase.from("pod_members").insert({
          pod_id: pod.id,
          user_id: userId,
          role: "owner",
        });
      }

      return {
        id: pod.id,
        name: pod.name,
        description: pod.description,
        inviteCode: pod.invite_code,
        maxMembers: pod.max_members,
        createdAt: pod.created_at,
      };
    }),

  /**
   * Join a pod via invite code
   * Story 5-3: Join Pod via Invite Code
   */
  join: protectedProcedure
    .input(z.object({ inviteCode: z.string().length(6).toUpperCase() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Find pod by invite code
      const { data: pod, error: findError } = await supabase
        .from("pods")
        .select("id, name, max_members, is_active")
        .eq("invite_code", input.inviteCode)
        .single();

      if (findError || !pod) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid invite code",
        });
      }

      if (!pod.is_active) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This pod is no longer active",
        });
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from("pod_members")
        .select("id")
        .eq("pod_id", pod.id)
        .eq("user_id", userId)
        .single();

      if (existingMember) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already a member of this pod",
        });
      }

      // Check member count
      const { count } = await supabase
        .from("pod_members")
        .select("*", { count: "exact", head: true })
        .eq("pod_id", pod.id);

      if ((count || 0) >= pod.max_members) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This pod is full",
        });
      }

      // Join the pod
      const { error: joinError } = await supabase.from("pod_members").insert({
        pod_id: pod.id,
        user_id: userId,
        role: "member",
      });

      if (joinError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to join pod",
          cause: joinError,
        });
      }

      // Log activity
      await supabase.from("pod_activities").insert({
        pod_id: pod.id,
        user_id: userId,
        activity_type: "member_joined",
        metadata: {},
      });

      return {
        success: true,
        podId: pod.id,
        podName: pod.name,
      };
    }),

  /**
   * Preview a pod before joining
   */
  preview: protectedProcedure
    .input(z.object({ inviteCode: z.string().length(6).toUpperCase() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Find pod by invite code
      const { data: pod, error: findError } = await supabase
        .from("pods")
        .select("id, name, description, max_members, is_active, created_at")
        .eq("invite_code", input.inviteCode)
        .single();

      if (findError || !pod) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid invite code",
        });
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from("pod_members")
        .select("id")
        .eq("pod_id", pod.id)
        .eq("user_id", userId)
        .single();

      // Get member count
      const { count } = await supabase
        .from("pod_members")
        .select("*", { count: "exact", head: true })
        .eq("pod_id", pod.id);

      return {
        id: pod.id,
        name: pod.name,
        description: pod.description,
        memberCount: count || 0,
        maxMembers: pod.max_members,
        isActive: pod.is_active,
        createdAt: pod.created_at,
        isAlreadyMember: !!existingMember,
        isFull: (count || 0) >= pod.max_members,
      };
    }),

  /**
   * Leave a pod
   */
  leave: protectedProcedure
    .input(z.object({ podId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Check if user is the owner
      const { data: pod } = await supabase
        .from("pods")
        .select("created_by")
        .eq("id", input.podId)
        .single();

      if (pod?.created_by === userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Owners cannot leave their pods. Transfer ownership or delete the pod.",
        });
      }

      // Leave the pod
      const { error } = await supabase
        .from("pod_members")
        .delete()
        .eq("pod_id", input.podId)
        .eq("user_id", userId);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to leave pod",
          cause: error,
        });
      }

      // Log activity
      await supabase.from("pod_activities").insert({
        pod_id: input.podId,
        user_id: userId,
        activity_type: "member_left",
        metadata: {},
      });

      return { success: true };
    }),

  /**
   * Get member streaks for a pod
   * Story 5-4: View Pod Member Streaks
   */
  getMemberStreaks: protectedProcedure
    .input(z.object({ podId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Verify user is a member
      const { data: membership } = await supabase
        .from("pod_members")
        .select("id")
        .eq("pod_id", input.podId)
        .eq("user_id", userId)
        .single();

      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this pod",
        });
      }

      // Get all members
      const { data: members, error: membersError } = await supabase
        .from("pod_members")
        .select(
          `
          user_id,
          role,
          profiles:user_id (
            email,
            full_name,
            avatar_url
          )
        `
        )
        .eq("pod_id", input.podId);

      if (membersError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch members",
        });
      }

      // Get streaks for each member
      const memberStreaks = await Promise.all(
        (members || []).map(async (member) => {
          // Get user's habits first
          const { data: userHabits } = await supabase
            .from("habits")
            .select("id")
            .eq("user_id", member.user_id)
            .eq("is_active", true);

          const habitIds = userHabits?.map((h) => h.id) || [];
          let currentStreak = 0;
          let longestStreak = 0;
          const activeHabitsCount = habitIds.length;

          if (habitIds.length > 0) {
            const { data: habitStreaks } = await supabase
              .from("habit_streaks")
              .select("current_streak, longest_streak")
              .in("habit_id", habitIds);

            if (habitStreaks) {
              currentStreak = habitStreaks.reduce(
                (max, s) => Math.max(max, s.current_streak || 0),
                0
              );
              longestStreak = habitStreaks.reduce(
                (max, s) => Math.max(max, s.longest_streak || 0),
                0
              );
            }
          }

          // Get completions today
          const today = new Date().toISOString().split("T")[0];
          const { count: completedToday } = await supabase
            .from("habit_completions")
            .select("*", { count: "exact", head: true })
            .eq("user_id", member.user_id)
            .gte("completed_at", `${today}T00:00:00Z`)
            .lte("completed_at", `${today}T23:59:59Z`);

          const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;

          return {
            userId: member.user_id,
            role: member.role,
            email: profile?.email,
            fullName: profile?.full_name,
            avatarUrl: profile?.avatar_url,
            currentStreak,
            longestStreak,
            activeHabitsCount,
            completedToday: completedToday || 0,
          };
        })
      );

      // Sort by current streak (descending)
      memberStreaks.sort((a, b) => b.currentStreak - a.currentStreak);

      return memberStreaks;
    }),

  /**
   * Get pod activity feed
   * Story 5-5: Pod Activity Feed
   */
  getActivityFeed: protectedProcedure
    .input(
      z.object({
        podId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Verify user is a member
      const { data: membership } = await supabase
        .from("pod_members")
        .select("id")
        .eq("pod_id", input.podId)
        .eq("user_id", userId)
        .single();

      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this pod",
        });
      }

      // Get activities
      const {
        data: activities,
        error,
        count,
      } = await supabase
        .from("pod_activities")
        .select(
          `
          *,
          profiles:user_id (
            email,
            full_name,
            avatar_url
          )
        `,
          { count: "exact" }
        )
        .eq("pod_id", input.podId)
        .order("created_at", { ascending: false })
        .range(input.offset, input.offset + input.limit - 1);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch activities",
          cause: error,
        });
      }

      // Enrich activities with reference data
      const enrichedActivities = await Promise.all(
        (activities || []).map(async (activity) => {
          const profile = Array.isArray(activity.profiles)
            ? activity.profiles[0]
            : activity.profiles;

          let referenceName = null;

          if (activity.reference_type === "habit" && activity.reference_id) {
            const { data: habit } = await supabase
              .from("habits")
              .select("title")
              .eq("id", activity.reference_id)
              .single();
            referenceName = habit?.title;
          } else if (activity.reference_type === "badge" && activity.reference_id) {
            const { data: badge } = await supabase
              .from("badge_definitions")
              .select("name, icon")
              .eq("id", activity.reference_id)
              .single();
            referenceName = badge?.name;
          }

          return {
            id: activity.id,
            type: activity.activity_type,
            userId: activity.user_id,
            userEmail: profile?.email,
            userFullName: profile?.full_name,
            userAvatarUrl: profile?.avatar_url,
            referenceId: activity.reference_id,
            referenceType: activity.reference_type,
            referenceName,
            metadata: activity.metadata,
            createdAt: activity.created_at,
          };
        })
      );

      return {
        activities: enrichedActivities,
        total: count || 0,
        hasMore: (count || 0) > input.offset + input.limit,
      };
    }),

  /**
   * Get leaderboard for a pod
   * Story 5-6: Pod Streak Leaderboard
   */
  getLeaderboard: protectedProcedure
    .input(
      z.object({
        podId: z.string().uuid(),
        period: z.enum(["week", "month", "all"]).default("week"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Verify user is a member
      const { data: membership } = await supabase
        .from("pod_members")
        .select("id")
        .eq("pod_id", input.podId)
        .eq("user_id", userId)
        .single();

      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this pod",
        });
      }

      // Get all members
      const { data: members } = await supabase
        .from("pod_members")
        .select(
          `
          user_id,
          profiles:user_id (
            email,
            full_name,
            avatar_url
          )
        `
        )
        .eq("pod_id", input.podId);

      // Calculate date range
      const now = new Date();
      let startDate: Date;

      switch (input.period) {
        case "week":
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate = new Date(0); // All time
      }

      // Get completions for each member in the period
      const leaderboard = await Promise.all(
        (members || []).map(async (member) => {
          const { count: completions } = await supabase
            .from("habit_completions")
            .select("*", { count: "exact", head: true })
            .eq("user_id", member.user_id)
            .gte("completed_at", startDate.toISOString());

          const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;

          return {
            userId: member.user_id,
            email: profile?.email,
            fullName: profile?.full_name,
            avatarUrl: profile?.avatar_url,
            completions: completions || 0,
            isCurrentUser: member.user_id === userId,
          };
        })
      );

      // Sort by completions (descending) and add rank
      leaderboard.sort((a, b) => b.completions - a.completions);

      return leaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
    }),

  /**
   * Share a habit with pod
   */
  shareHabit: protectedProcedure
    .input(
      z.object({
        podId: z.string().uuid(),
        habitId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Verify user is a member
      const { data: membership } = await supabase
        .from("pod_members")
        .select("id")
        .eq("pod_id", input.podId)
        .eq("user_id", userId)
        .single();

      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this pod",
        });
      }

      // Verify habit belongs to user
      const { data: habit } = await supabase
        .from("habits")
        .select("id, title")
        .eq("id", input.habitId)
        .eq("user_id", userId)
        .single();

      if (!habit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Habit not found",
        });
      }

      // Share the habit
      const { error } = await supabase.from("pod_habits").insert({
        pod_id: input.podId,
        habit_id: input.habitId,
        shared_by: userId,
      });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This habit is already shared with this pod",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to share habit",
          cause: error,
        });
      }

      // Log activity
      await supabase.from("pod_activities").insert({
        pod_id: input.podId,
        user_id: userId,
        activity_type: "habit_shared",
        reference_id: input.habitId,
        reference_type: "habit",
        metadata: { habitTitle: habit.title },
      });

      return { success: true };
    }),

  /**
   * Unshare a habit from pod
   */
  unshareHabit: protectedProcedure
    .input(
      z.object({
        podId: z.string().uuid(),
        habitId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from("pod_habits")
        .delete()
        .eq("pod_id", input.podId)
        .eq("habit_id", input.habitId)
        .eq("shared_by", userId);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unshare habit",
          cause: error,
        });
      }

      return { success: true };
    }),
});
