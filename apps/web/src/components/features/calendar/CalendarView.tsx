"use client";

import { useState, useCallback, useMemo } from "react";

import { CalendarHeader } from "./CalendarHeader";
import { DayDetail } from "./DayDetail";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";

import { useCalendarView } from "@/hooks/useCalendarView";
import { getStartOfWeek, addDays, addMonths } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

/**
 * CalendarView - Main calendar container
 * Story 3-6: Calendar View for Habits
 */

interface CalendarViewProps {
  className?: string;
}

export function CalendarView({ className }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [view, setView] = useState<"week" | "month">("week");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { habits, completedMap, isLoading } = useCalendarView(currentDate, view);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    if (view === "week") {
      setCurrentDate((prev) => addDays(prev, -7));
    } else {
      setCurrentDate((prev) => addMonths(prev, -1));
    }
  }, [view]);

  const handleNext = useCallback(() => {
    if (view === "week") {
      setCurrentDate((prev) => addDays(prev, 7));
    } else {
      setCurrentDate((prev) => addMonths(prev, 1));
    }
  }, [view]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleViewChange = useCallback((newView: "week" | "month") => {
    setView(newView);
  }, []);

  // Day selection handlers
  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsDetailOpen(true);
  }, []);

  const handleHabitClick = useCallback((habitId: string, date: Date) => {
    setSelectedDate(date);
    setIsDetailOpen(true);
  }, []);

  const handleTimeSlotClick = useCallback((date: Date, hour: number, minute: number) => {
    // Could open a create habit modal with pre-filled time
    setSelectedDate(date);
    setIsDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedDate(null);
  }, []);

  // Filter habits for selected day
  const selectedDayHabits = useMemo(() => {
    if (!selectedDate) return [];

    const dayOfWeek = selectedDate.getDay();

    return habits.filter((habit) => {
      if (habit.frequency === "daily") return true;
      if (habit.frequency === "weekdays") return dayOfWeek >= 1 && dayOfWeek <= 5;
      if (habit.frequency === "custom" && habit.frequencyDays) {
        return habit.frequencyDays.includes(dayOfWeek);
      }
      return true;
    });
  }, [selectedDate, habits]);

  if (isLoading) {
    return <CalendarSkeleton className={className} />;
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />

      {view === "week" ? (
        <WeekView
          className="h-[600px]"
          completedMap={completedMap}
          currentDate={currentDate}
          habits={habits}
          onHabitClick={handleHabitClick}
          onTimeSlotClick={handleTimeSlotClick}
        />
      ) : (
        <MonthView
          completedMap={completedMap}
          currentDate={currentDate}
          habits={habits}
          onDayClick={handleDayClick}
        />
      )}

      <DayDetail
        completedMap={completedMap}
        date={selectedDate}
        habits={selectedDayHabits}
        isOpen={isDetailOpen}
        onClose={handleDetailClose}
        onCreateHabit={() => {
          // Navigate to create habit or open modal
          console.log("Create habit for", selectedDate);
        }}
        onHabitComplete={(habitId) => {
          // Trigger habit completion
          console.log("Complete habit", habitId, "for", selectedDate);
        }}
      />
    </div>
  );
}

/**
 * Skeleton loading state
 */
function CalendarSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-9 w-9 rounded-md bg-gray-200" />
          <div className="h-9 w-9 rounded-md bg-gray-200" />
          <div className="h-9 w-16 rounded-md bg-gray-200" />
        </div>
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="h-9 w-32 rounded-lg bg-gray-200" />
      </div>

      {/* Calendar skeleton */}
      <div className="h-[600px] rounded-lg border bg-gray-50" />
    </div>
  );
}
