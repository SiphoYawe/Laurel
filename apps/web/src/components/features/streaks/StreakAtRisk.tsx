"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Clock } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * StreakAtRisk - Indicator component for at-risk streaks
 * Story 3-2: Streak Tracking and Display
 *
 * Shows a subtle but noticeable indicator when a streak
 * is at risk of being broken (not completed today)
 */

interface StreakAtRiskProps {
  currentStreak: number;
  hoursRemaining?: number;
  className?: string;
  variant?: "badge" | "banner" | "inline";
}

export function StreakAtRisk({
  currentStreak,
  hoursRemaining,
  className,
  variant = "badge",
}: StreakAtRiskProps) {
  if (currentStreak === 0) return null;

  if (variant === "banner") {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={cn("rounded-lg border border-amber-200 bg-amber-50 p-3", className)}
        initial={{ opacity: 0, y: -10 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <AlertCircle className="text-warm-amber h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              Your {currentStreak}-day streak is at risk!
            </p>
            <p className="text-xs text-amber-600">
              {hoursRemaining
                ? `${hoursRemaining} hours left to complete a habit today`
                : "Complete a habit today to keep it going"}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "inline") {
    return (
      <span
        className={cn(
          "text-warm-amber inline-flex items-center gap-1 text-xs font-medium",
          className
        )}
      >
        <AlertCircle className="h-3 w-3" />
        <span>at risk</span>
      </span>
    );
  }

  // Default: badge variant
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
    >
      <AlertCircle className="h-3 w-3" />
      <span>Streak at risk</span>
      {hoursRemaining && (
        <span className="flex items-center gap-0.5 text-amber-600">
          <Clock className="h-3 w-3" />
          {hoursRemaining}h
        </span>
      )}
    </motion.div>
  );
}

/**
 * Calculate hours remaining until end of day
 */
export function getHoursRemainingToday(): number {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const msRemaining = endOfDay.getTime() - now.getTime();
  return Math.floor(msRemaining / (1000 * 60 * 60));
}

/**
 * StreakEncouragement - Shows encouraging message after streak reset
 */
interface StreakEncouragementProps {
  message?: string;
  className?: string;
}

const ENCOURAGEMENT_MESSAGES = [
  "Starting fresh! Every expert was once a beginner.",
  "Today is a new day. Let's build momentum together!",
  "Fresh start! The best time to begin is now.",
  "New beginning! Your consistency journey starts today.",
  "Clean slate! Every streak starts with day one.",
];

export function StreakEncouragement({ message, className }: StreakEncouragementProps) {
  const displayMessage =
    message || ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-lg border border-green-200 bg-green-50 p-4 text-center", className)}
      initial={{ opacity: 0, y: 10 }}
    >
      <p className="text-forest-green text-sm font-medium">🌱 {displayMessage}</p>
    </motion.div>
  );
}
