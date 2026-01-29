"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * StreakDisplay - Prominent streak number display
 * Story 3-2: Streak Tracking and Display
 *
 * Features:
 * - Large, prominent streak number
 * - Fire emoji with animation
 * - "Best: X days" secondary text
 * - At-risk indicator
 * - Responsive sizing
 */

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  isAtRisk?: boolean;
  isCompletedToday?: boolean;
  size?: "sm" | "md" | "lg" | "hero";
  showBest?: boolean;
  showStatus?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  sm: {
    number: "text-xl",
    emoji: "text-base",
    best: "text-xs",
    status: "text-xs",
    gap: "gap-1",
  },
  md: {
    number: "text-3xl",
    emoji: "text-xl",
    best: "text-sm",
    status: "text-sm",
    gap: "gap-1.5",
  },
  lg: {
    number: "text-4xl",
    emoji: "text-2xl",
    best: "text-base",
    status: "text-base",
    gap: "gap-2",
  },
  hero: {
    number: "text-6xl",
    emoji: "text-4xl",
    best: "text-lg",
    status: "text-lg",
    gap: "gap-3",
  },
};

export function StreakDisplay({
  currentStreak,
  longestStreak,
  isAtRisk = false,
  isCompletedToday = false,
  size = "md",
  showBest = true,
  showStatus = false,
  className,
}: StreakDisplayProps) {
  const shouldReduceMotion = useReducedMotion();
  const config = SIZE_CONFIG[size];

  const getStatusText = () => {
    if (isCompletedToday) return "Completed today!";
    if (isAtRisk) return "(at risk)";
    if (currentStreak === 0) return "Start your streak!";
    return "";
  };

  const statusText = getStatusText();

  return (
    <div className={cn("flex flex-col items-center", config.gap, className)}>
      {/* Main streak number with fire emoji */}
      <div className="flex items-center gap-2">
        {currentStreak > 0 && (
          <motion.span
            animate={
              shouldReduceMotion || !isCompletedToday
                ? {}
                : {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }
            }
            className={config.emoji}
            transition={{ duration: 0.5 }}
          >
            🔥
          </motion.span>
        )}

        <motion.span
          key={currentStreak}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "font-bold tabular-nums",
            config.number,
            isAtRisk && !isCompletedToday
              ? "text-warm-amber"
              : currentStreak >= 7
                ? "text-forest-green"
                : "text-foreground"
          )}
          initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {currentStreak}
        </motion.span>

        <span
          className={cn(
            "text-muted-foreground",
            config.number === "text-6xl" ? "text-2xl" : "text-base"
          )}
        >
          day{currentStreak !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Status indicator */}
      {showStatus && statusText && (
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            config.status,
            "font-medium",
            isAtRisk && !isCompletedToday
              ? "text-warm-amber"
              : isCompletedToday
                ? "text-green-600"
                : "text-muted-foreground"
          )}
          initial={{ opacity: 0, y: -5 }}
        >
          {statusText}
        </motion.span>
      )}

      {/* Best streak */}
      {showBest && longestStreak > 0 && (
        <span className={cn("text-muted-foreground", config.best)}>
          Best: {longestStreak} day{longestStreak !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}

/**
 * Compact inline streak display
 */
interface CompactStreakProps {
  currentStreak: number;
  isAtRisk?: boolean;
  className?: string;
}

export function CompactStreak({ currentStreak, isAtRisk = false, className }: CompactStreakProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isAtRisk ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700",
        className
      )}
    >
      {currentStreak > 0 && <span>🔥</span>}
      <span>{currentStreak}</span>
    </div>
  );
}

/**
 * Streak badge for milestone achievements
 */
interface StreakBadgeProps {
  milestone: number;
  achieved?: boolean;
  className?: string;
}

const MILESTONE_CONFIG: Record<number, { name: string; emoji: string; color: string }> = {
  7: { name: "Week Warrior", emoji: "🥉", color: "bg-orange-100 text-orange-800" },
  14: { name: "Fortnight Fighter", emoji: "🥈", color: "bg-gray-100 text-gray-800" },
  30: { name: "Monthly Master", emoji: "🥇", color: "bg-amber-100 text-amber-800" },
  66: { name: "Habit Hero", emoji: "👑", color: "bg-purple-100 text-purple-800" },
  100: { name: "Century Champion", emoji: "💎", color: "bg-blue-100 text-blue-800" },
  180: { name: "Half-Year Hero", emoji: "🏆", color: "bg-emerald-100 text-emerald-800" },
  365: { name: "Annual Champion", emoji: "🌟", color: "bg-yellow-100 text-yellow-800" },
};

export function StreakBadge({ milestone, achieved = true, className }: StreakBadgeProps) {
  const config = MILESTONE_CONFIG[milestone];
  if (!config) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        achieved ? config.color : "bg-gray-100 text-gray-400",
        className
      )}
    >
      <span className={cn(!achieved && "grayscale")}>{config.emoji}</span>
      <span>{config.name}</span>
    </div>
  );
}
