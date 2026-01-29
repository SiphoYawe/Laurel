"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * BadgeReveal - Badge unlock animation
 * Story 3-5: Micro-Wins Celebration System
 */

interface BadgeRevealProps {
  emoji: string;
  name: string;
  description?: string;
  className?: string;
  onComplete?: () => void;
}

const containerVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      staggerChildren: 0.1,
    },
  },
};

const emojiVariants: Variants = {
  hidden: {
    scale: 0,
    rotate: -180,
  },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const textVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const glowVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function BadgeReveal({ emoji, name, description, className, onComplete }: BadgeRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate="visible"
      className={cn("relative flex flex-col items-center justify-center gap-4", className)}
      initial="hidden"
      variants={shouldReduceMotion ? undefined : containerVariants}
      onAnimationComplete={onComplete}
    >
      {/* Glow effect */}
      <motion.div
        className="bg-warm-amber/30 absolute h-32 w-32 rounded-full blur-xl"
        variants={shouldReduceMotion ? undefined : glowVariants}
      />

      {/* Badge emoji */}
      <motion.div
        className="from-warm-amber/20 to-forest-green/20 ring-warm-amber/50 relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br text-5xl shadow-lg ring-2"
        variants={shouldReduceMotion ? undefined : emojiVariants}
      >
        {emoji}
      </motion.div>

      {/* Badge name */}
      <motion.h3
        className="text-forest-green text-xl font-bold"
        variants={shouldReduceMotion ? undefined : textVariants}
      >
        {name}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          className="text-muted-foreground max-w-xs text-center text-sm"
          variants={shouldReduceMotion ? undefined : textVariants}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
