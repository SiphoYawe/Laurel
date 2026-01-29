"use client";

import { motion } from "framer-motion";
import { Layers, ChevronRight, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * DeckCard - Displays a flashcard deck
 * Story 6-2: Create Flashcard Decks
 */

interface DeckCardProps {
  name: string;
  description?: string;
  category?: string;
  color?: string;
  cardCount: number;
  dueCount: number;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function DeckCard({
  name,
  description,
  category = "general",
  color = "#059669",
  cardCount,
  dueCount,
  isActive = true,
  href,
  onClick,
  className,
}: DeckCardProps) {
  const hasDue = dueCount > 0;

  const content = (
    <Card
      className={cn(
        "cursor-pointer border transition-all duration-200",
        "hover:shadow-md",
        !isActive && "opacity-60",
        className
      )}
      style={{ borderLeftColor: color, borderLeftWidth: "4px" }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}20` }}
            >
              <Layers className="h-6 w-6" style={{ color }} />
            </div>
            <div>
              <h3 className="text-foreground font-semibold">{name}</h3>
              {description && (
                <p className="text-muted-foreground mt-0.5 line-clamp-1 text-sm">{description}</p>
              )}
              <div className="text-muted-foreground mt-2 flex items-center gap-3 text-xs">
                <span>{cardCount} cards</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="capitalize">{category}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="text-muted-foreground h-5 w-5" />
        </div>

        {/* Due indicator */}
        {hasDue && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-900/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                {dueCount} cards due
              </span>
            </div>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link href={href}>{content}</Link>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      {content}
    </motion.div>
  );
}

/**
 * DeckCardSkeleton - Loading state
 */
export function DeckCardSkeleton() {
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-muted h-12 w-12 animate-pulse rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="bg-muted h-5 w-32 animate-pulse rounded" />
            <div className="bg-muted h-4 w-48 animate-pulse rounded" />
            <div className="bg-muted h-3 w-24 animate-pulse rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * EmptyDecksState - No decks yet
 */
interface EmptyDecksStateProps {
  onCreateDeck: () => void;
}

export function EmptyDecksState({ onCreateDeck }: EmptyDecksStateProps) {
  return (
    <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
      <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <Layers className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="text-foreground font-semibold">No flashcard decks yet</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-center text-sm">
        Create your first deck to start learning with spaced repetition.
      </p>
      <button
        className="bg-laurel-forest hover:bg-laurel-forest/90 mt-4 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
        type="button"
        onClick={onCreateDeck}
      >
        Create a Deck
      </button>
    </div>
  );
}
