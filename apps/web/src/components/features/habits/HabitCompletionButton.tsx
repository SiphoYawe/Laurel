"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * HabitCompletionButton - Large touch target completion button with animations
 * Story 3-1: One-Tap Habit Completion
 *
 * Features:
 * - 64px touch target for easy mobile interaction
 * - Checkmark draw animation (300ms)
 * - Success state with glow effect
 * - Loading spinner
 * - Disabled state with tooltip
 */

interface HabitCompletionButtonProps {
  habitTitle: string;
  isCompleted: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  size?: "sm" | "md" | "lg";
  onComplete: () => void;
  className?: string;
}

const SIZE_CONFIG = {
  sm: { button: "h-10 w-10", icon: "h-5 w-5", spinner: "h-4 w-4" },
  md: { button: "h-12 w-12", icon: "h-6 w-6", spinner: "h-5 w-5" },
  lg: { button: "h-16 w-16", icon: "h-8 w-8", spinner: "h-6 w-6" },
};

// SVG checkmark path for drawing animation
const checkmarkVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.3, ease: "easeOut" as const },
      opacity: { duration: 0.1 },
    },
  },
};

export function HabitCompletionButton({
  habitTitle,
  isCompleted,
  isLoading = false,
  disabled = false,
  disabledReason,
  size = "md",
  onComplete,
  className,
}: HabitCompletionButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const config = SIZE_CONFIG[size];
  const isDisabled = disabled || isCompleted || isLoading;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isDisabled) {
        if (disabledReason) {
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 2000);
        }
        return;
      }

      setIsAnimating(true);
      onComplete();

      // Reset animation state
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isDisabled, disabledReason, onComplete]
  );

  return (
    <div className="relative">
      <motion.button
        animate={
          isAnimating && !shouldReduceMotion
            ? {
                scale: [1, 1.1, 1],
                transition: { duration: 0.3 },
              }
            : {}
        }
        aria-checked={isCompleted}
        aria-label={`Mark ${habitTitle} as ${isCompleted ? "incomplete" : "complete"}`}
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full transition-all duration-200",
          "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          config.button,
          isCompleted
            ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
            : "border-forest-green text-forest-green hover:bg-forest-green/10 dark:bg-background border-2 bg-white",
          isLoading && "cursor-not-allowed opacity-50",
          isDisabled && !isLoading && isCompleted && "cursor-default",
          className
        )}
        disabled={isLoading}
        role="checkbox"
        type="button"
        whileHover={!isDisabled && !shouldReduceMotion ? { scale: 1.05 } : {}}
        whileTap={!isDisabled && !shouldReduceMotion ? { scale: 0.95 } : {}}
        onClick={handleClick}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            className={cn(
              "rounded-full border-2 border-current border-t-transparent",
              config.spinner
            )}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : isCompleted ? (
          <svg className={config.icon} fill="none" viewBox="0 0 24 24">
            <motion.path
              animate="visible"
              d="M5 13l4 4L19 7"
              initial={shouldReduceMotion ? "visible" : "hidden"}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              variants={checkmarkVariants}
            />
          </svg>
        ) : (
          <span className="sr-only">Complete {habitTitle}</span>
        )}

        {/* Success glow effect */}
        {isCompleted && !shouldReduceMotion && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }}
            className="absolute inset-0 rounded-full bg-green-400"
            initial={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </motion.button>

      {/* Tooltip for disabled state */}
      {showTooltip && disabledReason && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg"
          initial={{ opacity: 0, y: 4 }}
        >
          {disabledReason}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900" />
        </motion.div>
      )}
    </div>
  );
}
