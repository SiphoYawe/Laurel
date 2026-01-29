"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ReactNode } from "react";

interface OnboardingStepProps {
  children: ReactNode;
  direction?: "forward" | "backward";
}

const variants = {
  enter: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? -50 : 50,
    opacity: 0,
  }),
};

const reducedMotionVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * OnboardingStep Component
 * Wrapper with animated transitions between steps
 * Respects prefers-reduced-motion by disabling slide animations
 */
export function OnboardingStep({ children, direction = "forward" }: OnboardingStepProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate="center"
      className="w-full"
      custom={direction}
      exit="exit"
      initial="enter"
      transition={{
        duration: prefersReducedMotion ? 0.1 : 0.25,
        ease: "easeInOut",
      }}
      variants={prefersReducedMotion ? reducedMotionVariants : variants}
    >
      {children}
    </motion.div>
  );
}
