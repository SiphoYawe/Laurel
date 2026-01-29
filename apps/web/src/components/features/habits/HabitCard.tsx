"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock } from "lucide-react";

import { CategoryIndicator, type HabitCategory } from "./CategoryIndicator";
import { HabitCompletionButton } from "./HabitCompletionButton";
import { StreakRing } from "./StreakRing";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * HabitCard - Visual card component for displaying habits
 * Implements Story 2-6: Visual Habit Card Component
 * Updated for Story 3-1: One-Tap Habit Completion
 *
 * Features:
 * - Large touch target (min 64px height)
 * - Optimistic UI with completion button
 * - Success state styling with green tint
 * - Disabled state with "Already completed today!" tooltip
 */

interface HabitCardProps {
  habit: {
    id: string;
    title: string;
    cue_trigger: string | null;
    duration_minutes: number | null;
    category: HabitCategory;
    is_active: boolean;
    routine?: string;
    two_minute_version?: string | null;
  };
  streak: {
    current_streak: number;
    longest_streak: number;
  };
  isCompletedToday: boolean;
  isLoading?: boolean;
  onComplete: () => void;
  onPress: () => void;
}

export function HabitCard({
  habit,
  streak,
  isCompletedToday,
  isLoading = false,
  onComplete,
  onPress,
}: HabitCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      transition={{ duration: 0.15, ease: "easeOut" }}
      whileHover={shouldReduceMotion ? {} : { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-colors duration-200",
          // Minimum 64px height for touch target
          "min-h-[64px]",
          isCompletedToday
            ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
            : "border-border hover:border-muted-foreground/30"
        )}
        onClick={onPress}
      >
        <CardContent className="flex items-center gap-4 p-4">
          {/* Completion Button - Using new HabitCompletionButton */}
          <HabitCompletionButton
            disabled={isCompletedToday}
            disabledReason={isCompletedToday ? "Already completed today!" : undefined}
            habitTitle={habit.title}
            isCompleted={isCompletedToday}
            isLoading={isLoading}
            size="md"
            onComplete={onComplete}
          />

          {/* Habit Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CategoryIndicator category={habit.category} size="sm" />
              <h3
                className={cn(
                  "truncate font-medium",
                  isCompletedToday && "text-muted-foreground line-through"
                )}
              >
                {habit.title}
              </h3>
            </div>

            {/* Details row */}
            <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
              {habit.cue_trigger && <span className="truncate">{habit.cue_trigger}</span>}
              {habit.duration_minutes && (
                <span className="flex shrink-0 items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {habit.duration_minutes} min
                </span>
              )}
              {habit.two_minute_version && !isCompletedToday && (
                <span className="text-forest-green shrink-0 text-xs font-medium">
                  2-min version
                </span>
              )}
            </div>
          </div>

          {/* Streak Ring with animation on completion */}
          <div className="shrink-0">
            <StreakRing currentStreak={streak.current_streak} size="sm" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * HabitCardSkeleton - Loading placeholder for habit card
 */
export function HabitCardSkeleton() {
  return (
    <Card className="min-h-[64px]">
      <CardContent className="flex items-center gap-4 p-4">
        {/* Completion button skeleton */}
        <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />

        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Streak ring skeleton */}
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      </CardContent>
    </Card>
  );
}

/**
 * CompactHabitCard - Smaller version for list views
 */
interface CompactHabitCardProps {
  habit: {
    id: string;
    title: string;
    category: HabitCategory;
  };
  currentStreak: number;
  isCompletedToday: boolean;
  isLoading?: boolean;
  onComplete: () => void;
}

export function CompactHabitCard({
  habit,
  currentStreak,
  isCompletedToday,
  isLoading = false,
  onComplete,
}: CompactHabitCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3 transition-colors",
        isCompletedToday ? "border-green-200 bg-green-50/50" : "border-gray-200 hover:bg-gray-50"
      )}
    >
      <HabitCompletionButton
        disabled={isCompletedToday}
        disabledReason={isCompletedToday ? "Already completed today!" : undefined}
        habitTitle={habit.title}
        isCompleted={isCompletedToday}
        isLoading={isLoading}
        size="sm"
        onComplete={onComplete}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <CategoryIndicator category={habit.category} size="xs" />
          <span
            className={cn(
              "truncate text-sm font-medium",
              isCompletedToday && "text-muted-foreground line-through"
            )}
          >
            {habit.title}
          </span>
        </div>
      </div>

      {currentStreak > 0 && <span className="text-xs text-gray-500">🔥 {currentStreak}</span>}
    </div>
  );
}
