"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { CalendarCell } from "./CalendarCell";
import { CalendarLegend } from "./CalendarLegend";
import { CalendarPopover } from "./CalendarPopover";

import type { CalendarDay } from "@/lib/calendar-utils";

import {
  DAY_NAMES,
  DAY_NAMES_SHORT,
  buildCalendarData,
  generateWeeks,
  getMonthLabel,
  isFirstOfMonth,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

/**
 * StreakCalendar - GitHub-style heatmap calendar for habit completions
 * Story 3-3: Streak Calendar Visualization
 */

interface Completion {
  habitId: string;
  habitTitle: string;
  completedAt: string;
}

interface StreakCalendarProps {
  completionsByDate?: Record<string, Completion[]>;
  numberOfWeeks?: number;
  maxWeeks?: number;
  showDayLabels?: boolean;
  showMonthLabels?: boolean;
  showLegend?: boolean;
  cellSize?: "sm" | "md";
  className?: string;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export function StreakCalendar({
  completionsByDate = {},
  numberOfWeeks = 12,
  showDayLabels = true,
  showMonthLabels = true,
  showLegend = true,
  cellSize = "md",
  className,
}: StreakCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverAnchorRef = useRef<HTMLElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate weeks ending today
  const today = useMemo(() => new Date(), []);
  const weeks = useMemo(() => generateWeeks(today, numberOfWeeks), [today, numberOfWeeks]);

  // Build calendar data with completions
  const calendarData = useMemo(
    () => buildCalendarData(weeks, completionsByDate),
    [weeks, completionsByDate]
  );

  // Find month boundaries for labels
  const monthLabels = useMemo(() => {
    const labels: { weekIndex: number; month: string }[] = [];
    let lastMonth = "";

    calendarData.forEach((week, weekIndex) => {
      // Check first day of week for month change
      const firstDay = week.days[0];
      const month = getMonthLabel(firstDay.date);

      if (month !== lastMonth) {
        labels.push({ weekIndex, month });
        lastMonth = month;
      }

      // Also check if any day is first of month
      week.days.forEach((day) => {
        if (isFirstOfMonth(day.date)) {
          const dayMonth = getMonthLabel(day.date);
          if (dayMonth !== lastMonth && !labels.find((l) => l.month === dayMonth)) {
            labels.push({ weekIndex, month: dayMonth });
            lastMonth = dayMonth;
          }
        }
      });
    });

    return labels;
  }, [calendarData]);

  const handleCellClick = useCallback((day: CalendarDay, event: React.MouseEvent) => {
    setSelectedDay(day);
    setIsPopoverOpen(true);
    popoverAnchorRef.current = event.currentTarget as HTMLElement;
  }, []);

  const handlePopoverClose = useCallback(() => {
    setIsPopoverOpen(false);
    setSelectedDay(null);
  }, []);

  const cellSizeClass = cellSize === "sm" ? "gap-0.5" : "gap-[3px]";

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header with title and legend */}
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm font-medium">
          {calendarData.reduce(
            (total, week) =>
              total + week.days.reduce((dayTotal, day) => dayTotal + day.completionCount, 0),
            0
          )}{" "}
          completions in the last {numberOfWeeks} weeks
        </h3>
        {showLegend && <CalendarLegend />}
      </div>

      {/* Scrollable calendar container */}
      <div
        ref={scrollContainerRef}
        className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 overflow-x-auto pb-2"
      >
        <div className="inline-flex flex-col">
          {/* Month labels row */}
          {showMonthLabels && (
            <div
              className={cn("flex", cellSizeClass)}
              style={{ marginLeft: showDayLabels ? "28px" : 0 }}
            >
              {calendarData.map((_, weekIndex) => {
                const label = monthLabels.find((l) => l.weekIndex === weekIndex);
                return (
                  <div
                    key={weekIndex}
                    className={cn(
                      "text-muted-foreground text-xs",
                      cellSize === "sm" ? "w-3" : "w-4"
                    )}
                  >
                    {label?.month || ""}
                  </div>
                );
              })}
            </div>
          )}

          {/* Calendar grid */}
          <div className="flex">
            {/* Day labels column */}
            {showDayLabels && (
              <div className={cn("mr-1 flex flex-col", cellSizeClass)}>
                {DAY_NAMES.map((day, index) => (
                  <div
                    key={day}
                    className={cn(
                      "text-muted-foreground flex items-center justify-end pr-1 text-xs",
                      cellSize === "sm" ? "h-3 w-6" : "h-4 w-7"
                    )}
                  >
                    {/* Show every other day on small screens */}
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">
                      {index % 2 === 0 ? DAY_NAMES_SHORT[index] : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Week columns */}
            <div className={cn("flex", cellSizeClass)}>
              {calendarData.map((week, weekIndex) => (
                <div key={weekIndex} className={cn("flex flex-col", cellSizeClass)}>
                  {week.days.map((day) => (
                    <CalendarCell
                      key={day.dateKey}
                      day={day}
                      size={cellSize}
                      onClick={(d) =>
                        handleCellClick(d, {
                          currentTarget: document.activeElement,
                        } as unknown as React.MouseEvent)
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popover for day details */}
      <CalendarPopover
        anchorRef={popoverAnchorRef}
        day={selectedDay}
        isOpen={isPopoverOpen}
        onClose={handlePopoverClose}
      />
    </div>
  );
}

/**
 * StreakCalendarSkeleton - Loading state for the calendar
 */
export function StreakCalendarSkeleton({
  numberOfWeeks = 12,
  className,
}: {
  numberOfWeeks?: number;
  className?: string;
}) {
  return (
    <div className={cn("animate-pulse space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="bg-muted h-4 w-48 rounded" />
        <div className="bg-muted h-4 w-24 rounded" />
      </div>
      <div className="flex gap-[3px]">
        <div className="mr-1 flex flex-col gap-[3px]">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-muted h-4 w-7 rounded" />
          ))}
        </div>
        {Array.from({ length: numberOfWeeks }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <div key={dayIndex} className="bg-muted h-4 w-4 rounded-sm" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
