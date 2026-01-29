"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useCallback } from "react";

import { BadgeReveal } from "./BadgeReveal";
import { CheckmarkAnimation } from "./CheckmarkAnimation";
import { ConfettiAnimation, fireCelebrationConfetti } from "./ConfettiAnimation";

import {
  useCelebrationQueue,
  CELEBRATION_CONFIG,
  type CelebrationEvent,
} from "@/lib/celebration-queue";
import { cn } from "@/lib/utils";

/**
 * CelebrationOverlay - Full-screen celebration display
 * Story 3-5: Micro-Wins Celebration System
 */

interface CelebrationOverlayProps {
  className?: string;
}

function CelebrationContent({
  celebration,
  onComplete,
}: {
  celebration: CelebrationEvent;
  onComplete: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const config = CELEBRATION_CONFIG[celebration.level];
  const duration = shouldReduceMotion ? config.reducedDuration : config.duration;

  useEffect(() => {
    // Fire confetti for large celebrations
    if (celebration.level === "large" && !shouldReduceMotion) {
      fireCelebrationConfetti();
    }

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [celebration, duration, shouldReduceMotion, onComplete]);

  // Render based on celebration type
  switch (celebration.type) {
    case "level_up":
      return (
        <div className="flex flex-col items-center gap-6">
          <ConfettiAnimation duration={duration} particleCount={150} />
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl"
            initial={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            🎉
          </motion.div>
          <motion.h2
            animate={{ y: 0, opacity: 1 }}
            className="text-forest-green text-3xl font-bold"
            initial={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            Level Up!
          </motion.h2>
          <motion.p
            animate={{ y: 0, opacity: 1 }}
            className="text-muted-foreground text-xl"
            initial={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            {celebration.data.message}
          </motion.p>
          {celebration.data.xpEarned && (
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              className="text-warm-amber text-2xl font-bold"
              initial={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.4 }}
            >
              +{celebration.data.xpEarned} XP
            </motion.div>
          )}
        </div>
      );

    case "badge":
      return (
        <div className="flex flex-col items-center gap-4">
          <ConfettiAnimation duration={duration} particleCount={100} />
          <BadgeReveal
            description={celebration.data.message}
            emoji={celebration.data.badgeEmoji || "🏆"}
            name={celebration.data.badgeName || "Achievement Unlocked!"}
          />
          {celebration.data.xpEarned && (
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              className="text-warm-amber text-xl font-bold"
              initial={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              +{celebration.data.xpEarned} XP
            </motion.div>
          )}
        </div>
      );

    case "milestone":
      return (
        <div className="flex flex-col items-center gap-6">
          <ConfettiAnimation duration={duration} particleCount={100} />
          <motion.div
            animate={{ scale: 1, rotate: 0 }}
            className="text-5xl"
            initial={{ scale: 0, rotate: -180 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {celebration.data.badgeEmoji || "🔥"}
          </motion.div>
          <motion.h2
            animate={{ y: 0, opacity: 1 }}
            className="text-forest-green text-2xl font-bold"
            initial={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            {celebration.data.streakDays}-Day Streak!
          </motion.h2>
          <motion.p
            animate={{ y: 0, opacity: 1 }}
            className="text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            {celebration.data.message}
          </motion.p>
        </div>
      );

    case "daily_complete":
      return (
        <div className="flex flex-col items-center gap-4">
          <ConfettiAnimation duration={duration} particleCount={75} />
          <motion.div
            animate={{ scale: 1 }}
            className="text-4xl"
            initial={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            ⭐
          </motion.div>
          <motion.h2
            animate={{ y: 0, opacity: 1 }}
            className="text-forest-green text-xl font-bold"
            initial={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            All Habits Complete!
          </motion.h2>
          <motion.p
            animate={{ y: 0, opacity: 1 }}
            className="text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            {celebration.data.message}
          </motion.p>
        </div>
      );

    case "completion":
    default:
      return (
        <div className="flex flex-col items-center gap-3">
          <CheckmarkAnimation size={48} />
          <motion.p
            animate={{ y: 0, opacity: 1 }}
            className="text-forest-green font-medium"
            initial={{ y: 10, opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            {celebration.data.message || "Great job!"}
          </motion.p>
        </div>
      );
  }
}

export function CelebrationOverlay({ className }: CelebrationOverlayProps) {
  const { currentCelebration, isShowing, dismissCurrent } = useCelebrationQueue();
  const shouldReduceMotion = useReducedMotion();

  const handleComplete = useCallback(() => {
    dismissCurrent();
  }, [dismissCurrent]);

  // Only show overlay for medium and large celebrations
  const showOverlay =
    isShowing &&
    currentCelebration &&
    (currentCelebration.level === "medium" || currentCelebration.level === "large");

  return (
    <AnimatePresence>
      {showOverlay && currentCelebration && (
        <motion.div
          animate={{ opacity: 1 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm",
            className
          )}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
          onClick={handleComplete}
        >
          <motion.div
            animate={{ scale: 1, y: 0 }}
            className="rounded-2xl bg-white p-8 shadow-2xl"
            exit={{ scale: 0.9, y: 20 }}
            initial={{ scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CelebrationContent celebration={currentCelebration} onComplete={handleComplete} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
