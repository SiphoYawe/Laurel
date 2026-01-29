"use client";

import { useCallback } from "react";

import { trpc } from "@/lib/trpc/client";

/**
 * usePods - Hook for pod management and data
 * Stories 5-1 through 5-7: Accountability Pods
 */

export function usePods() {
  // List user's pods
  const { data: pods, isLoading: isLoadingPods, refetch: refetchPods } = trpc.pods.list.useQuery();

  // Mutations
  const createMutation = trpc.pods.create.useMutation({
    onSuccess: () => {
      refetchPods();
    },
  });

  const joinMutation = trpc.pods.join.useMutation({
    onSuccess: () => {
      refetchPods();
    },
  });

  const leaveMutation = trpc.pods.leave.useMutation({
    onSuccess: () => {
      refetchPods();
    },
  });

  // Actions
  const createPod = useCallback(
    async (name: string, description?: string, maxMembers?: number) => {
      return createMutation.mutateAsync({
        name,
        description,
        maxMembers: maxMembers || 10,
      });
    },
    [createMutation]
  );

  const joinPod = useCallback(
    async (inviteCode: string) => {
      return joinMutation.mutateAsync({ inviteCode: inviteCode.toUpperCase() });
    },
    [joinMutation]
  );

  const leavePod = useCallback(
    async (podId: string) => {
      return leaveMutation.mutateAsync({ podId });
    },
    [leaveMutation]
  );

  return {
    pods: pods || [],
    isLoadingPods,
    refetchPods,
    createPod,
    joinPod,
    leavePod,
    isCreating: createMutation.isPending,
    isJoining: joinMutation.isPending,
    isLeaving: leaveMutation.isPending,
  };
}

/**
 * usePod - Hook for single pod data and actions
 */
export function usePod(podId: string) {
  const _utils = trpc.useUtils();

  // Pod details
  const {
    data: pod,
    isLoading: isLoadingPod,
    refetch: refetchPod,
  } = trpc.pods.getById.useQuery({ podId }, { enabled: !!podId });

  // Member streaks
  const {
    data: memberStreaks,
    isLoading: isLoadingStreaks,
    refetch: refetchStreaks,
  } = trpc.pods.getMemberStreaks.useQuery({ podId }, { enabled: !!podId });

  // Activity feed
  const {
    data: activityData,
    isLoading: isLoadingActivity,
    refetch: refetchActivity,
  } = trpc.pods.getActivityFeed.useQuery({ podId, limit: 50 }, { enabled: !!podId });

  // Leaderboard
  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    refetch: refetchLeaderboard,
  } = trpc.pods.getLeaderboard.useQuery({ podId, period: "week" }, { enabled: !!podId });

  // Share habit mutation
  const shareHabitMutation = trpc.pods.shareHabit.useMutation({
    onSuccess: () => {
      refetchPod();
    },
  });

  // Unshare habit mutation
  const unshareHabitMutation = trpc.pods.unshareHabit.useMutation({
    onSuccess: () => {
      refetchPod();
    },
  });

  const shareHabit = useCallback(
    async (habitId: string) => {
      return shareHabitMutation.mutateAsync({ podId, habitId });
    },
    [podId, shareHabitMutation]
  );

  const unshareHabit = useCallback(
    async (habitId: string) => {
      return unshareHabitMutation.mutateAsync({ podId, habitId });
    },
    [podId, unshareHabitMutation]
  );

  const refetchAll = useCallback(() => {
    refetchPod();
    refetchStreaks();
    refetchActivity();
    refetchLeaderboard();
  }, [refetchPod, refetchStreaks, refetchActivity, refetchLeaderboard]);

  return {
    pod,
    isLoadingPod,
    memberStreaks: memberStreaks || [],
    isLoadingStreaks,
    activities: activityData?.activities || [],
    activityTotal: activityData?.total || 0,
    isLoadingActivity,
    leaderboard: leaderboard || [],
    isLoadingLeaderboard,
    shareHabit,
    unshareHabit,
    isSharingHabit: shareHabitMutation.isPending,
    refetch: refetchAll,
  };
}

/**
 * usePodPreview - Hook for previewing a pod before joining
 */
export function usePodPreview(inviteCode: string | null) {
  const {
    data: preview,
    isLoading,
    error,
  } = trpc.pods.preview.useQuery(
    { inviteCode: inviteCode?.toUpperCase() || "" },
    { enabled: !!inviteCode && inviteCode.length === 6 }
  );

  return {
    preview,
    isLoading,
    error,
    isValid: !error && !!preview,
    canJoin: preview && !preview.isAlreadyMember && !preview.isFull && preview.isActive,
  };
}
