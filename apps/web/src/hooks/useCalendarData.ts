"use client";

import { useMemo } from "react";

import { trpc } from "@/lib/trpc/client";

/**
 * useCalendarData - Hook for fetching calendar completion data
 * Story 3-3: Streak Calendar Visualization
 */

export interface CalendarCompletion {
  habitId: string;
  habitTitle: string;
  completedAt: string;
}

export interface CalendarDataResult {
  completionsByDate: Record<string, CalendarCompletion[]>;
  isLoading: boolean;
  error: Error | null;
  totalCompletions: number;
}

export function useCalendarData(weeks: number = 12): CalendarDataResult {
  // Calculate date range
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const start = new Date(end);
    start.setDate(start.getDate() - weeks * 7);
    start.setHours(0, 0, 0, 0);

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [weeks]);

  // Fetch calendar data from API
  const { data, isLoading, error } = trpc.progress.getCalendarData.useQuery(
    { startDate, endDate },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );

  // Process data into completionsByDate format
  const completionsByDate = useMemo(() => {
    if (!data?.completions) return {};

    const byDate: Record<string, CalendarCompletion[]> = {};

    for (const completion of data.completions) {
      const dateKey = completion.completedAt.split("T")[0];
      if (!byDate[dateKey]) {
        byDate[dateKey] = [];
      }
      byDate[dateKey].push({
        habitId: completion.habitId,
        habitTitle: completion.habitTitle,
        completedAt: completion.completedAt,
      });
    }

    return byDate;
  }, [data]);

  const totalCompletions = useMemo(() => {
    return Object.values(completionsByDate).reduce((sum, arr) => sum + arr.length, 0);
  }, [completionsByDate]);

  return {
    completionsByDate,
    isLoading,
    error: error as Error | null,
    totalCompletions,
  };
}
