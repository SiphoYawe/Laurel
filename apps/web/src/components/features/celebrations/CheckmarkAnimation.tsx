"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * CheckmarkAnimation - Animated checkmark draw
 * Story 3-5: Micro-Wins Celebration System
 */

interface CheckmarkAnimationProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  onComplete?: () => void;
}

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

const circleVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      scale: { duration: 0.2, ease: "easeOut" as const },
      opacity: { duration: 0.1 },
    },
  },
};

export function CheckmarkAnimation({
  size = 40,
  color = "#2D5A3D",
  strokeWidth = 3,
  className,
  onComplete,
}: CheckmarkAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.svg
      animate="visible"
      className={cn("", className)}
      height={size}
      initial="hidden"
      viewBox="0 0 50 50"
      width={size}
      onAnimationComplete={onComplete}
    >
      {/* Background circle */}
      <motion.circle
        cx="25"
        cy="25"
        fill={`${color}20`}
        r="23"
        variants={shouldReduceMotion ? undefined : circleVariants}
      />

      {/* Checkmark */}
      <motion.path
        d="M14 27 L22 35 L37 18"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        variants={shouldReduceMotion ? undefined : checkmarkVariants}
      />
    </motion.svg>
  );
}
