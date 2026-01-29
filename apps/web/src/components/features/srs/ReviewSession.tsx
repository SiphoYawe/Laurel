"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, Trophy, ArrowLeft } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import { FlashCard, SimplifiedReviewControls } from "./FlashCard";

import { cn } from "@/lib/utils";

/**
 * ReviewSession - Complete review session interface
 * Story 6-4: SM-2 Algorithm Review Session
 */

interface Card {
  id: string;
  front: string;
  back: string;
  hint?: string;
  cardState: string;
}

interface ReviewResult {
  cardId: string;
  quality: number;
  timeTakenMs: number;
  nextReviewAt: string;
}

interface ReviewSessionProps {
  cards: Card[];
  onReview: (
    cardId: string,
    quality: number,
    timeTakenMs?: number
  ) => Promise<{
    nextReviewAt: string;
    newInterval: number;
    cardState: string;
  }>;
  onComplete: () => void;
  onExit: () => void;
  isSubmitting?: boolean;
}

export function ReviewSession({
  cards,
  onReview,
  onComplete,
  onExit,
  isSubmitting,
}: ReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [cardStartTime, setCardStartTime] = useState(Date.now());
  const [sessionComplete, setSessionComplete] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  // Reset start time when card changes
  useEffect(() => {
    setCardStartTime(Date.now());
    setIsFlipped(false);
  }, [currentIndex]);

  const handleRate = useCallback(
    async (quality: number) => {
      if (!currentCard || isSubmitting) return;

      const timeTaken = Date.now() - cardStartTime;

      try {
        const result = await onReview(currentCard.id, quality, timeTaken);

        setResults((prev) => [
          ...prev,
          {
            cardId: currentCard.id,
            quality,
            timeTakenMs: timeTaken,
            nextReviewAt: result.nextReviewAt,
          },
        ]);

        // Move to next card or complete
        if (currentIndex < cards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setSessionComplete(true);
          onComplete();
        }
      } catch (error) {
        console.error("Failed to submit review:", error);
      }
    },
    [currentCard, currentIndex, cards.length, cardStartTime, isSubmitting, onReview, onComplete]
  );

  // Calculate session stats
  const correctCount = results.filter((r) => r.quality >= 3).length;
  const wrongCount = results.filter((r) => r.quality < 3).length;
  const totalTime = results.reduce((sum, r) => sum + r.timeTakenMs, 0);
  const avgTime = results.length > 0 ? Math.round(totalTime / results.length / 1000) : 0;

  if (sessionComplete) {
    return (
      <SessionComplete
        correctCount={correctCount}
        totalCards={cards.length}
        totalTimeMs={totalTime}
        wrongCount={wrongCount}
        onExit={onExit}
      />
    );
  }

  if (!currentCard) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">No cards to review</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
          type="button"
          onClick={onExit}
        >
          <ArrowLeft className="h-4 w-4" />
          Exit
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-green-600 dark:text-green-400">{correctCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-600 dark:text-red-400">{wrongCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground">{avgTime}s avg</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="text-muted-foreground mb-2 flex justify-between text-sm">
          <span>
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="bg-muted h-2 overflow-hidden rounded-full">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="bg-laurel-forest h-full rounded-full"
            initial={{ width: 0 }}
          />
        </div>
      </div>

      {/* Card */}
      <FlashCard
        back={currentCard.back}
        className="mb-6"
        front={currentCard.front}
        hint={currentCard.hint}
        onFlip={setIsFlipped}
      />

      {/* Rating Controls */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            initial={{ opacity: 0, y: 20 }}
          >
            <SimplifiedReviewControls disabled={isSubmitting} onRate={handleRate} />
          </motion.div>
        )}
      </AnimatePresence>

      {!isFlipped && (
        <p className="text-muted-foreground text-center text-sm">
          Tap the card to reveal the answer
        </p>
      )}
    </div>
  );
}

/**
 * SessionComplete - Review session completion screen
 */
interface SessionCompleteProps {
  totalCards: number;
  correctCount: number;
  wrongCount: number;
  totalTimeMs: number;
  onExit: () => void;
}

function SessionComplete({ totalCards, correctCount, totalTimeMs, onExit }: SessionCompleteProps) {
  const accuracy = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;
  const totalMinutes = Math.floor(totalTimeMs / 60000);
  const totalSeconds = Math.round((totalTimeMs % 60000) / 1000);

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center py-12 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        className="mb-6"
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <Trophy className="h-12 w-12 text-amber-500" />
        </div>
      </motion.div>

      <h2 className="text-foreground mb-2 text-2xl font-bold">Session Complete!</h2>
      <p className="text-muted-foreground mb-8">Great job on your review session</p>

      <div className="mb-8 grid w-full max-w-xs grid-cols-2 gap-4">
        <div className="bg-muted rounded-xl p-4">
          <p className="text-muted-foreground text-xs">Cards Reviewed</p>
          <p className="text-foreground text-2xl font-bold">{totalCards}</p>
        </div>
        <div className="bg-muted rounded-xl p-4">
          <p className="text-muted-foreground text-xs">Accuracy</p>
          <p
            className={cn(
              "text-2xl font-bold",
              accuracy >= 80
                ? "text-green-600 dark:text-green-400"
                : accuracy >= 60
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-red-600 dark:text-red-400"
            )}
          >
            {accuracy}%
          </p>
        </div>
        <div className="bg-muted rounded-xl p-4">
          <p className="text-muted-foreground text-xs">Correct</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{correctCount}</p>
        </div>
        <div className="bg-muted rounded-xl p-4">
          <p className="text-muted-foreground text-xs">Time</p>
          <p className="text-foreground text-2xl font-bold">
            {totalMinutes > 0 ? `${totalMinutes}m ` : ""}
            {totalSeconds}s
          </p>
        </div>
      </div>

      <button
        className="bg-laurel-forest hover:bg-laurel-forest/90 w-full max-w-xs rounded-xl py-3 font-medium text-white transition-colors"
        type="button"
        onClick={onExit}
      >
        Done
      </button>
    </motion.div>
  );
}
