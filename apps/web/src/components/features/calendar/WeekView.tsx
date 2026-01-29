"use client";

import { useMemo, useRef, useEffect } from "react";

import { HabitBlock } from "./HabitBlock";
import { TimeSlot } from "./TimeSlot";

import {
  generateTimeSlots,
  getWeekDates,
  getStartOfWeek,
  formatDateKey,
  isToday,
  getCurrentTimePosition,
  DAY_NAMES,
  TIME_CONFIG,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

/**
 * WeekView - Weekly calendar view with time slots
 * Story 3-6: Calendar View for Habits
 */

interface CalendarHabit {
  id: string;
  title: string;
  targetTime: string;
  durationMinutes: number;
  category: string;
  frequency: string;
  frequencyDays?: number[];
}

interface WeekViewProps {
  currentDate: Date;
  habits: CalendarHabit[];
  completedMap: Record<string, string>;
  onHabitClick?: (habitId: string, date: Date) => void;
  onTimeSlotClick?: (date: Date, hour: number, minute: number) => void;
  className?: string;
}

export function WeekView({
  currentDate,
  habits,
  completedMap,
  onHabitClick,
  onTimeSlotClick,
  className,
}: WeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const weekStart = getStartOfWeek(currentDate);
  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);
  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const currentTimePos = getCurrentTimePosition();

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollRef.current && currentTimePos !== null) {
      const scrollTop = Math.max(0, currentTimePos - 100);
      scrollRef.current.scrollTop = scrollTop;
    }
  }, [currentTimePos]);

  // Check if a habit should be shown on a given day
  const shouldShowHabit = (habit: CalendarHabit, date: Date): boolean => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

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

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-lg border", className)}>
      {/* Day headers */}
      <div className="bg-muted/30 flex border-b">
        {/* Time column spacer */}
        <div className="w-16 shrink-0 border-r" />

        {/* Day columns */}
        {weekDates.map((date, index) => (
          <div
            key={formatDateKey(date)}
            className={cn(
              "flex-1 border-r py-2 text-center last:border-r-0",
              isToday(date) && "bg-amber-50"
            )}
          >
            <div className="text-muted-foreground text-xs">{DAY_NAMES[index]}</div>
            <div className={cn("text-lg font-semibold", isToday(date) && "text-warm-amber")}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="relative flex-1 overflow-auto">
        <div className="relative flex">
          {/* Time labels column */}
          <div className="sticky left-0 z-20 w-16 shrink-0 border-r bg-white">
            {timeSlots.map((slot) => (
              <div
                key={`${slot.hour}-${slot.minute}`}
                className="relative h-[30px] border-b border-gray-100"
              >
                {slot.label && (
                  <span className="text-muted-foreground absolute -top-2 right-2 text-xs">
                    {slot.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Day columns with time slots */}
          {weekDates.map((date) => {
            const dayHabits = getHabitsForDay(date);

            return (
              <div
                key={formatDateKey(date)}
                className={cn(
                  "relative flex-1 border-r last:border-r-0",
                  isToday(date) && "bg-amber-50/30"
                )}
              >
                {/* Time slots */}
                {timeSlots.map((slot) => (
                  <TimeSlot
                    key={`${slot.hour}-${slot.minute}`}
                    hour={slot.hour}
                    label=""
                    minute={slot.minute}
                    onClick={() => onTimeSlotClick?.(date, slot.hour, slot.minute)}
                  />
                ))}

                {/* Habit blocks */}
                {dayHabits.map((habit) => (
                  <HabitBlock
                    key={`${habit.id}-${formatDateKey(date)}`}
                    category={habit.category}
                    durationMinutes={habit.durationMinutes}
                    id={habit.id}
                    isCompleted={isHabitCompleted(habit.id, date)}
                    targetTime={habit.targetTime}
                    title={habit.title}
                    onClick={() => onHabitClick?.(habit.id, date)}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* Current time indicator */}
        {currentTimePos !== null && (
          <div
            className="pointer-events-none absolute left-16 right-0 z-30 border-t-2 border-red-500"
            style={{ top: `${currentTimePos}px` }}
          >
            <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
          </div>
        )}
      </div>
    </div>
  );
}
