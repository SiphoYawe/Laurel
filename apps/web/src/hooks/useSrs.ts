"use client";

import { useCallback } from "react";

import { trpc } from "@/lib/trpc/client";

/**
 * useSrs - Hooks for Spaced Repetition System
 * Stories 6-1 through 6-6: Flashcard Learning
 */

// ===== Deck Management =====

export function useDecks() {
  const { data: decks, isLoading, refetch } = trpc.srs.listDecks.useQuery();

  const createMutation = trpc.srs.createDeck.useMutation({
    onSuccess: () => refetch(),
  });

  const updateMutation = trpc.srs.updateDeck.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteMutation = trpc.srs.deleteDeck.useMutation({
    onSuccess: () => refetch(),
  });

  const createDeck = useCallback(
    async (data: {
      name: string;
      description?: string;
      category?: string;
      color?: string;
      newCardsPerDay?: number;
      reviewCardsPerDay?: number;
    }) => {
      return createMutation.mutateAsync(data);
    },
    [createMutation]
  );

  const updateDeck = useCallback(
    async (
      deckId: string,
      data: {
        name?: string;
        description?: string;
        category?: string;
        color?: string;
        newCardsPerDay?: number;
        reviewCardsPerDay?: number;
        isActive?: boolean;
      }
    ) => {
      return updateMutation.mutateAsync({ deckId, ...data });
    },
    [updateMutation]
  );

  const deleteDeck = useCallback(
    async (deckId: string) => {
      return deleteMutation.mutateAsync({ deckId });
    },
    [deleteMutation]
  );

  // Calculate totals
  const totalCards = decks?.reduce((sum, deck) => sum + deck.cardsCount, 0) || 0;
  const totalDue = decks?.reduce((sum, deck) => sum + deck.dueCount, 0) || 0;

  return {
    decks: decks || [],
    isLoading,
    refetch,
    totalCards,
    totalDue,
    createDeck,
    updateDeck,
    deleteDeck,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// ===== Single Deck =====

export function useDeck(deckId: string) {
  const {
    data: deck,
    isLoading,
    refetch,
  } = trpc.srs.getDeck.useQuery({ deckId }, { enabled: !!deckId });

  return {
    deck,
    isLoading,
    refetch,
  };
}

// ===== Card Management =====

export function useCards(
  deckId: string,
  state: "new" | "learning" | "review" | "relearning" | "all" = "all"
) {
  const { data, isLoading, refetch } = trpc.srs.listCards.useQuery(
    { deckId, state, limit: 100 },
    { enabled: !!deckId }
  );

  const createMutation = trpc.srs.createCard.useMutation({
    onSuccess: () => refetch(),
  });

  const updateMutation = trpc.srs.updateCard.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteMutation = trpc.srs.deleteCard.useMutation({
    onSuccess: () => refetch(),
  });

  const createCard = useCallback(
    async (data: { front: string; back: string; hint?: string; tags?: string[] }) => {
      return createMutation.mutateAsync({ deckId, ...data });
    },
    [deckId, createMutation]
  );

  const updateCard = useCallback(
    async (
      cardId: string,
      data: {
        front?: string;
        back?: string;
        hint?: string;
        tags?: string[];
        isSuspended?: boolean;
      }
    ) => {
      return updateMutation.mutateAsync({ cardId, ...data });
    },
    [updateMutation]
  );

  const deleteCard = useCallback(
    async (cardId: string) => {
      return deleteMutation.mutateAsync({ cardId });
    },
    [deleteMutation]
  );

  return {
    cards: data?.cards || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    createCard,
    updateCard,
    deleteCard,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// ===== Review Session =====

export function useReviewSession(deckId?: string) {
  const {
    data: dueCards,
    isLoading,
    refetch,
  } = trpc.srs.getDueCards.useQuery({ deckId, limit: 50 }, { enabled: true });

  const reviewMutation = trpc.srs.submitReview.useMutation();

  const submitReview = useCallback(
    async (cardId: string, quality: number, timeTakenMs?: number) => {
      const result = await reviewMutation.mutateAsync({
        cardId,
        quality,
        timeTakenMs,
      });
      // Don't refetch immediately - let the UI handle card progression
      return result;
    },
    [reviewMutation]
  );

  return {
    dueCards: dueCards || [],
    dueCount: dueCards?.length || 0,
    isLoading,
    refetch,
    submitReview,
    isSubmitting: reviewMutation.isPending,
  };
}

// ===== Learning Stats =====

export function useSrsStats(days: number = 30) {
  const { data: stats, isLoading, refetch } = trpc.srs.getStats.useQuery({ days });

  return {
    stats,
    isLoading,
    refetch,
  };
}

// ===== Combined Hook =====

export function useSrs() {
  const decks = useDecks();
  const stats = useSrsStats();
  const review = useReviewSession();

  return {
    // Decks
    decks: decks.decks,
    isLoadingDecks: decks.isLoading,
    totalCards: decks.totalCards,
    totalDue: decks.totalDue,
    createDeck: decks.createDeck,
    updateDeck: decks.updateDeck,
    deleteDeck: decks.deleteDeck,
    // Stats
    stats: stats.stats,
    isLoadingStats: stats.isLoading,
    // Review
    dueCards: review.dueCards,
    dueCount: review.dueCount,
    submitReview: review.submitReview,
    isSubmittingReview: review.isSubmitting,
    // Refetch all
    refetchAll: () => {
      decks.refetch();
      stats.refetch();
      review.refetch();
    },
  };
}
