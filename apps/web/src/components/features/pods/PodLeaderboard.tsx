"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp, Flame } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * PodLeaderboard - Displays ranked members by various metrics
 * Story 5-6: Pod Streak Leaderboard
 *
 * Features:
 * - Time period toggle (week/month/all)
 * - Multiple ranking metrics
 * - Trophy animations
 * - Position highlighting
 */

type LeaderboardPeriod = "week" | "month" | "all";

interface LeaderboardEntry {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
}

interface PodLeaderboardProps {
  entries: LeaderboardEntry[];
  period: LeaderboardPeriod;
  onPeriodChange?: (period: LeaderboardPeriod) => void;
  isLoading?: boolean;
  currentUserId?: string;
  className?: string;
}

export function PodLeaderboard({
  entries,
  period,
  onPeriodChange,
  isLoading,
  currentUserId,
  className,
}: PodLeaderboardProps) {
  const [metric, setMetric] = useState<"completions" | "streak">("completions");

  // Sort by selected metric
  const sortedEntries = [...entries].sort((a, b) => {
    if (metric === "streak") {
      return b.currentStreak - a.currentStreak;
    }
    return b.totalCompletions - a.totalCompletions;
  });

  if (isLoading) {
    return <PodLeaderboardSkeleton />;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5 text-amber-500" />
            Leaderboard
          </CardTitle>
          {onPeriodChange && (
            <div className="bg-muted flex rounded-lg p-1">
              {(["week", "month", "all"] as LeaderboardPeriod[]).map((p) => (
                <button
                  key={p}
                  className={cn(
                    "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                    period === p
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  type="button"
                  onClick={() => onPeriodChange(p)}
                >
                  {p === "week" ? "Week" : p === "month" ? "Month" : "All Time"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Metric Toggle */}
        <div className="mt-3 flex gap-2">
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              metric === "completions"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
            type="button"
            onClick={() => setMetric("completions")}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Completions
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              metric === "streak"
                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
            type="button"
            onClick={() => setMetric("streak")}
          >
            <Flame className="h-3.5 w-3.5" />
            Streak
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {sortedEntries.map((entry, idx) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              isCurrentUser={entry.userId === currentUserId}
              metric={metric}
              rank={idx + 1}
            />
          ))}

          {entries.length === 0 && (
            <div className="text-muted-foreground py-8 text-center text-sm">
              No data yet. Complete habits to appear on the leaderboard!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
  metric: "completions" | "streak";
  isCurrentUser: boolean;
}

function LeaderboardRow({ entry, rank, metric, isCurrentUser }: LeaderboardRowProps) {
  const value = metric === "streak" ? entry.currentStreak : entry.totalCompletions;

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 transition-colors",
        isCurrentUser ? "bg-laurel-sage/20 ring-laurel-forest/20 ring-2" : "hover:bg-muted/50"
      )}
      initial={{ opacity: 0, x: -10 }}
      transition={{ delay: rank * 0.05 }}
    >
      {/* Rank Badge */}
      <div className="flex h-8 w-8 items-center justify-center">
        {rank === 1 ? (
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="h-6 w-6 text-amber-500" />
          </motion.div>
        ) : rank === 2 ? (
          <Medal className="h-6 w-6 text-slate-400" />
        ) : rank === 3 ? (
          <Medal className="h-6 w-6 text-amber-700" />
        ) : (
          <span className="text-muted-foreground text-sm font-bold">{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className="relative">
        <div className="bg-muted flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-sm font-medium">
          {entry.avatarUrl ? (
            <img
              alt={entry.displayName || "Member"}
              className="h-full w-full object-cover"
              src={entry.avatarUrl}
            />
          ) : (
            (entry.displayName?.[0] || "?").toUpperCase()
          )}
        </div>
        {rank === 1 && value > 0 && (
          <div className="absolute -right-1 -top-1 rounded-full bg-amber-500 p-0.5">
            <Crown className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Name */}
      <div className="min-w-0 flex-1">
        <p className={cn("truncate font-medium", isCurrentUser && "text-laurel-forest")}>
          {entry.displayName || "Anonymous"}
          {isCurrentUser && <span className="text-muted-foreground ml-1 text-xs">(You)</span>}
        </p>
        <p className="text-muted-foreground text-xs">
          {metric === "streak"
            ? `${entry.totalCompletions} completions`
            : `${entry.currentStreak} day streak`}
        </p>
      </div>

      {/* Value */}
      <div className="text-right">
        <p
          className={cn(
            "text-lg font-bold",
            rank === 1 && value > 0
              ? "text-amber-500"
              : rank === 2 && value > 0
                ? "text-slate-400"
                : rank === 3 && value > 0
                  ? "text-amber-700"
                  : "text-foreground"
          )}
        >
          {value}
        </p>
        <p className="text-muted-foreground text-xs">{metric === "streak" ? "days" : "total"}</p>
      </div>
    </motion.div>
  );
}

function PodLeaderboardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="bg-muted h-5 w-28 animate-pulse rounded" />
          <div className="bg-muted h-8 w-40 animate-pulse rounded-lg" />
        </div>
        <div className="mt-3 flex gap-2">
          <div className="bg-muted h-8 w-28 animate-pulse rounded-lg" />
          <div className="bg-muted h-8 w-20 animate-pulse rounded-lg" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((idx) => (
            <div key={idx} className="flex items-center gap-3 p-3">
              <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
              <div className="bg-muted h-10 w-10 animate-pulse rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                <div className="bg-muted h-3 w-16 animate-pulse rounded" />
              </div>
              <div className="space-y-1 text-right">
                <div className="bg-muted h-6 w-8 animate-pulse rounded" />
                <div className="bg-muted h-3 w-10 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
