"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

/**
 * ContinuePrompt - Shown after completing two-minute version
 * Story 2-8: Two-Minute Rule Generator
 */

interface ContinuePromptProps {
  habitTitle: string;
  onContinue: () => void;
  onFinish: () => void;
  autoDismissSeconds?: number;
}

export function ContinuePrompt({
  habitTitle,
  onContinue,
  onFinish,
  autoDismissSeconds = 30,
}: ContinuePromptProps) {
  const [countdown, setCountdown] = useState(autoDismissSeconds);

  useEffect(() => {
    if (countdown <= 0) {
      onFinish();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="fixed inset-x-4 bottom-24 z-50 rounded-xl bg-white p-4 shadow-lg"
        exit={{ opacity: 0, y: 100 }}
        initial={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="mb-3 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <Check className="h-4 w-4 text-green-600" />
          </div>
        </div>

        <p className="mb-1 text-center text-lg font-medium text-gray-900">Great start!</p>
        <p className="mb-4 text-center text-sm text-gray-600">
          Want to keep going with {habitTitle}?
        </p>

        <div className="flex gap-3">
          <Button className="flex-1 gap-2" variant="outline" onClick={onFinish}>
            <Clock className="h-4 w-4" />
            Done for now
          </Button>
          <Button
            className="bg-forest-green hover:bg-forest-green/90 flex-1 gap-2"
            onClick={onContinue}
          >
            Keep going
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-3 text-center text-xs text-gray-400">Auto-closing in {countdown}s</p>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * TwoMinuteBadge - Small indicator showing habit has a two-minute version
 */
export function TwoMinuteBadge() {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-medium text-white">
      2m
    </span>
  );
}

/**
 * ContinuationTimer - Timer shown during extended work after two-minute start
 */
interface ContinuationTimerProps {
  startTime: Date;
  onStop: (durationSeconds: number) => void;
}

export function ContinuationTimer({ startTime, onStop }: ContinuationTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const seconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="bg-forest-green fixed bottom-24 right-4 z-50 flex items-center gap-3 rounded-full px-4 py-2 text-white shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
    >
      <Clock className="h-4 w-4" />
      <span className="font-mono text-lg font-medium">{formatTime(elapsed)}</span>
      <Button
        className="h-7 rounded-full bg-white/20 px-3 text-xs text-white hover:bg-white/30"
        size="sm"
        variant="ghost"
        onClick={() => onStop(elapsed)}
      >
        Done
      </Button>
    </motion.div>
  );
}
