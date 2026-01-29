import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * SRS (Spaced Repetition System) Router
 * Story 6-1 through 6-6: Flashcard Learning
 */

// Singleton Supabase client
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Supabase URL not configured",
    });
  }

  const key = supabaseServiceKey || supabaseAnonKey;
  if (!key) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Supabase key not configured",
    });
  }

  supabaseClient = createClient(supabaseUrl, key);
  return supabaseClient;
}

/**
 * SM-2 Algorithm Implementation
 * https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
  cardState: "new" | "learning" | "review" | "relearning";
}

function calculateSM2(
  quality: number, // 0-5
  currentEase: number,
  currentInterval: number,
  repetitions: number,
  cardState: string
): SM2Result {
  // Quality: 0-5
  // 0: complete blackout
  // 1: incorrect but remembered
  // 2: incorrect but easy to recall
  // 3: correct with serious difficulty
  // 4: correct with hesitation
  // 5: perfect response

  let newEase = currentEase;
  let newInterval = currentInterval;
  let newRepetitions = repetitions;
  let newState: "new" | "learning" | "review" | "relearning" = cardState as
    | "new"
    | "learning"
    | "review"
    | "relearning";

  if (quality < 3) {
    // Failed review - reset to relearning
    newRepetitions = 0;
    newInterval = 1; // Review tomorrow
    newState = cardState === "new" ? "learning" : "relearning";
  } else {
    // Successful review
    newRepetitions += 1;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * newEase);
    }

    // Update ease factor (minimum 1.3)
    newEase = currentEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEase < 1.3) newEase = 1.3;

    newState = "review";
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);

  return {
    easeFactor: Math.round(newEase * 100) / 100,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview,
    cardState: newState,
  };
}

export const srsRouter = router({
  /**
   * List user's decks
   */
  listDecks: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const supabase = getSupabaseClient();

    const { data: decks, error } = await supabase
      .from("srs_decks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch decks",
        cause: error,
      });
    }

    // Get due cards count for each deck
    const decksWithDue = await Promise.all(
      (decks || []).map(async (deck) => {
        const { count } = await supabase
          .from("srs_cards")
          .select("*", { count: "exact", head: true })
          .eq("deck_id", deck.id)
          .eq("is_suspended", false)
          .lte("next_review_at", new Date().toISOString());

        return {
          id: deck.id,
          name: deck.name,
          description: deck.description,
          category: deck.category,
          color: deck.color,
          isActive: deck.is_active,
          cardsCount: deck.cards_count,
          dueCount: count || 0,
          newCardsPerDay: deck.new_cards_per_day,
          reviewCardsPerDay: deck.review_cards_per_day,
          createdAt: deck.created_at,
          updatedAt: deck.updated_at,
        };
      })
    );

    return decksWithDue;
  }),

  /**
   * Get single deck
   */
  getDeck: protectedProcedure
    .input(z.object({ deckId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const { data: deck, error } = await supabase
        .from("srs_decks")
        .select("*")
        .eq("id", input.deckId)
        .eq("user_id", userId)
        .single();

      if (error || !deck) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deck not found",
        });
      }

      // Get card counts by state
      const { data: stateCounts } = await supabase.rpc("count_cards_by_state", {
        p_deck_id: input.deckId,
      });

      // Get due count
      const { count: dueCount } = await supabase
        .from("srs_cards")
        .select("*", { count: "exact", head: true })
        .eq("deck_id", input.deckId)
        .eq("is_suspended", false)
        .lte("next_review_at", new Date().toISOString());

      return {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        category: deck.category,
        color: deck.color,
        isActive: deck.is_active,
        cardsCount: deck.cards_count,
        dueCount: dueCount || 0,
        newCardsPerDay: deck.new_cards_per_day,
        reviewCardsPerDay: deck.review_cards_per_day,
        stateCounts: stateCounts || { new: 0, learning: 0, review: 0, relearning: 0 },
        createdAt: deck.created_at,
        updatedAt: deck.updated_at,
      };
    }),

  /**
   * Create a new deck
   */
  createDeck: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        category: z.string().max(50).default("general"),
        color: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .default("#4CAF50"),
        newCardsPerDay: z.number().int().min(1).max(100).default(20),
        reviewCardsPerDay: z.number().int().min(1).max(500).default(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const { data: deck, error } = await supabase
        .from("srs_decks")
        .insert({
          user_id: userId,
          name: input.name,
          description: input.description || null,
          category: input.category,
          color: input.color,
          new_cards_per_day: input.newCardsPerDay,
          review_cards_per_day: input.reviewCardsPerDay,
        })
        .select()
        .single();

      if (error || !deck) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create deck",
          cause: error,
        });
      }

      return {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        category: deck.category,
        color: deck.color,
        createdAt: deck.created_at,
      };
    }),

  /**
   * Update a deck
   */
  updateDeck: protectedProcedure
    .input(
      z.object({
        deckId: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        category: z.string().max(50).optional(),
        color: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        newCardsPerDay: z.number().int().min(1).max(100).optional(),
        reviewCardsPerDay: z.number().int().min(1).max(500).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const updateData: Record<string, unknown> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.color !== undefined) updateData.color = input.color;
      if (input.newCardsPerDay !== undefined) updateData.new_cards_per_day = input.newCardsPerDay;
      if (input.reviewCardsPerDay !== undefined)
        updateData.review_cards_per_day = input.reviewCardsPerDay;
      if (input.isActive !== undefined) updateData.is_active = input.isActive;

      const { error } = await supabase
        .from("srs_decks")
        .update(updateData)
        .eq("id", input.deckId)
        .eq("user_id", userId);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update deck",
          cause: error,
        });
      }

      return { success: true };
    }),

  /**
   * Delete a deck
   */
  deleteDeck: protectedProcedure
    .input(z.object({ deckId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from("srs_decks")
        .delete()
        .eq("id", input.deckId)
        .eq("user_id", userId);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete deck",
          cause: error,
        });
      }

      return { success: true };
    }),

  /**
   * List cards in a deck
   */
  listCards: protectedProcedure
    .input(
      z.object({
        deckId: z.string().uuid(),
        state: z.enum(["new", "learning", "review", "relearning", "all"]).default("all"),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      let query = supabase
        .from("srs_cards")
        .select("*", { count: "exact" })
        .eq("deck_id", input.deckId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(input.offset, input.offset + input.limit - 1);

      if (input.state !== "all") {
        query = query.eq("card_state", input.state);
      }

      const { data: cards, error, count } = await query;

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch cards",
          cause: error,
        });
      }

      return {
        cards: (cards || []).map((card) => ({
          id: card.id,
          deckId: card.deck_id,
          front: card.front,
          back: card.back,
          hint: card.hint,
          tags: card.tags,
          easeFactor: card.ease_factor,
          intervalDays: card.interval_days,
          repetitions: card.repetitions,
          cardState: card.card_state,
          nextReviewAt: card.next_review_at,
          lastReviewedAt: card.last_reviewed_at,
          isSuspended: card.is_suspended,
          createdAt: card.created_at,
        })),
        total: count || 0,
      };
    }),

  /**
   * Get due cards for review
   */
  getDueCards: protectedProcedure
    .input(
      z.object({
        deckId: z.string().uuid().optional(),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      let query = supabase
        .from("srs_cards")
        .select("*")
        .eq("user_id", userId)
        .eq("is_suspended", false)
        .lte("next_review_at", new Date().toISOString())
        .order("next_review_at", { ascending: true })
        .limit(input.limit);

      if (input.deckId) {
        query = query.eq("deck_id", input.deckId);
      }

      const { data: cards, error } = await query;

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch due cards",
          cause: error,
        });
      }

      return (cards || []).map((card) => ({
        id: card.id,
        deckId: card.deck_id,
        front: card.front,
        back: card.back,
        hint: card.hint,
        cardState: card.card_state,
        easeFactor: card.ease_factor,
        intervalDays: card.interval_days,
        repetitions: card.repetitions,
      }));
    }),

  /**
   * Create a new card
   */
  createCard: protectedProcedure
    .input(
      z.object({
        deckId: z.string().uuid(),
        front: z.string().min(1).max(5000),
        back: z.string().min(1).max(5000),
        hint: z.string().max(500).optional(),
        tags: z.array(z.string().max(50)).max(10).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Verify deck ownership
      const { data: deck } = await supabase
        .from("srs_decks")
        .select("id")
        .eq("id", input.deckId)
        .eq("user_id", userId)
        .single();

      if (!deck) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deck not found",
        });
      }

      const { data: card, error } = await supabase
        .from("srs_cards")
        .insert({
          deck_id: input.deckId,
          user_id: userId,
          front: input.front,
          back: input.back,
          hint: input.hint || null,
          tags: input.tags,
        })
        .select()
        .single();

      if (error || !card) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create card",
          cause: error,
        });
      }

      return {
        id: card.id,
        front: card.front,
        back: card.back,
        hint: card.hint,
        tags: card.tags,
        createdAt: card.created_at,
      };
    }),

  /**
   * Update a card
   */
  updateCard: protectedProcedure
    .input(
      z.object({
        cardId: z.string().uuid(),
        front: z.string().min(1).max(5000).optional(),
        back: z.string().min(1).max(5000).optional(),
        hint: z.string().max(500).optional(),
        tags: z.array(z.string().max(50)).max(10).optional(),
        isSuspended: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const updateData: Record<string, unknown> = {};
      if (input.front !== undefined) updateData.front = input.front;
      if (input.back !== undefined) updateData.back = input.back;
      if (input.hint !== undefined) updateData.hint = input.hint;
      if (input.tags !== undefined) updateData.tags = input.tags;
      if (input.isSuspended !== undefined) updateData.is_suspended = input.isSuspended;

      const { error } = await supabase
        .from("srs_cards")
        .update(updateData)
        .eq("id", input.cardId)
        .eq("user_id", userId);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update card",
          cause: error,
        });
      }

      return { success: true };
    }),

  /**
   * Delete a card
   */
  deleteCard: protectedProcedure
    .input(z.object({ cardId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from("srs_cards")
        .delete()
        .eq("id", input.cardId)
        .eq("user_id", userId);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete card",
          cause: error,
        });
      }

      return { success: true };
    }),

  /**
   * Submit a review (SM-2 algorithm)
   */
  submitReview: protectedProcedure
    .input(
      z.object({
        cardId: z.string().uuid(),
        quality: z.number().int().min(0).max(5),
        timeTakenMs: z.number().int().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      // Get current card state
      const { data: card, error: cardError } = await supabase
        .from("srs_cards")
        .select("*")
        .eq("id", input.cardId)
        .eq("user_id", userId)
        .single();

      if (cardError || !card) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Card not found",
        });
      }

      // Calculate new SM-2 values
      const result = calculateSM2(
        input.quality,
        parseFloat(card.ease_factor),
        card.interval_days,
        card.repetitions,
        card.card_state
      );

      // Update card
      const { error: updateError } = await supabase
        .from("srs_cards")
        .update({
          ease_factor: result.easeFactor,
          interval_days: result.interval,
          repetitions: result.repetitions,
          card_state: result.cardState,
          next_review_at: result.nextReview.toISOString(),
          last_reviewed_at: new Date().toISOString(),
        })
        .eq("id", input.cardId);

      if (updateError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update card",
          cause: updateError,
        });
      }

      // Record review history
      await supabase.from("srs_reviews").insert({
        card_id: input.cardId,
        user_id: userId,
        deck_id: card.deck_id,
        quality: input.quality,
        time_taken_ms: input.timeTakenMs || null,
        previous_ease: card.ease_factor,
        previous_interval: card.interval_days,
        previous_state: card.card_state,
        new_ease: result.easeFactor,
        new_interval: result.interval,
        new_state: result.cardState,
      });

      // Update daily stats
      const isCorrect = input.quality >= 3;
      const isNew = card.card_state === "new";
      const isRelearning = card.card_state === "relearning" || card.card_state === "learning";

      await supabase.rpc("update_srs_daily_stats", {
        p_user_id: userId,
        p_cards_reviewed: 1,
        p_cards_new: isNew ? 1 : 0,
        p_cards_relearned: isRelearning && isCorrect ? 1 : 0,
        p_time_spent_ms: input.timeTakenMs || 0,
        p_correct_answers: isCorrect ? 1 : 0,
        p_wrong_answers: isCorrect ? 0 : 1,
      });

      return {
        nextReviewAt: result.nextReview.toISOString(),
        newInterval: result.interval,
        newEase: result.easeFactor,
        cardState: result.cardState,
      };
    }),

  /**
   * Get learning stats
   */
  getStats: protectedProcedure
    .input(
      z.object({
        days: z.number().int().min(1).max(365).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const supabase = getSupabaseClient();

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      // Get daily stats
      const { data: dailyStats } = await supabase
        .from("srs_daily_stats")
        .select("*")
        .eq("user_id", userId)
        .gte("date", startDate.toISOString().split("T")[0])
        .order("date", { ascending: true });

      // Get total stats
      const { count: totalCards } = await supabase
        .from("srs_cards")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const { count: totalDecks } = await supabase
        .from("srs_decks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const { count: totalReviews } = await supabase
        .from("srs_reviews")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const { count: dueCards } = await supabase
        .from("srs_cards")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_suspended", false)
        .lte("next_review_at", new Date().toISOString());

      // Calculate streak
      const sortedStats = (dailyStats || []).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      let streak = 0;
      const today = new Date().toISOString().split("T")[0];
      const checkDate = new Date(today);

      for (const stat of sortedStats) {
        const statDate = stat.date;
        const expectedDate = checkDate.toISOString().split("T")[0];

        if (statDate === expectedDate && stat.cards_reviewed > 0) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (statDate < expectedDate) {
          break;
        }
      }

      return {
        totalDecks: totalDecks || 0,
        totalCards: totalCards || 0,
        totalReviews: totalReviews || 0,
        dueCards: dueCards || 0,
        currentStreak: streak,
        dailyStats: (dailyStats || []).map((stat) => ({
          date: stat.date,
          cardsReviewed: stat.cards_reviewed,
          cardsNew: stat.cards_new,
          timeSpentMs: stat.time_spent_ms,
          correctAnswers: stat.correct_answers,
          wrongAnswers: stat.wrong_answers,
          accuracy:
            stat.correct_answers + stat.wrong_answers > 0
              ? Math.round(
                  (stat.correct_answers / (stat.correct_answers + stat.wrong_answers)) * 100
                )
              : 0,
        })),
      };
    }),
});
