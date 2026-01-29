"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

import type { HabitCategory } from "./CategoryIndicator";

import { cn } from "@/lib/utils";

/**
 * StackPreview - Shows the full stack flow as text
 * Story 2-7: Habit Stack Builder with Drag-Drop
 */

interface StackHabit {
  id: string;
  title: string;
  cue_trigger?: string | null;
  category: HabitCategory;
  duration_minutes?: number | null;
}

interface StackPreviewProps {
  habits: StackHabit[];
  className?: string;
}

export function StackPreview({ habits, className }: StackPreviewProps) {
  if (habits.length === 0) return null;

  // Generate the flow text
  const flowSteps = habits.map((habit, index) => {
    if (index === 0 && habit.cue_trigger) {
      return `After ${habit.cue_trigger}`;
    }
    return habit.title;
  });

  // Calculate total duration
  const totalDuration = habits.reduce((sum, h) => sum + (h.duration_minutes || 0), 0);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn("border-forest-green/20 bg-forest-green/5 rounded-lg border p-4", className)}
      initial={{ opacity: 0, y: 10 }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-forest-green text-sm font-medium">Your Habit Stack</h4>
        {totalDuration > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{totalDuration} min total</span>
          </div>
        )}
      </div>

      {/* Flow visualization */}
      <div className="flex flex-wrap items-center gap-2">
        {flowSteps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-md px-2 py-1 text-sm",
                index === 0 ? "bg-amber-100 text-amber-800" : "bg-white text-gray-700"
              )}
            >
              {step}
            </span>
            {index < flowSteps.length - 1 && <ArrowRight className="h-4 w-4 text-gray-400" />}
          </div>
        ))}
      </div>

      {/* Step-by-step list */}
      <div className="mt-4 space-y-2">
        {habits.map((habit, index) => (
          <div key={habit.id} className="flex items-center gap-2 text-xs">
            <span className="bg-forest-green flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white">
              {index + 1}
            </span>
            <span className="text-gray-600">{habit.title}</span>
            {habit.duration_minutes && (
              <span className="text-gray-400">({habit.duration_minutes}m)</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Generate stack flow text for display
 */
export function generateStackFlowText(habits: StackHabit[]): string {
  if (habits.length === 0) return "";

  const steps = habits.map((habit, index) => {
    if (index === 0 && habit.cue_trigger) {
      return `After ${habit.cue_trigger}`;
    }
    return habit.title;
  });

  return steps.join(" → ");
}

/**
 * StackFlowText - Inline text version of the stack flow
 */
export function StackFlowText({ habits }: { habits: StackHabit[] }) {
  const text = generateStackFlowText(habits);
  if (!text) return null;

  return (
    <p className="text-sm text-gray-600">
      <span className="text-forest-green font-medium">{text}</span>
    </p>
  );
}
