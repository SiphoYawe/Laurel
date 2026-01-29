"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * StreakMilestone - Milestone celebration and badge display
 * Story 3-2: Streak Tracking and Display
 */

// Milestone metadata
const MILESTONE_INFO: Record<
  number,
  { name: string; emoji: string; color: string; description: string }
> = {
  7: {
    name: "Week Warrior",
    emoji: "🥉",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    description: "One full week of consistency!",
  },
  14: {
    name: "Fortnight Fighter",
    emoji: "🥈",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    description: "Two weeks strong!",
  },
  30: {
    name: "Monthly Master",
    emoji: "🥇",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    description: "A full month of dedication!",
  },
  66: {
    name: "Habit Hero",
    emoji: "👑",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    description: "66 days - habit officially formed!",
  },
  100: {
    name: "Century Champion",
    emoji: "💎",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    description: "100 days of excellence!",
  },
  180: {
    name: "Half-Year Hero",
    emoji: "🏆",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Six months of transformation!",
  },
  365: {
    name: "Annual Champion",
    emoji: "🌟",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    description: "One full year - legendary!",
  },
};

interface StreakMilestoneProps {
  milestone: number;
  achieved?: boolean;
  showDescription?: boolean;
  variant?: "badge" | "card" | "celebration";
  className?: string;
}

export function StreakMilestone({
  milestone,
  achieved = true,
  showDescription = false,
  variant = "badge",
  className,
}: StreakMilestoneProps) {
  const info = MILESTONE_INFO[milestone];
  if (!info) return null;

  if (variant === "celebration") {
    return (
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "flex flex-col items-center gap-4 rounded-xl border-2 p-6 text-center",
          achieved ? info.color : "border-gray-200 bg-gray-100 text-gray-400",
          className
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.span
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
          className={cn("text-5xl", !achieved && "grayscale")}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {info.emoji}
        </motion.span>
        <div>
          <h3 className="text-xl font-bold">{info.name}</h3>
          <p className="mt-1 text-sm opacity-80">{info.description}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2">
          <span className="text-2xl font-bold">{milestone}</span>
          <span className="text-sm">days</span>
        </div>
      </motion.div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border p-3",
          achieved ? info.color : "border-gray-200 bg-gray-50 text-gray-400",
          className
        )}
      >
        <span className={cn("text-2xl", !achieved && "grayscale")}>{info.emoji}</span>
        <div className="flex-1">
          <p className="font-medium">{info.name}</p>
          {showDescription && <p className="text-xs opacity-70">{info.description}</p>}
        </div>
        <span className="text-lg font-bold">{milestone}d</span>
      </div>
    );
  }

  // Default: badge variant
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium",
        achieved ? info.color : "border-gray-200 bg-gray-100 text-gray-400",
        className
      )}
    >
      <span className={cn(!achieved && "grayscale")}>{info.emoji}</span>
      <span>{info.name}</span>
    </div>
  );
}

/**
 * MilestoneProgress - Shows progress toward next milestone
 */
interface MilestoneProgressProps {
  currentStreak: number;
  nextMilestone: number;
  progress: number;
  className?: string;
}

export function MilestoneProgress({
  currentStreak,
  nextMilestone,
  progress,
  className,
}: MilestoneProgressProps) {
  const nextInfo = MILESTONE_INFO[nextMilestone];
  const daysRemaining = nextMilestone - currentStreak;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} to{" "}
          {nextInfo ? nextInfo.name : `${nextMilestone} days`}
        </span>
        {nextInfo && <span>{nextInfo.emoji}</span>}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <motion.div
          animate={{ width: `${progress * 100}%` }}
          className="bg-forest-green h-full rounded-full"
          initial={{ width: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="text-muted-foreground flex justify-between text-xs">
        <span>{currentStreak} days</span>
        <span>{nextMilestone} days</span>
      </div>
    </div>
  );
}

/**
 * MilestoneList - Display all milestones with achievement status
 */
interface MilestoneListProps {
  currentStreak: number;
  className?: string;
}

const MILESTONES = [7, 14, 30, 66, 100, 180, 365] as const;

export function MilestoneList({ currentStreak, className }: MilestoneListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {MILESTONES.map((milestone) => (
        <StreakMilestone
          key={milestone}
          showDescription
          achieved={currentStreak >= milestone}
          milestone={milestone}
          variant="card"
        />
      ))}
    </div>
  );
}
