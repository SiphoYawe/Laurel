"use client";

import { useCallback, useRef } from "react";

import { toast } from "./useToast";

import { ToastAction } from "@/components/ui/toast";
import { useOfflineQueue, hasQueuedCompletionToday } from "@/lib/offline-queue";
import { trpc } from "@/lib/trpc/client";

/**
 * useHabitCompletion - Custom hook for optimistic habit completion
 * Story 3-1: One-Tap Habit Completion
 *
 * Features:
 * - Optimistic UI updates
 * - Undo functionality (5-second window)
 * - Offline queue support
 * - Debounced rapid taps (300ms)
 */

interface UseHabitCompletionOptions {
  onComplete?: (habitId: string, streak: number) => void;
  onUndo?: (habitId: string) => void;
  onError?: (habitId: string, error: string) => void;
}

interface CompletionResult {
  success: boolean;
  completionId?: string;
  streak?: {
    current_streak: number;
    longest_streak: number;
    last_completed_date: string | null;
  };
}

export function useHabitCompletion(options: UseHabitCompletionOptions = {}) {
  const { onComplete, onUndo, onError } = options;
  const utils = trpc.useUtils();

  // Track recently completed habits for debouncing
  const recentCompletions = useRef<Map<string, number>>(new Map());

  // Track undo windows
  const undoTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Offline queue
  const { addToQueue, isOnline } = useOfflineQueue();

  // Complete mutation
  const completeMutation = trpc.habits.complete.useMutation({
    onMutate: async ({ habitId }) => {
      // Cancel any outgoing refetches
      await utils.habits.list.cancel();

      // Snapshot the previous value
      const previousHabits = utils.habits.list.getData();

      // Optimistically update
      utils.habits.list.setData(undefined, (old) => {
        if (!old) return old;
        return old.map((habit) =>
          habit.id === habitId
            ? {
                ...habit,
                isCompletedToday: true,
                streak: {
                  ...habit.streak,
                  current_streak: habit.streak.current_streak + 1,
                  longest_streak: Math.max(
                    habit.streak.longest_streak,
                    habit.streak.current_streak + 1
                  ),
                },
              }
            : habit
        );
      });

      return { previousHabits };
    },

    onError: (err, { habitId }, context) => {
      // Rollback on error
      if (context?.previousHabits) {
        utils.habits.list.setData(undefined, context.previousHabits);
      }

      const errorMessage = err.message || "Couldn't save completion";
      onError?.(habitId, errorMessage);

      // Show error toast with retry
      toast({
        title: "Couldn't save",
        description: "Tap to retry",
        variant: "error",
        action: (
          <ToastAction altText="Retry" onClick={() => completeHabit(habitId)}>
            Retry
          </ToastAction>
        ) as any,
      });
    },

    onSuccess: (data, { habitId }) => {
      // Show success toast with undo option
      const { dismiss } = toast({
        title: "Habit completed!",
        description: `Streak: ${data.streak.current_streak} days`,
        variant: "success",
        action: (
          <ToastAction altText="Undo" onClick={() => handleUndo(habitId)}>
            Undo
          </ToastAction>
        ) as any,
      });

      // Set up undo window (5 seconds)
      const timeout = setTimeout(() => {
        dismiss();
        undoTimeouts.current.delete(habitId);
      }, 5000);

      undoTimeouts.current.set(habitId, timeout);

      onComplete?.(habitId, data.streak.current_streak);
    },

    onSettled: () => {
      // Always refetch after mutation
      utils.habits.list.invalidate();
    },
  });

  // Uncomplete (undo) mutation
  const uncompleteMutation = trpc.habits.uncomplete.useMutation({
    onMutate: async ({ habitId }) => {
      await utils.habits.list.cancel();
      const previousHabits = utils.habits.list.getData();

      // Optimistically revert
      utils.habits.list.setData(undefined, (old) => {
        if (!old) return old;
        return old.map((habit) =>
          habit.id === habitId
            ? {
                ...habit,
                isCompletedToday: false,
                streak: {
                  ...habit.streak,
                  current_streak: Math.max(0, habit.streak.current_streak - 1),
                },
              }
            : habit
        );
      });

      return { previousHabits };
    },

    onError: (err, _variables, context) => {
      if (context?.previousHabits) {
        utils.habits.list.setData(undefined, context.previousHabits);
      }

      toast({
        title: "Couldn't undo",
        description: err.message || "Please try again",
        variant: "error",
      });
    },

    onSuccess: (_, variables) => {
      const { habitId } = variables;
      toast({
        title: "Completion undone",
        description: "Habit marked as incomplete",
        variant: "default",
      });

      onUndo?.(habitId);
    },

    onSettled: () => {
      utils.habits.list.invalidate();
    },
  });

  // Debounced completion handler
  const completeHabit = useCallback(
    async (
      habitId: string,
      options?: {
        durationMinutes?: number;
        notes?: string;
        qualityRating?: number;
      }
    ): Promise<CompletionResult> => {
      // Debounce: prevent rapid taps (300ms)
      const lastCompletion = recentCompletions.current.get(habitId);
      const now = Date.now();

      if (lastCompletion && now - lastCompletion < 300) {
        return { success: false };
      }

      recentCompletions.current.set(habitId, now);

      // Clean up old entries after 1 second
      setTimeout(() => {
        recentCompletions.current.delete(habitId);
      }, 1000);

      // Check if offline
      if (!isOnline) {
        // Queue for later sync
        const queueId = addToQueue({
          habitId,
          timestamp: new Date().toISOString(),
          durationMinutes: options?.durationMinutes,
          notes: options?.notes,
          qualityRating: options?.qualityRating,
        });

        toast({
          title: "Saved offline",
          description: "Will sync when you're back online",
          variant: "default",
        });

        return { success: true, completionId: queueId };
      }

      try {
        const result = await completeMutation.mutateAsync({
          habitId,
          ...options,
        });

        return {
          success: true,
          completionId: result.completion.id,
          streak: result.streak,
        };
      } catch {
        return { success: false };
      }
    },
    [completeMutation, isOnline, addToQueue]
  );

  // Handle undo
  const handleUndo = useCallback(
    async (habitId: string) => {
      // Clear the undo timeout
      const timeout = undoTimeouts.current.get(habitId);
      if (timeout) {
        clearTimeout(timeout);
        undoTimeouts.current.delete(habitId);
      }

      try {
        await uncompleteMutation.mutateAsync({ habitId });
        return true;
      } catch {
        return false;
      }
    },
    [uncompleteMutation]
  );

  // Check if habit is completed today (including offline queue)
  const isCompletedToday = useCallback((habitId: string, serverCompleted: boolean) => {
    if (serverCompleted) return true;
    return hasQueuedCompletionToday(habitId);
  }, []);

  return {
    completeHabit,
    undoHabit: handleUndo,
    isCompletedToday,
    isCompleting: completeMutation.isPending,
    isUndoing: uncompleteMutation.isPending,
    isLoading: completeMutation.isPending || uncompleteMutation.isPending,
  };
}
