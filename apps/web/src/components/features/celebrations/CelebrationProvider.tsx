"use client";

import { createContext, useContext, type ReactNode } from "react";

import { AchievementToast } from "./AchievementToast";
import { CelebrationOverlay } from "./CelebrationOverlay";

import { useCelebration } from "@/hooks/useCelebration";
import { useCelebrationQueue } from "@/lib/celebration-queue";

/**
 * CelebrationProvider - Context provider for celebration system
 * Story 3-5: Micro-Wins Celebration System
 */

type CelebrationContextType = ReturnType<typeof useCelebration>;

const CelebrationContext = createContext<CelebrationContextType | null>(null);

interface CelebrationProviderProps {
  children: ReactNode;
}

export function CelebrationProvider({ children }: CelebrationProviderProps) {
  const celebration = useCelebration();
  const { currentCelebration, isShowing, dismissCurrent } = useCelebrationQueue();

  // Show toast for small celebrations only
  const showToast = isShowing && currentCelebration && currentCelebration.level === "small";

  return (
    <CelebrationContext.Provider value={celebration}>
      {children}

      {/* Overlay for medium/large celebrations */}
      <CelebrationOverlay />

      {/* Toast for small celebrations */}
      <AchievementToast
        emoji={currentCelebration?.data.badgeEmoji}
        isVisible={!!showToast}
        message={currentCelebration?.data.message || "Great job!"}
        xp={currentCelebration?.data.xpEarned}
        onComplete={dismissCurrent}
      />
    </CelebrationContext.Provider>
  );
}

/**
 * Hook to access celebration context
 */
export function useCelebrationContext() {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error("useCelebrationContext must be used within a CelebrationProvider");
  }
  return context;
}
