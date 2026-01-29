"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * XpDisplay - Shows user's XP with level progress
 * Story 4-2: XP Earning System
 *
 * Features:
 * - Total XP display
 * - Progress bar to next level
 * - Animated XP gains
 */

interface XpDisplayProps {
  totalXp: number;
  currentLevel: number;
  levelTitle: string;
  nextLevelXp: number;
  progress: number;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  className?: string;
}

export function XpDisplay({
  totalXp,
  currentLevel,
  levelTitle,
  nextLevelXp,
  progress,
  size = "md",
  showDetails = true,
  className,
}: XpDisplayProps) {
  const sizeClasses = {
    sm: {
      container: "p-2",
      text: "text-sm",
      xpText: "text-lg",
      progressHeight: "h-1.5",
    },
    md: {
      container: "p-4",
      text: "text-base",
      xpText: "text-2xl",
      progressHeight: "h-2",
    },
    lg: {
      container: "p-6",
      text: "text-lg",
      xpText: "text-4xl",
      progressHeight: "h-3",
    },
  };

  const styles = sizeClasses[size];

  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20",
        styles.container,
        className
      )}
    >
      {/* Level and Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 font-bold text-white">
            {currentLevel}
          </span>
          <span className={cn("font-semibold text-amber-900 dark:text-amber-100", styles.text)}>
            {levelTitle}
          </span>
        </div>
        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <Sparkles className="h-4 w-4" />
          <span className={cn("font-bold", styles.xpText)}>{totalXp.toLocaleString()}</span>
          <span className={cn("text-amber-600/70 dark:text-amber-400/70", styles.text)}>XP</span>
        </div>
      </div>

      {/* Progress Bar */}
      {showDetails && (
        <div className="mt-3">
          <div
            className={cn(
              "overflow-hidden rounded-full bg-amber-200/50 dark:bg-amber-900/50",
              styles.progressHeight
            )}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
              initial={{ width: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="mt-1 text-xs text-amber-600/70 dark:text-amber-400/70">
            {progress < 100 ? `${nextLevelXp - totalXp} XP to next level` : "Max level reached!"}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * XpGainPopup - Animated popup showing XP gained
 */
interface XpGainPopupProps {
  amount: number;
  streakBonus?: number;
  isVisible: boolean;
  onComplete?: () => void;
}

export function XpGainPopup({ amount, streakBonus = 0, isVisible, onComplete }: XpGainPopupProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="pointer-events-none fixed left-1/2 top-1/2 z-50"
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 px-6 py-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-white" />
              <span className="text-3xl font-bold text-white">+{amount}</span>
              <span className="text-lg text-white/90">XP</span>
            </div>
            {streakBonus > 0 && (
              <span className="text-sm text-white/80">🔥 +{streakBonus} streak bonus!</span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * CompactXpDisplay - Smaller XP display for headers/nav
 */
interface CompactXpDisplayProps {
  totalXp: number;
  currentLevel: number;
  className?: string;
}

export function CompactXpDisplay({ totalXp, currentLevel, className }: CompactXpDisplayProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
        {currentLevel}
      </span>
      <div className="flex items-center gap-1">
        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
          {totalXp.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
