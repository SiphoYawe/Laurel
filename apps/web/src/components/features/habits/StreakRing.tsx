"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * StreakRing - Circular progress visualization for habit streaks
 * Shows current streak with progress toward next milestone
 */

interface StreakRingProps {
  currentStreak: number;
  size?: "sm" | "md" | "lg";
  showFireEmoji?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  sm: { dimensions: 40, strokeWidth: 3, fontSize: "text-xs" },
  md: { dimensions: 56, strokeWidth: 4, fontSize: "text-sm" },
  lg: { dimensions: 80, strokeWidth: 5, fontSize: "text-lg" },
};

// Milestone thresholds for progress calculation
const MILESTONES = [7, 14, 21, 30, 60, 90, 180, 365];

function getNextMilestone(streak: number): number {
  for (const milestone of MILESTONES) {
    if (streak < milestone) {
      return milestone;
    }
  }
  return streak + 30; // After 365, add 30-day milestones
}

function getPreviousMilestone(streak: number): number {
  let prev = 0;
  for (const milestone of MILESTONES) {
    if (streak < milestone) {
      return prev;
    }
    prev = milestone;
  }
  return prev;
}

export function StreakRing({
  currentStreak,
  size = "md",
  showFireEmoji = true,
  className,
}: StreakRingProps) {
  const shouldReduceMotion = useReducedMotion();
  const config = SIZE_CONFIG[size];
  const radius = (config.dimensions - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate progress toward next milestone
  const prevMilestone = getPreviousMilestone(currentStreak);
  const nextMilestone = getNextMilestone(currentStreak);
  const progressInRange = currentStreak - prevMilestone;
  const rangeSize = nextMilestone - prevMilestone;
  const progress = rangeSize > 0 ? progressInRange / rangeSize : 0;

  // Calculate stroke dash offset for the progress arc
  const strokeDashoffset = circumference * (1 - progress);

  // Determine ring color based on streak
  const ringColor =
    currentStreak === 0
      ? "stroke-muted-foreground/30"
      : currentStreak >= 7
        ? "stroke-forest-green"
        : "stroke-warm-amber";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg className="-rotate-90" height={config.dimensions} width={config.dimensions}>
        {/* Background circle */}
        <circle
          className="text-muted-foreground/20"
          cx={config.dimensions / 2}
          cy={config.dimensions / 2}
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
        />

        {/* Progress arc */}
        <motion.circle
          animate={{ strokeDashoffset }}
          className={ringColor}
          cx={config.dimensions / 2}
          cy={config.dimensions / 2}
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          r={radius}
          strokeDasharray={circumference}
          strokeLinecap="round"
          strokeWidth={config.strokeWidth}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.8,
            ease: "easeOut",
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showFireEmoji && currentStreak > 0 && (
          <span className={cn("leading-none", size === "sm" ? "text-[10px]" : "text-xs")}>🔥</span>
        )}
        <span className={cn("font-semibold leading-none", config.fontSize)}>{currentStreak}</span>
      </div>
    </div>
  );
}
