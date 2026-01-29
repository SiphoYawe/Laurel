"use client";

import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Trophy, Crown, Zap, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * MilestoneCelebration - Enhanced celebrations for major milestones
 * Story 4-6: Milestone Celebration Enhancements
 *
 * Features:
 * - Level up celebrations
 * - Badge unlock animations
 * - Streak milestone celebrations
 * - XP milestone celebrations
 */

export type MilestoneType =
  | "level_up"
  | "badge_unlock"
  | "streak_milestone"
  | "xp_milestone"
  | "habit_completion";

interface MilestoneData {
  type: MilestoneType;
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: string;
  xpGained?: number;
}

interface MilestoneCelebrationProps {
  milestone: MilestoneData | null;
  isVisible: boolean;
  onClose: () => void;
}

const milestoneConfig: Record<
  MilestoneType,
  {
    bgGradient: string;
    icon: React.ReactNode;
    confettiColors: string[];
    sound?: string;
  }
> = {
  level_up: {
    bgGradient: "from-amber-400 via-amber-500 to-orange-500",
    icon: <Crown className="h-16 w-16" />,
    confettiColors: ["#fbbf24", "#f59e0b", "#d97706"],
  },
  badge_unlock: {
    bgGradient: "from-purple-400 via-purple-500 to-indigo-500",
    icon: <Trophy className="h-16 w-16" />,
    confettiColors: ["#a855f7", "#8b5cf6", "#6366f1"],
  },
  streak_milestone: {
    bgGradient: "from-red-400 via-orange-500 to-amber-500",
    icon: <Zap className="h-16 w-16" />,
    confettiColors: ["#ef4444", "#f97316", "#fbbf24"],
  },
  xp_milestone: {
    bgGradient: "from-emerald-400 via-green-500 to-teal-500",
    icon: <Sparkles className="h-16 w-16" />,
    confettiColors: ["#10b981", "#22c55e", "#14b8a6"],
  },
  habit_completion: {
    bgGradient: "from-forest-green via-green-600 to-emerald-600",
    icon: <Star className="h-16 w-16" />,
    confettiColors: ["#228B22", "#22c55e", "#10b981"],
  },
};

export function MilestoneCelebration({ milestone, isVisible, onClose }: MilestoneCelebrationProps) {
  const [_showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible && milestone) {
      setShowConfetti(true);
      const config = milestoneConfig[milestone.type];

      // Fire confetti
      const colors = config.confettiColors;

      // Initial burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });

      // Side cannons
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
      }, 150);

      // Clean up confetti state
      const timeout = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, milestone]);

  if (!milestone) return null;

  const config = milestoneConfig[milestone.type];

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
              "relative mx-4 max-w-sm overflow-hidden rounded-3xl p-8 text-center text-white shadow-2xl",
              "bg-gradient-to-br",
              config.bgGradient
            )}
            exit={{ scale: 0.8, y: 50 }}
            initial={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -500],
                    opacity: [0, 1, 0],
                  }}
                  className="absolute h-2 w-2 rounded-full bg-white/30"
                  initial={{
                    x: Math.random() * 300,
                    y: 300 + Math.random() * 100,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Icon with animation */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              className="relative mx-auto"
              transition={{ duration: 0.6, repeat: 2 }}
            >
              {milestone.icon ? <span className="text-7xl">{milestone.icon}</span> : config.icon}
            </motion.div>

            {/* Title */}
            <motion.h2
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-3xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
            >
              {milestone.title}
            </motion.h2>

            {/* Value (if any) */}
            {milestone.value && (
              <motion.p
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 text-4xl font-black"
                initial={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.3 }}
              >
                {milestone.value}
              </motion.p>
            )}

            {/* Subtitle */}
            {milestone.subtitle && (
              <motion.p
                animate={{ opacity: 1 }}
                className="mt-2 text-lg opacity-90"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
              >
                {milestone.subtitle}
              </motion.p>
            )}

            {/* XP Gained */}
            {milestone.xpGained && milestone.xpGained > 0 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2"
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="h-5 w-5" />
                <span className="font-bold">+{milestone.xpGained} XP</span>
              </motion.div>
            )}

            {/* Close button */}
            <motion.button
              animate={{ opacity: 1 }}
              className="mt-6 w-full rounded-xl bg-white/20 py-3 font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
              onClick={onClose}
            >
              <PartyPopper className="mr-2 inline-block h-5 w-5" />
              Awesome!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * useMilestoneCelebration - Hook for managing milestone celebrations
 */
export function useMilestoneCelebration() {
  const [milestone, setMilestone] = useState<MilestoneData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [queue, setQueue] = useState<MilestoneData[]>([]);

  // Process queue
  useEffect(() => {
    if (!isVisible && queue.length > 0) {
      const [next, ...rest] = queue;
      setMilestone(next);
      setIsVisible(true);
      setQueue(rest);
    }
  }, [isVisible, queue]);

  const celebrate = (data: MilestoneData) => {
    setQueue((prev) => [...prev, data]);
  };

  const close = () => {
    setIsVisible(false);
    // Small delay before showing next milestone
    setTimeout(() => {
      setMilestone(null);
    }, 300);
  };

  const celebrateLevelUp = (level: number, title: string, xp?: number) => {
    celebrate({
      type: "level_up",
      title: "Level Up!",
      value: `Level ${level}`,
      subtitle: title,
      xpGained: xp,
    });
  };

  const celebrateBadge = (name: string, icon: string, xp?: number) => {
    celebrate({
      type: "badge_unlock",
      title: "Badge Unlocked!",
      subtitle: name,
      icon,
      xpGained: xp,
    });
  };

  const celebrateStreak = (days: number, xp?: number) => {
    celebrate({
      type: "streak_milestone",
      title: "Streak Milestone!",
      value: `${days} Days`,
      subtitle: "You're on fire! 🔥",
      xpGained: xp,
    });
  };

  const celebrateXpMilestone = (totalXp: number) => {
    celebrate({
      type: "xp_milestone",
      title: "XP Milestone!",
      value: `${totalXp.toLocaleString()} XP`,
      subtitle: "Keep up the great work!",
    });
  };

  return {
    milestone,
    isVisible,
    close,
    celebrate,
    celebrateLevelUp,
    celebrateBadge,
    celebrateStreak,
    celebrateXpMilestone,
  };
}

/**
 * QuickCelebration - Smaller, inline celebration animation
 */
interface QuickCelebrationProps {
  isVisible: boolean;
  message: string;
  icon?: string;
  onComplete?: () => void;
}

export function QuickCelebration({
  isVisible,
  message,
  icon = "🎉",
  onComplete,
}: QuickCelebrationProps) {
  useEffect(() => {
    if (isVisible && onComplete) {
      const timeout = setTimeout(onComplete, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed left-1/2 top-20 z-50 -translate-x-1/2"
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
        >
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-white shadow-lg">
            <span className="text-xl">{icon}</span>
            <span className="font-semibold">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
