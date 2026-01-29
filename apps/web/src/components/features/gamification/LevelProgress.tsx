"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Award, Crown, Leaf, Sparkles, Star, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * LevelProgress - Shows level progression roadmap
 * Story 4-3: Level Progression System
 *
 * 8 levels from Seedling to Laurel Champion
 */

interface LevelConfig {
  level: number;
  title: string;
  xpRequired: number;
}

interface LevelProgressProps {
  levelProgression: LevelConfig[];
  currentLevel: number;
  totalXp: number;
  className?: string;
}

const levelIcons: Record<number, React.ReactNode> = {
  1: <Leaf className="h-4 w-4" />,
  2: <Leaf className="h-4 w-4" />,
  3: <Leaf className="h-4 w-4" />,
  4: <Sparkles className="h-4 w-4" />,
  5: <Sparkles className="h-4 w-4" />,
  6: <Star className="h-4 w-4" />,
  7: <Award className="h-4 w-4" />,
  8: <Crown className="h-4 w-4" />,
};

export function LevelProgress({
  levelProgression,
  currentLevel,
  totalXp,
  className,
}: LevelProgressProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-semibold">Level Journey</h3>

      <div className="space-y-2">
        {levelProgression.map((level, index) => {
          const isUnlocked = totalXp >= level.xpRequired;
          const isCurrent = currentLevel === level.level;
          const nextLevel = levelProgression[index + 1];
          const progressToNext = nextLevel
            ? Math.min(
                ((totalXp - level.xpRequired) / (nextLevel.xpRequired - level.xpRequired)) * 100,
                100
              )
            : 100;

          return (
            <motion.div
              key={level.level}
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg p-3 transition-colors",
                  isCurrent
                    ? "bg-forest-green/10 border-forest-green border-2"
                    : isUnlocked
                      ? "bg-green-50 dark:bg-green-950/20"
                      : "bg-muted/50 opacity-60"
                )}
              >
                {/* Level badge */}
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    isCurrent
                      ? "bg-forest-green text-white"
                      : isUnlocked
                        ? "bg-green-500 text-white"
                        : "bg-muted-foreground/20 text-muted-foreground"
                  )}
                >
                  {levelIcons[level.level]}
                </div>

                {/* Level info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-semibold",
                        isCurrent
                          ? "text-forest-green"
                          : isUnlocked
                            ? "text-green-700 dark:text-green-400"
                            : "text-muted-foreground"
                      )}
                    >
                      Level {level.level}: {level.title}
                    </span>
                    {isCurrent && (
                      <span className="bg-forest-green rounded-full px-2 py-0.5 text-xs text-white">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {level.xpRequired.toLocaleString()} XP required
                  </p>
                </div>

                {/* Progress or checkmark */}
                <div className="shrink-0">
                  {isUnlocked && !isCurrent && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                      ✓
                    </div>
                  )}
                  {isCurrent && nextLevel && (
                    <div className="w-16">
                      <div className="h-2 overflow-hidden rounded-full bg-green-200 dark:bg-green-900">
                        <div
                          className="bg-forest-green h-full rounded-full transition-all"
                          style={{ width: `${Math.max(progressToNext, 0)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * LevelUpCelebration - Modal/overlay for level up
 */
interface LevelUpCelebrationProps {
  isVisible: boolean;
  newLevel: number;
  levelTitle: string;
  onClose: () => void;
}

export function LevelUpCelebration({
  isVisible,
  newLevel,
  levelTitle,
  onClose,
}: LevelUpCelebrationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            animate={{ scale: 1, y: 0 }}
            className="from-forest-green mx-4 max-w-sm rounded-3xl bg-gradient-to-br to-green-700 p-8 text-center text-white shadow-2xl"
            exit={{ scale: 0.8, y: 50 }}
            initial={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <Trophy className="mx-auto h-16 w-16 text-amber-400" />
            </motion.div>

            <h2 className="mt-4 text-3xl font-bold">Level Up!</h2>
            <p className="mt-2 text-xl opacity-90">You&apos;ve reached Level {newLevel}</p>
            <p className="mt-1 text-2xl font-semibold text-amber-300">{levelTitle}</p>

            <button
              className="mt-6 w-full rounded-xl bg-white/20 py-3 font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
              onClick={onClose}
            >
              Continue Growing 🌱
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * CompactLevelBadge - Small level indicator
 */
interface CompactLevelBadgeProps {
  level: number;
  title: string;
  className?: string;
}

export function CompactLevelBadge({ level, title, className }: CompactLevelBadgeProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="bg-forest-green flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
        {level}
      </div>
      <span className="text-forest-green text-sm font-medium">{title}</span>
    </div>
  );
}
