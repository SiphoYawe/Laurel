"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * XPFloat - Floating "+XP" animation
 * Story 3-5: Micro-Wins Celebration System
 */

interface XPFloatProps {
  xp: number;
  className?: string;
  onComplete?: () => void;
}

export function XPFloat({ xp, className, onComplete }: XPFloatProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{
        y: shouldReduceMotion ? 0 : -40,
        opacity: [1, 1, 0],
        scale: shouldReduceMotion ? 1 : [1, 1.1, 1],
      }}
      className={cn("pointer-events-none absolute text-sm font-bold text-green-600", className)}
      initial={{ y: 0, opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0.3 : 0.8,
        ease: "easeOut",
      }}
      onAnimationComplete={onComplete}
    >
      +{xp} XP
    </motion.div>
  );
}
