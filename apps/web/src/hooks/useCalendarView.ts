"use client";

import { useMemo } from "react";

import { getStartOfWeek, getEndOfWeek, addDays, formatDateKey } from "@/lib/calendar-utils";
import { trpc } from "@/lib/trpc/client";

/**
 * useCalendarView - Hook for calendar data fetching
 * Story 3-6: Calendar View for Habits
 */

export function useCalendarView(currentDate: Date, view: "week" | "month") {
  // Calculate date range based on view
  const { startDate, endDate } = useMemo(() => {
    if (view === "week") {
      const start = getStartOfWeek(currentDate);
      const end = getEndOfWeek(currentDate);
      return {
        startDate: formatDateKey(start),
        endDate: formatDateKey(end),
      };
    }

    // Month view - get first day of month and last day
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Extend to include full weeks
    const weekStart = getStartOfWeek(start);
    const weekEnd = addDays(getStartOfWeek(end), 6);

    return {
      startDate: formatDateKey(weekStart),
      endDate: formatDateKey(weekEnd),
    };
  }, [currentDate, view]);

  // Fetch habits with completion data
  const { data, isLoading, error, refetch } = trpc.progress.getHabitsForCalendar.useQuery(
    { startDate, endDate },
    {
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: true,
    }
  );

  return {
    habits: data?.habits || [],
    completedMap: data?.completedMap || {},
    isLoading,
    error,
    refetch,
    dateRange: { startDate, endDate },
  };
}
