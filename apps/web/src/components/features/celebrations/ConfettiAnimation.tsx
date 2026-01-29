"use client";

import confetti from "canvas-confetti";
import { useReducedMotion } from "framer-motion";
import { useEffect, useCallback } from "react";

import { CONFETTI_COLORS } from "@/lib/celebration-queue";

/**
 * ConfettiAnimation - Confetti particle effect
 * Story 3-5: Micro-Wins Celebration System
 */

interface ConfettiAnimationProps {
  duration?: number;
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  onComplete?: () => void;
}

export function ConfettiAnimation({
  duration = 2000,
  particleCount = 100,
  spread = 70,
  origin = { x: 0.5, y: 0.5 },
  onComplete,
}: ConfettiAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  const fireConfetti = useCallback(() => {
    if (shouldReduceMotion) {
      // Skip confetti for reduced motion users
      onComplete?.();
      return;
    }

    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: Math.floor(particleCount / 10),
        angle: 60,
        spread,
        origin: { x: 0, y: origin.y },
        colors: CONFETTI_COLORS,
      });

      confetti({
        particleCount: Math.floor(particleCount / 10),
        angle: 120,
        spread,
        origin: { x: 1, y: origin.y },
        colors: CONFETTI_COLORS,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        onComplete?.();
      }
    };

    frame();
  }, [duration, particleCount, spread, origin, shouldReduceMotion, onComplete]);

  useEffect(() => {
    fireConfetti();
  }, [fireConfetti]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Fire a single burst of confetti
 */
export function fireConfettiBurst(options?: {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
}) {
  const { particleCount = 50, spread = 60, origin = { x: 0.5, y: 0.5 } } = options || {};

  confetti({
    particleCount,
    spread,
    origin,
    colors: CONFETTI_COLORS,
  });
}

/**
 * Fire confetti from both sides
 */
export function fireCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: CONFETTI_COLORS,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
