"use client";

import { create } from "zustand";

/**
 * Celebration Queue - Manages celebration events
 * Story 3-5: Micro-Wins Celebration System
 */

export type CelebrationLevel = "small" | "medium" | "large";

export type CelebrationType = "completion" | "daily_complete" | "milestone" | "badge" | "level_up";

export interface CelebrationEvent {
  id: string;
  type: CelebrationType;
  level: CelebrationLevel;
  data: {
    habitName?: string;
    streakDays?: number;
    badgeId?: string;
    badgeName?: string;
    badgeEmoji?: string;
    newLevel?: number;
    xpEarned?: number;
    message?: string;
  };
  createdAt: Date;
}

// Priority: level_up > badge > milestone > daily_complete > completion
export const CELEBRATION_PRIORITY: Record<CelebrationType, number> = {
  level_up: 5,
  badge: 4,
  milestone: 3,
  daily_complete: 2,
  completion: 1,
};

// Level configurations
export const CELEBRATION_CONFIG: Record<
  CelebrationLevel,
  { duration: number; reducedDuration: number }
> = {
  small: { duration: 300, reducedDuration: 150 },
  medium: { duration: 2000, reducedDuration: 500 },
  large: { duration: 3000, reducedDuration: 1000 },
};

// Growth palette for confetti
export const CONFETTI_COLORS = [
  "#2D5A3D", // Forest Green
  "#7CB07F", // Sage
  "#E8A54B", // Warm Amber
  "#c6e2c8", // Light Sage
];

interface CelebrationQueueState {
  queue: CelebrationEvent[];
  currentCelebration: CelebrationEvent | null;
  isShowing: boolean;

  // Actions
  addCelebration: (event: Omit<CelebrationEvent, "id" | "createdAt">) => void;
  showNextCelebration: () => void;
  dismissCurrent: () => void;
  clearQueue: () => void;
}

export const useCelebrationQueue = create<CelebrationQueueState>((set, get) => ({
  queue: [],
  currentCelebration: null,
  isShowing: false,

  addCelebration: (event) => {
    const newEvent: CelebrationEvent = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    set((state) => {
      const newQueue = [...state.queue, newEvent].sort(
        (a, b) => CELEBRATION_PRIORITY[b.type] - CELEBRATION_PRIORITY[a.type]
      );

      return { queue: newQueue };
    });

    // Auto-show if nothing is showing
    const { isShowing } = get();
    if (!isShowing) {
      get().showNextCelebration();
    }
  },

  showNextCelebration: () => {
    set((state) => {
      if (state.queue.length === 0) {
        return { currentCelebration: null, isShowing: false };
      }

      const [next, ...remaining] = state.queue;
      return {
        currentCelebration: next,
        queue: remaining,
        isShowing: true,
      };
    });
  },

  dismissCurrent: () => {
    const { showNextCelebration } = get();
    set({ currentCelebration: null, isShowing: false });

    // Small delay before showing next
    setTimeout(() => {
      showNextCelebration();
    }, 200);
  },

  clearQueue: () => {
    set({ queue: [], currentCelebration: null, isShowing: false });
  },
}));

/**
 * Helper to create celebration events
 */
export function createCompletionCelebration(
  habitName: string,
  xpEarned: number = 10
): Omit<CelebrationEvent, "id" | "createdAt"> {
  return {
    type: "completion",
    level: "small",
    data: { habitName, xpEarned, message: "Great job!" },
  };
}

export function createDailyCompleteCelebration(
  totalHabits: number
): Omit<CelebrationEvent, "id" | "createdAt"> {
  return {
    type: "daily_complete",
    level: "medium",
    data: {
      message: `All ${totalHabits} habits complete!`,
      xpEarned: 50,
    },
  };
}

export function createMilestoneCelebration(
  streakDays: number,
  badgeName: string,
  badgeEmoji: string
): Omit<CelebrationEvent, "id" | "createdAt"> {
  return {
    type: "milestone",
    level: "large",
    data: {
      streakDays,
      badgeName,
      badgeEmoji,
      message: `${streakDays}-Day Streak!`,
      xpEarned: streakDays * 10,
    },
  };
}

export function createBadgeCelebration(
  badgeId: string,
  badgeName: string,
  badgeEmoji: string
): Omit<CelebrationEvent, "id" | "createdAt"> {
  return {
    type: "badge",
    level: "large",
    data: {
      badgeId,
      badgeName,
      badgeEmoji,
      message: "Badge Earned!",
      xpEarned: 100,
    },
  };
}

export function createLevelUpCelebration(
  newLevel: number,
  levelName: string
): Omit<CelebrationEvent, "id" | "createdAt"> {
  return {
    type: "level_up",
    level: "large",
    data: {
      newLevel,
      message: `Level Up! You're now ${levelName}!`,
      xpEarned: newLevel * 50,
    },
  };
}
