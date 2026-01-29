"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ReviewSession } from "@/components/features/srs";
import { useDeck, useReviewSession } from "@/hooks/useSrs";

/**
 * Review Session Page - SM-2 Spaced Repetition Review
 * Story 6-4: SM-2 Algorithm Review Session
 */

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;

  const { deck, isLoading: deckLoading } = useDeck(deckId);
  const {
    dueCards,
    isLoading: cardsLoading,
    submitReview,
    isSubmitting,
    refetch,
  } = useReviewSession(deckId);

  const isLoading = deckLoading || cardsLoading;

  const handleReview = async (cardId: string, quality: number, timeTakenMs?: number) => {
    const result = await submitReview(cardId, quality, timeTakenMs);
    return result;
  };

  const handleComplete = () => {
    refetch();
  };

  const handleExit = () => {
    router.push(`/learn/${deckId}`);
  };

  if (isLoading) {
    return <ReviewSessionSkeleton />;
  }

  if (!deck) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <p className="text-muted-foreground mb-4">Deck not found</p>
        <Link className="text-laurel-forest hover:underline" href="/learn">
          Back to decks
        </Link>
      </div>
    );
  }

  if (!dueCards || dueCards.length === 0) {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[400px] flex-col items-center justify-center text-center"
        initial={{ opacity: 0, y: 20 }}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-foreground mb-2 text-xl font-bold">All caught up!</h2>
        <p className="text-muted-foreground mb-6 max-w-sm text-sm">
          You&apos;ve reviewed all due cards in this deck. Come back later when more cards are ready
          for review.
        </p>
        <Link
          className="bg-laurel-forest hover:bg-laurel-forest/90 rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-colors"
          href={`/learn/${deckId}`}
        >
          Back to Deck
        </Link>
      </motion.div>
    );
  }

  // Map cards to expected interface
  const cards = dueCards.map((card) => ({
    id: card.id,
    front: card.front,
    back: card.back,
    hint: card.hint || undefined,
    cardState: card.cardState,
  }));

  return (
    <div className="mx-auto max-w-2xl pb-20">
      {/* Deck Info */}
      <div className="mb-4 text-center">
        <p className="text-muted-foreground text-sm">Reviewing</p>
        <h1 className="text-foreground text-xl font-bold">{deck.name}</h1>
      </div>

      {/* Review Session Component */}
      <ReviewSession
        cards={cards}
        isSubmitting={isSubmitting}
        onComplete={handleComplete}
        onExit={handleExit}
        onReview={handleReview}
      />
    </div>
  );
}

function ReviewSessionSkeleton() {
  return (
    <div className="mx-auto max-w-2xl pb-20">
      <div className="mb-4 text-center">
        <div className="bg-muted mx-auto mb-2 h-4 w-20 animate-pulse rounded" />
        <div className="bg-muted mx-auto h-7 w-48 animate-pulse rounded" />
      </div>
      <div className="mb-6 flex justify-between">
        <div className="bg-muted h-8 w-16 animate-pulse rounded" />
        <div className="flex gap-4">
          <div className="bg-muted h-6 w-12 animate-pulse rounded" />
          <div className="bg-muted h-6 w-12 animate-pulse rounded" />
        </div>
      </div>
      <div className="bg-muted mb-6 h-2 animate-pulse rounded-full" />
      <div className="bg-card border-border h-80 animate-pulse rounded-2xl border" />
    </div>
  );
}
