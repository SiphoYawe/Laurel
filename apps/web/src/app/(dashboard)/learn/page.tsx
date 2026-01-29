"use client";

import { motion } from "framer-motion";
import { Plus, BookOpen, Clock } from "lucide-react";
import { useState } from "react";

import {
  DeckCard,
  DeckCardSkeleton,
  CreateDeckModal,
  CompactSrsStats,
} from "@/components/features/srs";
import { useDecks, useSrsStats } from "@/hooks/useSrs";

/**
 * Learn Page - Spaced Repetition System
 * Story 6-1: Deck Management
 * Story 6-5: Due Card Notifications
 */

export default function LearnPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const {
    decks,
    isLoading: decksLoading,
    refetch: refetchDecks,
    createDeck,
    isCreating,
  } = useDecks();
  const { stats, isLoading: statsLoading } = useSrsStats(7);

  // Calculate totals
  const totalDue = decks?.reduce((sum, deck) => sum + (deck.dueCount || 0), 0) || 0;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Learn</h1>
          <p className="text-muted-foreground text-sm">Review flashcards with spaced repetition</p>
        </div>
        <button
          className="bg-laurel-forest hover:bg-laurel-forest/90 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors"
          type="button"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Deck
        </button>
      </div>

      {/* Quick Stats */}
      {!statsLoading && stats && (
        <CompactSrsStats className="mb-6" dueCount={totalDue} streak={stats.currentStreak} />
      )}

      {/* Study Prompt */}
      {totalDue > 0 && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="border-laurel-forest/20 bg-laurel-sage/10 mb-6 rounded-xl border p-4"
          initial={{ opacity: 0, y: -10 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-laurel-forest/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <Clock className="text-laurel-forest h-5 w-5" />
              </div>
              <div>
                <p className="text-foreground font-medium">
                  {totalDue} card{totalDue !== 1 ? "s" : ""} due for review
                </p>
                <p className="text-muted-foreground text-sm">Keep your streak going!</p>
              </div>
            </div>
            <a
              className="bg-laurel-forest hover:bg-laurel-forest/90 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
              href="/learn/review"
            >
              Start Review
            </a>
          </div>
        </motion.div>
      )}

      {/* Decks Grid */}
      {decksLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <DeckCardSkeleton key={i} />
          ))}
        </div>
      ) : decks && decks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck, index) => (
            <motion.div
              key={deck.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              <DeckCard
                cardCount={deck.cardsCount}
                category={deck.category}
                color={deck.color || undefined}
                description={deck.description || undefined}
                dueCount={deck.dueCount}
                href={`/learn/${deck.id}`}
                name={deck.name}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState onCreateClick={() => setIsCreateOpen(true)} />
      )}

      {/* Create Deck Modal */}
      <CreateDeckModal
        isCreating={isCreating}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateDeck={async (data) => {
          await createDeck(data);
          setIsCreateOpen(false);
        }}
      />
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-16 text-center"
      initial={{ opacity: 0, y: 20 }}
    >
      <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <BookOpen className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="text-foreground mb-2 text-lg font-semibold">No decks yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm text-sm">
        Create your first flashcard deck to start learning with spaced repetition
      </p>
      <button
        className="bg-laurel-forest hover:bg-laurel-forest/90 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors"
        type="button"
        onClick={onCreateClick}
      >
        <Plus className="h-4 w-4" />
        Create Your First Deck
      </button>
    </motion.div>
  );
}
