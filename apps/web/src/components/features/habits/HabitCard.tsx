"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { useCallback, useState } from "react";

import { CategoryIndicator, type HabitCategory } from "./CategoryIndicator";
import { StreakRing } from "./StreakRing";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * HabitCard - Visual card component for displaying habits
 * Implements Story 2-6: Visual Habit Card Component
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
  const [isCompletionAnimating, setIsCompletionAnimating] = useState(false);

  const handleComplete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isCompletedToday || isLoading) return;

      setIsCompletionAnimating(true);
      onComplete();

      // Reset animation state after animation completes
      setTimeout(() => setIsCompletionAnimating(false), 300);
    },
    [isCompletedToday, isLoading, onComplete]
  );

  return (
    <motion.div
      transition={{ duration: 0.15, ease: "easeOut" }}
      whileHover={shouldReduceMotion ? {} : { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-colors duration-200",
          isCompletedToday
            ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
            : "border-border hover:border-muted-foreground/30"
        )}
        onClick={onPress}
      >
        <CardContent className="flex items-center gap-4 p-4">
          {/* Completion Button */}
          <button
            aria-checked={isCompletedToday}
            aria-label={`Mark ${habit.title} as ${isCompletedToday ? "incomplete" : "complete"}`}
            className={cn(
              "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-200",
              "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isCompletedToday
                ? "bg-green-500 text-white"
                : "border-forest-green text-forest-green hover:bg-forest-green/10 dark:bg-background border-2 bg-white",
              isLoading && "cursor-not-allowed opacity-50"
            )}
            disabled={isCompletedToday || isLoading}
            role="checkbox"
            type="button"
            onClick={handleComplete}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                className="h-5 w-5 rounded-full border-2 border-current border-t-transparent"
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : isCompletedToday ? (
              <motion.div
                animate={{ scale: 1 }}
                initial={isCompletionAnimating ? { scale: 0 } : false}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Check className="h-6 w-6" strokeWidth={3} />
              </motion.div>
            ) : (
              <span className="sr-only">Complete</span>
            )}
          </button>

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
            </div>
          </div>

          {/* Streak Ring */}
          <div className="shrink-0">
            <StreakRing currentStreak={streak.current_streak} size="sm" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
