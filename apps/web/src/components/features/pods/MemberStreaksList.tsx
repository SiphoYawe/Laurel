"use client";

import { motion } from "framer-motion";
import { Flame, TrendingUp, Award, Crown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * MemberStreaksList - Displays member streaks in a pod
 * Story 5-4: View Pod Member Streaks
 *
 * Features:
 * - Member avatars and names
 * - Current streak display
 * - Streak fire animation
 * - Top performer highlight
 */

interface MemberStreak {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: "owner" | "admin" | "member";
  currentStreak: number;
  longestStreak: number;
  completionsToday: number;
}

interface MemberStreaksListProps {
  members: MemberStreak[];
  isLoading?: boolean;
  className?: string;
}

export function MemberStreaksList({ members, isLoading, className }: MemberStreaksListProps) {
  // Sort by current streak descending
  const sortedMembers = [...members].sort((a, b) => b.currentStreak - a.currentStreak);
  const topStreak = sortedMembers[0]?.currentStreak || 0;

  if (isLoading) {
    return <MemberStreaksListSkeleton />;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Flame className="h-5 w-5 text-orange-500" />
          Member Streaks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedMembers.map((member, idx) => (
          <MemberStreakRow
            key={member.userId}
            isTop={idx === 0 && topStreak > 0}
            member={member}
            rank={idx + 1}
          />
        ))}

        {members.length === 0 && (
          <div className="text-muted-foreground py-8 text-center text-sm">No members yet</div>
        )}
      </CardContent>
    </Card>
  );
}

interface MemberStreakRowProps {
  member: MemberStreak;
  rank: number;
  isTop: boolean;
}

function MemberStreakRow({ member, rank, isTop }: MemberStreakRowProps) {
  const streakColor = getStreakColor(member.currentStreak);

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 transition-colors",
        isTop && member.currentStreak > 0
          ? "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
          : "hover:bg-muted/50"
      )}
      initial={{ opacity: 0, x: -10 }}
      transition={{ delay: rank * 0.05 }}
    >
      {/* Rank */}
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
          rank === 1 && member.currentStreak > 0
            ? "bg-amber-500 text-white"
            : rank === 2 && member.currentStreak > 0
              ? "bg-slate-400 text-white"
              : rank === 3 && member.currentStreak > 0
                ? "bg-amber-700 text-white"
                : "bg-muted text-muted-foreground"
        )}
      >
        {rank}
      </div>

      {/* Avatar */}
      <div className="relative">
        <div className="bg-muted flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-sm font-medium">
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
        {member.role === "owner" && (
          <div className="absolute -right-1 -top-1 rounded-full bg-amber-500 p-0.5">
            <Crown className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Name & Role */}
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate font-medium">{member.displayName || "Anonymous"}</p>
        <div className="flex items-center gap-2 text-xs">
          {member.completionsToday > 0 && (
            <span className="text-green-600 dark:text-green-400">
              {member.completionsToday} today
            </span>
          )}
          {member.longestStreak > 0 && (
            <span className="text-muted-foreground flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />
              Best: {member.longestStreak}
            </span>
          )}
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1.5">
        {member.currentStreak > 0 ? (
          <>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Flame className={cn("h-5 w-5", streakColor)} />
            </motion.div>
            <span className={cn("font-bold", streakColor)}>{member.currentStreak}</span>
          </>
        ) : (
          <span className="text-muted-foreground text-sm">No streak</span>
        )}
      </div>

      {/* Top Badge */}
      {isTop && member.currentStreak > 0 && <Award className="h-5 w-5 text-amber-500" />}
    </motion.div>
  );
}

function getStreakColor(streak: number): string {
  if (streak >= 30) return "text-purple-500";
  if (streak >= 21) return "text-blue-500";
  if (streak >= 14) return "text-green-500";
  if (streak >= 7) return "text-orange-500";
  return "text-red-500";
}

function MemberStreaksListSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="bg-muted h-5 w-32 animate-pulse rounded" />
      </CardHeader>
      <CardContent className="space-y-2">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="flex items-center gap-3 p-3">
            <div className="bg-muted h-6 w-6 animate-pulse rounded-full" />
            <div className="bg-muted h-10 w-10 animate-pulse rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="bg-muted h-4 w-24 animate-pulse rounded" />
              <div className="bg-muted h-3 w-16 animate-pulse rounded" />
            </div>
            <div className="bg-muted h-5 w-12 animate-pulse rounded" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * CompactMemberStreaks - Smaller version for pod list
 */
interface CompactMemberStreaksProps {
  members: MemberStreak[];
  maxDisplay?: number;
  className?: string;
}

export function CompactMemberStreaks({
  members,
  maxDisplay = 3,
  className,
}: CompactMemberStreaksProps) {
  const sortedMembers = [...members].sort((a, b) => b.currentStreak - a.currentStreak);
  const topMembers = sortedMembers.slice(0, maxDisplay);
  const remaining = sortedMembers.length - maxDisplay;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex -space-x-2">
        {topMembers.map((member, idx) => (
          <div
            key={member.userId}
            className="border-background bg-muted relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 text-xs font-medium"
            style={{ zIndex: maxDisplay - idx }}
            title={`${member.displayName}: ${member.currentStreak} day streak`}
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
            {member.currentStreak > 0 && (
              <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-orange-500 px-1 py-0.5 text-[8px] font-bold text-white">
                {member.currentStreak}
              </div>
            )}
          </div>
        ))}
      </div>
      {remaining > 0 && <span className="text-muted-foreground text-xs">+{remaining} more</span>}
    </div>
  );
}
