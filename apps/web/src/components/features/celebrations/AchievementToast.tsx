"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

import { CheckmarkAnimation } from "./CheckmarkAnimation";
import { XPFloat } from "./XPFloat";

import { cn } from "@/lib/utils";

/**
 * AchievementToast - Small celebration toast notification
 * Story 3-5: Micro-Wins Celebration System
 */

interface AchievementToastProps {
  message: string;
  xp?: number;
  emoji?: string;
  isVisible: boolean;
  onComplete?: () => void;
  className?: string;
}

export function AchievementToast({
  message,
  xp,
  emoji,
  isVisible,
  onComplete,
  className,
}: AchievementToastProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          animate={{
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          className={cn(
            "ring-sage/20 fixed bottom-20 left-1/2 z-50 flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-lg ring-1",
            className
          )}
          exit={{
            y: 20,
            opacity: 0,
            scale: 0.95,
          }}
          initial={{
            y: 20,
            opacity: 0,
            scale: 0.95,
          }}
          style={{ x: "-50%" }}
          transition={{
            duration: shouldReduceMotion ? 0.1 : 0.3,
            ease: "easeOut",
          }}
        >
          {/* Icon or checkmark */}
          {emoji ? <span className="text-2xl">{emoji}</span> : <CheckmarkAnimation size={28} />}

          {/* Message */}
          <span className="text-forest-green font-medium">{message}</span>

          {/* XP indicator */}
          {xp && xp > 0 && (
            <div className="relative">
              <XPFloat className="relative" xp={xp} />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
