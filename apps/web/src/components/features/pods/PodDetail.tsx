"use client";

import { motion } from "framer-motion";
import {
  Users,
  Crown,
  Copy,
  Check,
  Settings,
  LogOut,
  Share2,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { MemberStreaksList } from "./MemberStreaksList";
import { PodActivityFeed } from "./PodActivityFeed";
import { PodLeaderboard } from "./PodLeaderboard";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * PodDetail - Full pod view with all features
 * Story 5-4, 5-5, 5-6: Pod details, activity, leaderboard
 *
 * Features:
 * - Pod info header
 * - Member streaks
 * - Activity feed
 * - Leaderboard
 * - Share habit modal
 */

interface PodMember {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: "owner" | "admin" | "member";
}

interface Pod {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string;
  createdBy: string;
  maxMembers: number;
  isActive: boolean;
  createdAt: string;
  members: PodMember[];
  sharedHabits?: Array<{
    habitId: string;
    habitName: string;
    sharedBy: string;
  }>;
}

interface MemberStreak {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: "owner" | "admin" | "member";
  currentStreak: number;
  longestStreak: number;
  completionsToday: number;
}

type ActivityType =
  | "habit_completed"
  | "streak_milestone"
  | "badge_earned"
  | "member_joined"
  | "member_left"
  | "habit_shared";

interface PodActivity {
  id: string;
  podId: string;
  userId: string;
  activityType: ActivityType;
  referenceId: string | null;
  referenceType: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  user?: {
    displayName: string | null;
    avatarUrl: string | null;
  };
  habitName?: string;
  badgeName?: string;
}

interface LeaderboardEntry {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
}

interface PodDetailProps {
  pod: Pod;
  memberStreaks: MemberStreak[];
  activities: PodActivity[];
  leaderboard: LeaderboardEntry[];
  currentUserId: string;
  isOwner: boolean;
  isLoadingStreaks?: boolean;
  isLoadingActivity?: boolean;
  isLoadingLeaderboard?: boolean;
  onLeavePod: () => Promise<void>;
  isLeaving?: boolean;
  className?: string;
}

export function PodDetail({
  pod,
  memberStreaks,
  activities,
  leaderboard,
  currentUserId,
  isOwner,
  isLoadingStreaks,
  isLoadingActivity,
  isLoadingLeaderboard,
  onLeavePod,
  isLeaving,
  className,
}: PodDetailProps) {
  const [copied, setCopied] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<"week" | "month" | "all">("week");

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(pod.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API failed
    }
  };

  const handleLeavePod = async () => {
    await onLeavePod();
    setShowLeaveConfirm(false);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Back Button */}
      <Link
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
        href="/pods"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Pods
      </Link>

      {/* Pod Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-laurel-sage/20 flex h-14 w-14 items-center justify-center rounded-xl">
                <Users className="text-laurel-forest h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-foreground text-2xl font-bold">{pod.name}</h1>
                  {isOwner && (
                    <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      <Crown className="h-3 w-3" />
                      Owner
                    </div>
                  )}
                </div>
                {pod.description && <p className="text-muted-foreground mt-1">{pod.description}</p>}
                <p className="text-muted-foreground mt-2 text-sm">
                  {pod.members.length}/{pod.maxMembers} members · Created{" "}
                  {new Date(pod.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Invite Code */}
              <button
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "bg-muted hover:bg-muted/80",
                  copied && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                )}
                type="button"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {pod.inviteCode}
                  </>
                )}
              </button>

              {isOwner ? (
                <button
                  className="text-muted-foreground hover:bg-muted rounded-lg p-2 transition-colors"
                  type="button"
                >
                  <Settings className="h-5 w-5" />
                </button>
              ) : (
                <button
                  className="text-muted-foreground rounded-lg p-2 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  type="button"
                  onClick={() => setShowLeaveConfirm(true)}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Members Avatars */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex -space-x-2">
              {pod.members.slice(0, 8).map((member, idx) => (
                <div
                  key={member.userId}
                  className={cn(
                    "border-background bg-muted relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 text-sm font-medium",
                    member.role === "owner" && "ring-2 ring-amber-500"
                  )}
                  style={{ zIndex: 8 - idx }}
                  title={`${member.displayName || "Member"} (${member.role})`}
                >
                  {member.avatarUrl ? (
                    <img
                      alt={member.displayName || "Member"}
                      className="h-full w-full object-cover"
                      src={member.avatarUrl}
                    />
                  ) : (
                    (member.displayName?.[0] || "?").toUpperCase()
                  )}
                </div>
              ))}
              {pod.members.length > 8 && (
                <div className="border-background bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium">
                  +{pod.members.length - 8}
                </div>
              )}
            </div>
            <span className="text-muted-foreground text-sm">
              {pod.members.length} member{pod.members.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Shared Habits */}
      {pod.sharedHabits && pod.sharedHabits.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-foreground mb-3 flex items-center gap-2 font-semibold">
              <Share2 className="h-5 w-5 text-blue-500" />
              Shared Habits
            </h3>
            <div className="flex flex-wrap gap-2">
              {pod.sharedHabits.map((habit) => (
                <div key={habit.habitId} className="bg-muted rounded-full px-3 py-1 text-sm">
                  {habit.habitName}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Member Streaks */}
        <MemberStreaksList isLoading={isLoadingStreaks} members={memberStreaks} />

        {/* Leaderboard */}
        <PodLeaderboard
          currentUserId={currentUserId}
          entries={leaderboard}
          isLoading={isLoadingLeaderboard}
          period={leaderboardPeriod}
          onPeriodChange={setLeaderboardPeriod}
        />
      </div>

      {/* Activity Feed */}
      <PodActivityFeed activities={activities} isLoading={isLoadingActivity} maxItems={30} />

      {/* Leave Confirmation Modal */}
      {showLeaveConfirm && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={() => setShowLeaveConfirm(false)}
        >
          <motion.div
            animate={{ scale: 1, y: 0 }}
            className="bg-card border-border w-full max-w-sm rounded-2xl border p-6 shadow-xl"
            exit={{ scale: 0.95, y: 20 }}
            initial={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-foreground text-lg font-semibold">Leave Pod?</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Are you sure you want to leave &quot;{pod.name}&quot;? You&apos;ll need an invite code
              to rejoin.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                className="text-muted-foreground hover:bg-muted flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                disabled={isLeaving}
                type="button"
                onClick={() => setShowLeaveConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors",
                  "hover:bg-red-700",
                  "disabled:cursor-not-allowed disabled:opacity-60"
                )}
                disabled={isLeaving}
                type="button"
                onClick={handleLeavePod}
              >
                {isLeaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Leaving...
                  </>
                ) : (
                  "Leave Pod"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
