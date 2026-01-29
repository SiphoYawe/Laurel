"use client";

import { useMemo } from "react";

import type { GrowthStage } from "@/lib/growth-calculations";

import { getGrowthStage, getStageMessage, GROWTH_STAGES } from "@/lib/growth-calculations";
import { trpc } from "@/lib/trpc/client";

/**
 * useGrowthStage - Hook for accessing growth stage data
 * Story 3-4: Plateau of Latent Potential Visualization
 */

export interface GrowthStageInfo {
  dayCount: number;
  stage: GrowthStage;
  stageName: string;
  stageTitle: string;
  stageMessage: string;
  daysInStage: number;
  daysToNextStage: number | null;
  progressInStage: number;
}

export function useGrowthStage() {
  const { data, isLoading, error } = trpc.progress.getUserDayCount.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const stageInfo = useMemo((): GrowthStageInfo | null => {
    if (!data) return null;

    const dayCount = data.dayCount;
    const stage = getGrowthStage(dayCount);
    const stageConfig = GROWTH_STAGES[stage];
    const message = getStageMessage(dayCount);

    // Calculate progress within current stage
    const daysInStage = dayCount - stageConfig.minDay + 1;
    const stageLength = stageConfig.maxDay - stageConfig.minDay + 1;
    const progressInStage =
      stageConfig.maxDay === Infinity ? 1 : Math.min(1, daysInStage / stageLength);

    // Calculate days to next stage
    const daysToNextStage =
      stageConfig.maxDay === Infinity ? null : stageConfig.maxDay - dayCount + 1;

    return {
      dayCount,
      stage,
      stageName: stageConfig.name,
      stageTitle: message.title,
      stageMessage: message.message,
      daysInStage,
      daysToNextStage,
      progressInStage,
    };
  }, [data]);

  return {
    stageInfo,
    dayCount: data?.dayCount ?? 0,
    firstHabitDate: data?.firstHabitDate ?? null,
    isLoading,
    error: error as Error | null,
  };
}
