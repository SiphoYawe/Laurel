"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Offline completion queue for habit completions
 * Story 3-1: One-Tap Habit Completion - Offline Support
 */

export interface QueuedCompletion {
  id: string;
  habitId: string;
  timestamp: string;
  durationMinutes?: number;
  notes?: string;
  qualityRating?: number;
  isTwoMinute?: boolean;
  retryCount: number;
  status: "pending" | "syncing" | "failed";
}

interface OfflineQueueState {
  queue: QueuedCompletion[];
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAttempt: string | null;

  // Actions
  addToQueue: (completion: Omit<QueuedCompletion, "id" | "retryCount" | "status">) => string;
  removeFromQueue: (id: string) => void;
  updateStatus: (id: string, status: QueuedCompletion["status"]) => void;
  incrementRetry: (id: string) => void;
  clearQueue: () => void;
  setOnline: (isOnline: boolean) => void;
  setSyncing: (isSyncing: boolean) => void;
  setLastSyncAttempt: (timestamp: string) => void;
  getQueuedCompletion: (habitId: string, date: string) => QueuedCompletion | undefined;
}

const MAX_RETRIES = 3;

export const useOfflineQueue = create<OfflineQueueState>()(
  persist(
    (set, get) => ({
      queue: [],
      isOnline: typeof window !== "undefined" ? navigator.onLine : true,
      isSyncing: false,
      lastSyncAttempt: null,

      addToQueue: (completion) => {
        const id = crypto.randomUUID();
        const queuedCompletion: QueuedCompletion = {
          ...completion,
          id,
          retryCount: 0,
          status: "pending",
        };

        set((state) => ({
          queue: [...state.queue, queuedCompletion],
        }));

        return id;
      },

      removeFromQueue: (id) => {
        set((state) => ({
          queue: state.queue.filter((c) => c.id !== id),
        }));
      },

      updateStatus: (id, status) => {
        set((state) => ({
          queue: state.queue.map((c) => (c.id === id ? { ...c, status } : c)),
        }));
      },

      incrementRetry: (id) => {
        set((state) => ({
          queue: state.queue.map((c) =>
            c.id === id
              ? {
                  ...c,
                  retryCount: c.retryCount + 1,
                  status: c.retryCount + 1 >= MAX_RETRIES ? "failed" : "pending",
                }
              : c
          ),
        }));
      },

      clearQueue: () => {
        set({ queue: [] });
      },

      setOnline: (isOnline) => {
        set({ isOnline });
      },

      setSyncing: (isSyncing) => {
        set({ isSyncing });
      },

      setLastSyncAttempt: (timestamp) => {
        set({ lastSyncAttempt: timestamp });
      },

      getQueuedCompletion: (habitId, date) => {
        return get().queue.find(
          (c) => c.habitId === habitId && c.timestamp.startsWith(date) && c.status !== "failed"
        );
      },
    }),
    {
      name: "laurel-offline-queue",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        queue: state.queue,
        lastSyncAttempt: state.lastSyncAttempt,
      }),
    }
  )
);

/**
 * Hook to monitor online/offline status
 */
export function useOnlineStatus() {
  const { isOnline, setOnline } = useOfflineQueue();

  if (typeof window !== "undefined") {
    // Set up event listeners on mount
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Return cleanup function
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }

  return isOnline;
}

/**
 * Get pending completions count
 */
export function getPendingCompletionsCount(): number {
  const state = useOfflineQueue.getState();
  return state.queue.filter((c) => c.status === "pending").length;
}

/**
 * Check if a habit has a queued completion for today
 */
export function hasQueuedCompletionToday(habitId: string): boolean {
  const state = useOfflineQueue.getState();
  const today = new Date().toISOString().split("T")[0];
  return state.queue.some(
    (c) => c.habitId === habitId && c.timestamp.startsWith(today) && c.status !== "failed"
  );
}
