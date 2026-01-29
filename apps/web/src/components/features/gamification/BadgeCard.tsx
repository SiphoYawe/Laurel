"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * BadgeCard - Displays a single badge
 * Story 4-4: Achievement Badge System
 *
 * Features:
 * - Earned/unearned states
 * - Rarity colors
 * - Progress indicators
 * - Unlock animation
 */

export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type BadgeCategory = "milestone" | "streak" | "technique" | "social" | "time" | "special";

interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  requirementType: string;
  requirementValue: number;
  xpReward: number;
  rarity: BadgeRarity;
}

interface BadgeCardProps {
  badge: BadgeDefinition;
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
}

const rarityColors: Record<
  BadgeRarity,
  { bg: string; border: string; text: string; glow: string }
> = {
  common: {
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-slate-300 dark:border-slate-600",
    text: "text-slate-600 dark:text-slate-300",
    glow: "",
  },
  uncommon: {
    bg: "bg-green-100 dark:bg-green-900/30",
    border: "border-green-400 dark:border-green-600",
    text: "text-green-700 dark:text-green-400",
    glow: "",
  },
  rare: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-400 dark:border-blue-500",
    text: "text-blue-700 dark:text-blue-400",
    glow: "shadow-blue-200 dark:shadow-blue-900",
  },
  epic: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "border-purple-400 dark:border-purple-500",
    text: "text-purple-700 dark:text-purple-400",
    glow: "shadow-lg shadow-purple-200 dark:shadow-purple-900",
  },
  legendary: {
    bg: "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30",
    border: "border-amber-400 dark:border-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    glow: "shadow-xl shadow-amber-200 dark:shadow-amber-900",
  },
};

const sizeClasses = {
  sm: {
    card: "p-2",
    icon: "text-2xl",
    iconContainer: "h-10 w-10",
    name: "text-xs",
    description: "text-[10px]",
  },
  md: {
    card: "p-3",
    icon: "text-3xl",
    iconContainer: "h-14 w-14",
    name: "text-sm",
    description: "text-xs",
  },
  lg: {
    card: "p-4",
    icon: "text-4xl",
    iconContainer: "h-20 w-20",
    name: "text-base",
    description: "text-sm",
  },
};

export function BadgeCard({
  badge,
  earned,
  earnedAt,
  progress,
  size = "md",
  onClick,
  className,
}: BadgeCardProps) {
  const colors = rarityColors[badge.rarity];
  const styles = sizeClasses[size];

  return (
    <motion.div whileHover={{ scale: earned ? 1.05 : 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={cn(
          "cursor-pointer border-2 transition-all duration-200",
          earned
            ? cn(colors.bg, colors.border, colors.glow)
            : "border-muted-foreground/30 bg-muted/30 border-dashed",
          styles.card,
          className
        )}
        onClick={onClick}
      >
        <CardContent className="flex flex-col items-center p-0 text-center">
          {/* Badge Icon */}
          <div
            className={cn(
              "relative flex items-center justify-center rounded-full",
              styles.iconContainer,
              earned ? colors.bg : "bg-muted"
            )}
          >
            <span className={cn(styles.icon, earned ? "" : "opacity-40 grayscale")}>
              {badge.icon}
            </span>
            {!earned && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
                <Lock className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* Badge Name */}
          <h4
            className={cn(
              "mt-2 line-clamp-1 font-semibold",
              styles.name,
              earned ? colors.text : "text-muted-foreground"
            )}
          >
            {badge.name}
          </h4>

          {/* Description or Progress */}
          {size !== "sm" && (
            <p
              className={cn(
                "mt-1 line-clamp-2",
                styles.description,
                earned ? "text-muted-foreground" : "text-muted-foreground/70"
              )}
            >
              {badge.description}
            </p>
          )}

          {/* Progress bar for unearned badges */}
          {!earned && progress !== undefined && progress > 0 && (
            <div className="mt-2 w-full">
              <div className="bg-muted h-1 overflow-hidden rounded-full">
                <div
                  className="bg-muted-foreground/50 h-full rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-muted-foreground mt-0.5 text-[10px]">{Math.round(progress)}%</p>
            </div>
          )}

          {/* Earned date */}
          {earned && earnedAt && size !== "sm" && (
            <div className="text-muted-foreground mt-2 flex items-center gap-1 text-[10px]">
              <Calendar className="h-3 w-3" />
              {new Date(earnedAt).toLocaleDateString()}
            </div>
          )}

          {/* XP Reward */}
          {size !== "sm" && (
            <div
              className={cn(
                "mt-2 text-[10px] font-medium",
                earned ? "text-amber-600" : "text-muted-foreground"
              )}
            >
              +{badge.xpReward} XP
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * BadgeUnlockCelebration - Animation for badge unlock
 */
interface BadgeUnlockCelebrationProps {
  isVisible: boolean;
  badge: BadgeDefinition;
  onClose: () => void;
}

export function BadgeUnlockCelebration({ isVisible, badge, onClose }: BadgeUnlockCelebrationProps) {
  const colors = rarityColors[badge.rarity];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            animate={{ scale: 1, y: 0 }}
            className={cn(
              "mx-4 max-w-sm rounded-3xl p-8 text-center shadow-2xl",
              colors.bg,
              "border-4",
              colors.border
            )}
            exit={{ scale: 0.8, y: 50 }}
            initial={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.6, repeat: 2 }}
            >
              <span className="text-7xl">{badge.icon}</span>
            </motion.div>

            <h2 className={cn("mt-4 text-2xl font-bold", colors.text)}>Badge Unlocked!</h2>
            <p className="mt-2 text-xl font-semibold">{badge.name}</p>
            <p className="text-muted-foreground mt-1 text-sm">{badge.description}</p>

            <div className="mt-4 flex items-center justify-center gap-1 text-amber-600">
              <span className="text-lg font-bold">+{badge.xpReward}</span>
              <span className="text-sm">XP</span>
            </div>

            <button
              className={cn(
                "mt-6 w-full rounded-xl py-3 font-semibold transition-colors",
                "bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
              )}
              onClick={onClose}
            >
              Awesome! 🎉
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * RarityBadge - Small label showing rarity
 */
interface RarityBadgeProps {
  rarity: BadgeRarity;
  className?: string;
}

export function RarityBadge({ rarity, className }: RarityBadgeProps) {
  const colors = rarityColors[rarity];
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        colors.bg,
        colors.text,
        className
      )}
    >
      {rarity}
    </span>
  );
}
