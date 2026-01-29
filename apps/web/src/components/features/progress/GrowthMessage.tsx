"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * GrowthMessage - Stage-based encouraging message
 * Story 3-4: Plateau of Latent Potential Visualization
 */

interface GrowthMessageProps {
  stage: string;
  message: string;
  className?: string;
}

export function GrowthMessage({ stage, message, className }: GrowthMessageProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-lg border border-green-200 bg-green-50 p-4", className)}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
          <Sparkles className="text-forest-green h-4 w-4" />
        </div>
        <div>
          <p className="font-medium text-green-800">{stage}</p>
          <p className="mt-1 text-sm text-green-700">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
