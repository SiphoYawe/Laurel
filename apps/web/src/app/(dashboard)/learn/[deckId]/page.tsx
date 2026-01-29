"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Play, Pencil, Trash2, Layers } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { CardEditor } from "@/components/features/srs";
import { useDeck, useCards } from "@/hooks/useSrs";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

/**
 * Deck Detail Page - View and manage cards in a deck
 * Story 6-2: View Deck Cards
 * Story 6-3: Create and Edit Flashcards
 */

export default function DeckDetailPage() {
  const params = useParams();
  const deckId = params.deckId as string;

  const { deck, isLoading: deckLoading, refetch: refetchDeck } = useDeck(deckId);
  const { cards, isLoading: cardsLoading, refetch: refetchCards } = useCards(deckId);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<{
    id: string;
    front: string;
    back: string;
    hint?: string;
    tags?: string[];
  } | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "learning" | "review">("all");

  const createCardMutation = trpc.srs.createCard.useMutation({
    onSuccess: () => {
      refetchCards();
      refetchDeck();
    },
  });
  const updateCardMutation = trpc.srs.updateCard.useMutation({
    onSuccess: () => {
      refetchCards();
    },
  });
  const deleteCardMutation = trpc.srs.deleteCard.useMutation({
    onSuccess: () => {
      refetchCards();
      refetchDeck();
    },
  });

  const handleSaveCard = async (data: {
    front: string;
    back: string;
    hint?: string;
    tags?: string[];
  }) => {
    if (editingCard?.id) {
      await updateCardMutation.mutateAsync({
        cardId: editingCard.id,
        ...data,
      });
      setEditingCard(null);
    } else {
      await createCardMutation.mutateAsync({
        deckId,
        ...data,
      });
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      await deleteCardMutation.mutateAsync({ cardId });
    }
  };

  const handleEditCard = (card: typeof cards extends (infer T)[] ? T : never) => {
    setEditingCard({
      id: card.id,
      front: card.front,
      back: card.back,
      hint: card.hint || undefined,
      tags: card.tags || undefined,
    });
    setIsEditorOpen(true);
  };

  // Filter cards
  const filteredCards = cards?.filter((card) => {
    if (filter === "all") return true;
    return card.cardState === filter;
  });

  if (deckLoading) {
    return <DeckDetailSkeleton />;
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

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="mb-6">
        <Link
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm transition-colors"
          href="/learn"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to decks
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl"
              style={{ backgroundColor: deck.color || "#059669" }}
            >
              <Layers className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-foreground text-2xl font-bold">{deck.name}</h1>
              {deck.description && (
                <p className="text-muted-foreground mt-1 text-sm">{deck.description}</p>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                {deck.cardsCount} card{deck.cardsCount !== 1 ? "s" : ""} · {deck.dueCount} due
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {deck.dueCount > 0 && (
              <Link
                className="bg-laurel-forest hover:bg-laurel-forest/90 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors"
                href={`/learn/${deckId}/review`}
              >
                <Play className="h-4 w-4" />
                Study ({deck.dueCount})
              </Link>
            )}
            <button
              className="border-input bg-background hover:bg-muted flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
              type="button"
              onClick={() => {
                setEditingCard(null);
                setIsEditorOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Card
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        {(["all", "new", "learning", "review"] as const).map((f) => (
          <button
            key={f}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              filter === f
                ? "bg-laurel-forest text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
            type="button"
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Cards List */}
      {cardsLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-card border-border h-24 animate-pulse rounded-xl border" />
          ))}
        </div>
      ) : filteredCards && filteredCards.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border-border group relative rounded-xl border p-4"
                exit={{ opacity: 0, x: -20 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground font-medium">{card.front}</p>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{card.back}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          card.cardState === "new" &&
                            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                          card.cardState === "learning" &&
                            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                          card.cardState === "review" &&
                            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                          card.cardState === "relearning" &&
                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}
                      >
                        {card.cardState}
                      </span>
                      {card.tags && card.tags.length > 0 && (
                        <div className="flex gap-1">
                          {card.tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
                      title="Edit card"
                      type="button"
                      onClick={() => handleEditCard(card)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className="text-muted-foreground rounded-lg p-2 transition-colors hover:text-red-500"
                      title="Delete card"
                      type="button"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <Layers className="text-muted-foreground h-6 w-6" />
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            {filter === "all" ? "No cards in this deck yet" : `No ${filter} cards`}
          </p>
          {filter === "all" && (
            <button
              className="bg-laurel-forest hover:bg-laurel-forest/90 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors"
              type="button"
              onClick={() => {
                setEditingCard(null);
                setIsEditorOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Your First Card
            </button>
          )}
        </div>
      )}

      {/* Card Editor Modal */}
      <CardEditor
        deckName={deck.name}
        initialData={editingCard || undefined}
        isOpen={isEditorOpen}
        isSaving={createCardMutation.isPending || updateCardMutation.isPending}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
      />
    </div>
  );
}

function DeckDetailSkeleton() {
  return (
    <div className="min-h-screen pb-20">
      <div className="mb-6">
        <div className="bg-muted mb-4 h-4 w-24 animate-pulse rounded" />
        <div className="flex items-center gap-4">
          <div className="bg-muted h-14 w-14 animate-pulse rounded-xl" />
          <div className="space-y-2">
            <div className="bg-muted h-7 w-48 animate-pulse rounded" />
            <div className="bg-muted h-4 w-32 animate-pulse rounded" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-card border-border h-24 animate-pulse rounded-xl border" />
        ))}
      </div>
    </div>
  );
}
