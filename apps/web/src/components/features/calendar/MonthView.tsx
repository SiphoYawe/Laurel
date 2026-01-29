"use client";

import { useMemo } from "react";

import {
  getMonthGrid,
  formatDateKey,
  isToday,
  isInMonth,
  DAY_NAMES,
  getCategoryColor,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

/**
 * MonthView - Monthly calendar view with dot indicators
 * Story 3-6: Calendar View for Habits
 */

interface CalendarHabit {
  id: string;
  title: string;
  category: string;
  frequency: string;
  frequencyDays?: number[];
}

interface MonthViewProps {
  currentDate: Date;
  habits: CalendarHabit[];
  completedMap: Record<string, string>;
  onDayClick?: (date: Date) => void;
  className?: string;
}

export function MonthView({
  currentDate,
  habits,
  completedMap,
  onDayClick,
  className,
}: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthGrid = useMemo(() => getMonthGrid(year, month), [year, month]);

  // Check if a habit should be shown on a given day
  const shouldShowHabit = (habit: CalendarHabit, date: Date): boolean => {
    const dayOfWeek = date.getDay();

    if (habit.frequency === "daily") {
      return true;
    }

    if (habit.frequency === "weekdays") {
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    }

    if (habit.frequency === "custom" && habit.frequencyDays) {
      return habit.frequencyDays.includes(dayOfWeek);
    }

    return true;
  };

  // Get habits for a specific day
  const getHabitsForDay = (date: Date): CalendarHabit[] => {
    return habits.filter((habit) => shouldShowHabit(habit, date));
  };

  // Check if habit is completed for a day
  const isHabitCompleted = (habitId: string, date: Date): boolean => {
    const dateKey = formatDateKey(date);
    return !!completedMap[`${habitId}-${dateKey}`];
  };

  // Get completion status for a day
  const getDayStatus = (
    date: Date
  ): { habitsCount: number; completedCount: number; categories: string[] } => {
    const dayHabits = getHabitsForDay(date);
    const completedCount = dayHabits.filter((h) => isHabitCompleted(h.id, date)).length;
    const categories = [...new Set(dayHabits.map((h) => h.category))];

    return {
      habitsCount: dayHabits.length,
      completedCount,
      categories,
    };
  };

  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      {/* Day headers */}
      <div className="bg-muted/30 grid grid-cols-7 border-b">
        {DAY_NAMES.map((day) => (
          <div
            key={day}
            className="text-muted-foreground border-r py-2 text-center text-sm font-medium last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Month grid */}
      <div className="divide-y">
        {monthGrid.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((date) => {
              const dateKey = formatDateKey(date);
              const inCurrentMonth = isInMonth(date, month);
              const today = isToday(date);
              const { habitsCount, completedCount, categories } = getDayStatus(date);
              const allComplete = habitsCount > 0 && completedCount === habitsCount;

              return (
                <button
                  key={dateKey}
                  className={cn(
                    "relative min-h-[80px] border-r p-2 text-left transition-colors last:border-r-0",
                    "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset",
                    !inCurrentMonth && "bg-gray-50/50",
                    today && "bg-amber-50"
                  )}
                  type="button"
                  onClick={() => onDayClick?.(date)}
                >
                  {/* Date number */}
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
                      !inCurrentMonth && "text-muted-foreground",
                      today && "bg-warm-amber font-semibold text-white",
                      allComplete && !today && "bg-forest-green/10 text-forest-green"
                    )}
                  >
                    {date.getDate()}
                  </span>

                  {/* Habit indicators */}
                  {habitsCount > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {categories.slice(0, 3).map((category) => (
                        <span
                          key={category}
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: getCategoryColor(category) }}
                        />
                      ))}
                      {categories.length > 3 && (
                        <span className="text-muted-foreground text-[10px]">
                          +{categories.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Completion indicator */}
                  {habitsCount > 0 && (
                    <div className="absolute bottom-1 right-1 text-[10px]">
                      <span
                        className={cn(
                          "font-medium",
                          allComplete ? "text-forest-green" : "text-muted-foreground"
                        )}
                      >
                        {completedCount}/{habitsCount}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
