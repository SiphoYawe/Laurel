"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

/**
 * FlashCard - Interactive flashcard for review
 * Story 6-4: SM-2 Algorithm Review Session
 */

interface FlashCardProps {
  front: string;
  back: string;
  hint?: string;
  onFlip?: (isFlipped: boolean) => void;
  className?: string;
}

export function FlashCard({ front, back, hint, onFlip, className }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleFlip = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    onFlip?.(newFlipped);
    if (newFlipped) setShowHint(false);
  };

  // Reset when card changes
  useEffect(() => {
    setIsFlipped(false);
    setShowHint(false);
  }, [front, back]);

  return (
    <div className={cn("relative", className)}>
      {/* Card Container */}
      <div
        className="perspective-1000 relative cursor-pointer"
        style={{ minHeight: "300px" }}
        onClick={handleFlip}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          className="preserve-3d relative h-full w-full"
          transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
        >
          {/* Front Side */}
          <div
            className={cn(
              "backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 p-8 text-center",
              "border-border bg-card shadow-lg",
              isFlipped && "pointer-events-none"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-muted-foreground mb-4 text-xs font-medium uppercase tracking-wider">
              Question
            </p>
            <p className="text-foreground text-xl font-medium leading-relaxed">{front}</p>

            {/* Hint Button */}
            {hint && !showHint && (
              <button
                className="text-muted-foreground hover:text-foreground mt-6 flex items-center gap-1 text-sm"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(true);
                }}
              >
                <Lightbulb className="h-4 w-4" />
                Show hint
              </button>
            )}

            {/* Hint Display */}
            <AnimatePresence>
              {showHint && hint && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-muted mt-4 rounded-lg px-4 py-2"
                  exit={{ opacity: 0, y: 10 }}
                  initial={{ opacity: 0, y: 10 }}
                >
                  <p className="text-muted-foreground text-sm">{hint}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-muted-foreground/60 mt-6 text-xs">Tap to reveal answer</p>
          </div>

          {/* Back Side */}
          <div
            className={cn(
              "backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 p-8 text-center",
              "border-laurel-forest/30 bg-laurel-sage/10 shadow-lg",
              !isFlipped && "pointer-events-none"
            )}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-laurel-forest mb-4 text-xs font-medium uppercase tracking-wider">
              Answer
            </p>
            <p className="text-foreground text-xl font-medium leading-relaxed">{back}</p>
            <p className="text-muted-foreground/60 mt-6 text-xs">Tap to flip back</p>
          </div>
        </motion.div>
      </div>

      {/* Flip Button */}
      <button
        className="bg-muted hover:bg-muted/80 absolute bottom-4 right-4 rounded-full p-2 transition-colors"
        type="button"
        onClick={handleFlip}
      >
        <RotateCcw className="text-muted-foreground h-5 w-5" />
      </button>
    </div>
  );
}

/**
 * ReviewControls - Quality rating buttons for SM-2
 */
interface ReviewControlsProps {
  onRate: (quality: number) => void;
  disabled?: boolean;
  showLabels?: boolean;
}

const QUALITY_OPTIONS = [
  { quality: 0, label: "Blackout", color: "bg-red-500", hint: "Complete blackout" },
  { quality: 1, label: "Wrong", color: "bg-red-400", hint: "Incorrect, but remembered" },
  { quality: 2, label: "Hard", color: "bg-orange-400", hint: "Incorrect, but easy recall" },
  { quality: 3, label: "Good", color: "bg-yellow-400", hint: "Correct with difficulty" },
  { quality: 4, label: "Easy", color: "bg-green-400", hint: "Correct with hesitation" },
  { quality: 5, label: "Perfect", color: "bg-green-500", hint: "Perfect response" },
];

export function ReviewControls({ onRate, disabled, showLabels = true }: ReviewControlsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-muted-foreground text-sm">How well did you know this?</p>
      <div className="flex gap-2">
        {QUALITY_OPTIONS.map(({ quality, label, color, hint }) => (
          <motion.button
            key={quality}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-4 py-3 transition-colors",
              color,
              "text-white",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            disabled={disabled}
            title={hint}
            type="button"
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={() => onRate(quality)}
          >
            <span className="text-lg font-bold">{quality}</span>
            {showLabels && <span className="text-xs opacity-90">{label}</span>}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/**
 * SimplifiedReviewControls - Simplified 3-option rating
 */
interface SimplifiedReviewControlsProps {
  onRate: (quality: number) => void;
  disabled?: boolean;
}

export function SimplifiedReviewControls({ onRate, disabled }: SimplifiedReviewControlsProps) {
  return (
    <div className="flex gap-3">
      <motion.button
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-4 text-white transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        disabled={disabled}
        type="button"
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => onRate(1)}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="font-medium">Again</span>
      </motion.button>
      <motion.button
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-500 py-4 text-white transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        disabled={disabled}
        type="button"
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => onRate(3)}
      >
        <span className="font-medium">Good</span>
      </motion.button>
      <motion.button
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 py-4 text-white transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        disabled={disabled}
        type="button"
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => onRate(5)}
      >
        <span className="font-medium">Easy</span>
        <ChevronRight className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
