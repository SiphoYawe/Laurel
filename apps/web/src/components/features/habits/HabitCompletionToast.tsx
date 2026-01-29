"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, AlertCircle, Wifi, WifiOff, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * HabitCompletionToast - Specialized toast components for habit completions
 * Story 3-1: One-Tap Habit Completion
 */

interface SuccessToastContentProps {
  habitTitle: string;
  newStreak: number;
  previousStreak: number;
  onUndo?: () => void;
  undoTimeRemaining?: number;
}

export function SuccessToastContent({
  habitTitle,
  newStreak,
  previousStreak,
  onUndo,
  undoTimeRemaining,
}: SuccessToastContentProps) {
  const shouldReduceMotion = useReducedMotion();
  const streakIncreased = newStreak > previousStreak;

  return (
    <div className="flex items-center gap-3">
      {/* Success icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        >
          <Check className="h-5 w-5" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-green-900">{habitTitle} completed!</p>
        <div className="flex items-center gap-2 text-sm text-green-700">
          <span>Streak:</span>
          {streakIncreased ? (
            <motion.span
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: [1, 1.2, 1],
                      textShadow: [
                        "0 0 0px rgb(34 197 94)",
                        "0 0 8px rgb(34 197 94)",
                        "0 0 0px rgb(34 197 94)",
                      ],
                    }
              }
              className="font-bold"
              transition={{ duration: 0.4 }}
            >
              {newStreak} days
            </motion.span>
          ) : (
            <span className="font-bold">{newStreak} days</span>
          )}
          {newStreak >= 7 && <span>🔥</span>}
        </div>
      </div>

      {/* Undo button */}
      {onUndo && (
        <button
          className="shrink-0 rounded-md border border-green-300 px-3 py-1 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
          onClick={onUndo}
        >
          Undo
          {undoTimeRemaining && undoTimeRemaining > 0 && (
            <span className="ml-1 text-xs opacity-75">({undoTimeRemaining}s)</span>
          )}
        </button>
      )}
    </div>
  );
}

interface ErrorToastContentProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorToastContent({ message, onRetry }: ErrorToastContentProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Error icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
        <AlertCircle className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-red-900">Couldn&apos;t save</p>
        <p className="text-sm text-red-700">{message}</p>
      </div>

      {/* Retry button */}
      {onRetry && (
        <button
          className="flex shrink-0 items-center gap-1 rounded-md border border-red-300 px-3 py-1 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
          onClick={onRetry}
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      )}
    </div>
  );
}

interface OfflineToastContentProps {
  habitTitle: string;
  queuePosition?: number;
}

export function OfflineToastContent({ habitTitle, queuePosition }: OfflineToastContentProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Offline icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
        <WifiOff className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-amber-900">Saved offline</p>
        <p className="text-sm text-amber-700">
          {habitTitle} will sync when you&apos;re back online
          {queuePosition && queuePosition > 1 && ` (${queuePosition} items queued)`}
        </p>
      </div>
    </div>
  );
}

interface SyncToastContentProps {
  itemsSynced: number;
  totalItems: number;
}

export function SyncToastContent({ itemsSynced, totalItems }: SyncToastContentProps) {
  const allSynced = itemsSynced === totalItems;

  return (
    <div className="flex items-center gap-3">
      {/* Sync icon */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white",
          allSynced ? "bg-green-500" : "bg-blue-500"
        )}
      >
        {allSynced ? (
          <Wifi className="h-5 w-5" />
        ) : (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="h-5 w-5" />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className={cn("font-medium", allSynced ? "text-green-900" : "text-blue-900")}>
          {allSynced ? "All synced!" : "Syncing..."}
        </p>
        <p className={cn("text-sm", allSynced ? "text-green-700" : "text-blue-700")}>
          {itemsSynced} of {totalItems} completions synced
        </p>
      </div>
    </div>
  );
}

/**
 * Streak Milestone Toast - shown when hitting streak milestones
 */
interface StreakMilestoneToastProps {
  milestone: number;
}

export function StreakMilestoneToast({ milestone }: StreakMilestoneToastProps) {
  const shouldReduceMotion = useReducedMotion();

  const getMilestoneEmoji = (days: number): string => {
    if (days >= 365) return "🏆";
    if (days >= 90) return "👑";
    if (days >= 30) return "🌟";
    if (days >= 14) return "🔥";
    if (days >= 7) return "⭐";
    return "🎉";
  };

  const getMilestoneMessage = (days: number): string => {
    if (days >= 365) return "One year streak! You're a champion!";
    if (days >= 90) return "90 days! Habits are now automatic!";
    if (days >= 30) return "30 days! You've built a real habit!";
    if (days >= 14) return "Two weeks strong!";
    if (days >= 7) return "One week! You're building momentum!";
    return `${days} day streak!`;
  };

  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              }
        }
        className="text-3xl"
        transition={{ duration: 0.5, repeat: 2 }}
      >
        {getMilestoneEmoji(milestone)}
      </motion.div>

      <div className="min-w-0 flex-1">
        <p className="font-bold text-amber-900">{milestone} Day Streak!</p>
        <p className="text-sm text-amber-700">{getMilestoneMessage(milestone)}</p>
      </div>
    </div>
  );
}
