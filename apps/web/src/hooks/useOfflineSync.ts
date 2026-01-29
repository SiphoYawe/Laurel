"use client";

import { useCallback, useEffect, useRef } from "react";

import { toast } from "./useToast";

import { useOfflineQueue } from "@/lib/offline-queue";
import { trpc } from "@/lib/trpc/client";

/**
 * useOfflineSync - Syncs queued completions when online
 * Story 3-1: One-Tap Habit Completion - Offline Support
 *
 * Features:
 * - Monitors online/offline status
 * - Syncs queued completions when connection restored
 * - Handles conflicts (last write wins with timestamp)
 * - Retries failed completions (max 3 times)
 */

export function useOfflineSync() {
  const {
    queue,
    isOnline,
    isSyncing,
    setOnline,
    setSyncing,
    removeFromQueue,
    updateStatus,
    incrementRetry,
    setLastSyncAttempt,
  } = useOfflineQueue();

  const utils = trpc.useUtils();
  const syncInProgress = useRef(false);

  // Complete mutation for syncing
  const completeMutation = trpc.habits.complete.useMutation();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      // Trigger sync when coming online
      syncQueue();
    };

    const handleOffline = () => {
      setOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial state
    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnline]);

  // Sync queue function
  const syncQueue = useCallback(async () => {
    // Prevent concurrent syncs
    if (syncInProgress.current || !isOnline) return;

    const pendingCompletions = queue.filter((c) => c.status === "pending");
    if (pendingCompletions.length === 0) return;

    syncInProgress.current = true;
    setSyncing(true);
    setLastSyncAttempt(new Date().toISOString());

    let syncedCount = 0;
    let failedCount = 0;

    for (const completion of pendingCompletions) {
      try {
        updateStatus(completion.id, "syncing");

        await completeMutation.mutateAsync({
          habitId: completion.habitId,
          durationMinutes: completion.durationMinutes,
          notes: completion.notes,
          qualityRating: completion.qualityRating,
        });

        removeFromQueue(completion.id);
        syncedCount++;
      } catch (error) {
        // Check if it's a "already completed" error
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (errorMessage.includes("already completed")) {
          // Remove from queue - it's already done
          removeFromQueue(completion.id);
          syncedCount++;
        } else {
          // Increment retry count
          incrementRetry(completion.id);
          failedCount++;
        }
      }
    }

    syncInProgress.current = false;
    setSyncing(false);

    // Invalidate habits list to refresh data
    await utils.habits.list.invalidate();

    // Show toast notification
    if (syncedCount > 0 && failedCount === 0) {
      toast({
        title: "Synced!",
        description: `${syncedCount} completion${syncedCount > 1 ? "s" : ""} saved`,
        variant: "success",
      });
    } else if (failedCount > 0) {
      toast({
        title: "Sync incomplete",
        description: `${syncedCount} synced, ${failedCount} failed`,
        variant: "error",
      });
    }
  }, [
    queue,
    isOnline,
    setSyncing,
    setLastSyncAttempt,
    updateStatus,
    completeMutation,
    removeFromQueue,
    incrementRetry,
    utils.habits.list,
  ]);

  // Sync on mount if online and has pending items
  useEffect(() => {
    if (isOnline && queue.some((c) => c.status === "pending")) {
      syncQueue();
    }
  }, [isOnline, syncQueue, queue]);

  return {
    isOnline,
    isSyncing,
    pendingCount: queue.filter((c) => c.status === "pending").length,
    failedCount: queue.filter((c) => c.status === "failed").length,
    syncQueue,
  };
}

/**
 * OfflineIndicator - Shows when offline with pending completions
 */
export function useOfflineIndicator() {
  const { isOnline, queue } = useOfflineQueue();
  const pendingCount = queue.filter((c) => c.status !== "failed").length;

  return {
    showIndicator: !isOnline || pendingCount > 0,
    isOnline,
    pendingCount,
    message: !isOnline
      ? "You're offline"
      : pendingCount > 0
        ? `${pendingCount} completion${pendingCount > 1 ? "s" : ""} pending sync`
        : "",
  };
}
