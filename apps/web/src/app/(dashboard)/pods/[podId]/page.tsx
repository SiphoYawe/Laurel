"use client";

import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { PodDetail } from "@/components/features/pods";
import { usePod, usePods } from "@/hooks/usePods";
import { useAuth } from "@/lib/supabase/auth-context";

/**
 * Pod Detail Page
 * Story 5-4, 5-5, 5-6: View pod details, activity, and leaderboard
 */
export default function PodDetailPage() {
  const params = useParams();
  const router = useRouter();
  const podId = params.podId as string;

  const { user } = useAuth();
  const { leavePod, isLeaving } = usePods();
  const {
    pod,
    isLoadingPod,
    memberStreaks,
    isLoadingStreaks,
    activities,
    isLoadingActivity,
    leaderboard,
    isLoadingLeaderboard,
  } = usePod(podId);

  const handleLeavePod = async () => {
    await leavePod(podId);
    router.push("/pods");
  };

  if (isLoadingPod) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!pod) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <h2 className="text-foreground text-xl font-semibold">Pod not found</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          This pod may have been deleted or you don&apos;t have access.
        </p>
        <button
          className="bg-laurel-forest hover:bg-laurel-forest/90 mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          type="button"
          onClick={() => router.push("/pods")}
        >
          Back to Pods
        </button>
      </div>
    );
  }

  const isOwner = pod.isOwner;

  // Transform member streaks to match component interface
  const formattedMemberStreaks = memberStreaks.map((member) => ({
    userId: member.userId,
    displayName: member.fullName || member.email?.split("@")[0] || null,
    avatarUrl: member.avatarUrl,
    role: member.role as "owner" | "admin" | "member",
    currentStreak: member.currentStreak || 0,
    longestStreak: member.longestStreak || 0,
    completionsToday: member.completedToday || 0,
  }));

  // Transform leaderboard to match component interface
  const formattedLeaderboard = leaderboard.map((entry) => ({
    userId: entry.userId,
    displayName: entry.fullName || entry.email?.split("@")[0] || null,
    avatarUrl: entry.avatarUrl,
    totalCompletions: entry.completions || 0,
    currentStreak: 0, // Not provided by leaderboard endpoint
    longestStreak: 0, // Not provided by leaderboard endpoint
    rank: entry.rank,
  }));

  // Transform activities to match component interface
  const formattedActivities = activities.map((activity) => ({
    id: activity.id,
    podId: podId,
    userId: activity.userId,
    activityType: activity.type as
      | "habit_completed"
      | "streak_milestone"
      | "badge_earned"
      | "member_joined"
      | "member_left"
      | "habit_shared",
    referenceId: activity.referenceId,
    referenceType: activity.referenceType,
    metadata: activity.metadata || {},
    createdAt: activity.createdAt,
    user: {
      displayName: activity.userFullName || activity.userEmail?.split("@")[0] || null,
      avatarUrl: activity.userAvatarUrl,
    },
    habitName: activity.referenceType === "habit" ? activity.referenceName : undefined,
    badgeName: activity.referenceType === "badge" ? activity.referenceName : undefined,
  }));

  // Transform pod members
  const formattedMembers = (pod.members || []).map((member) => ({
    userId: member.userId,
    displayName: member.fullName || member.email?.split("@")[0] || null,
    avatarUrl: member.avatarUrl,
    role: member.role as "owner" | "admin" | "member",
  }));

  return (
    <PodDetail
      activities={formattedActivities}
      currentUserId={user?.id || ""}
      isLeaving={isLeaving}
      isLoadingActivity={isLoadingActivity}
      isLoadingLeaderboard={isLoadingLeaderboard}
      isLoadingStreaks={isLoadingStreaks}
      isOwner={isOwner}
      leaderboard={formattedLeaderboard}
      memberStreaks={formattedMemberStreaks}
      pod={{
        id: pod.id,
        name: pod.name,
        description: pod.description,
        inviteCode: pod.inviteCode,
        createdBy: user?.id || "", // Not directly available, but isOwner tells us
        maxMembers: pod.maxMembers,
        isActive: true, // Only active pods can be viewed
        createdAt: pod.createdAt,
        members: formattedMembers,
      }}
      onLeavePod={handleLeavePod}
    />
  );
}
