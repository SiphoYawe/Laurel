"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getMonthYearHeader,
  getStartOfWeek,
  getEndOfWeek,
  formatDateLong,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

/**
 * CalendarHeader - Navigation controls for calendar
 * Story 3-6: Calendar View for Habits
 */

interface CalendarHeaderProps {
  currentDate: Date;
  view: "week" | "month";
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: "week" | "month") => void;
  className?: string;
}

export function CalendarHeader({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  className,
}: CalendarHeaderProps) {
  const getHeaderText = () => {
    if (view === "month") {
      return getMonthYearHeader(currentDate);
    }

    const weekStart = getStartOfWeek(currentDate);
    const weekEnd = getEndOfWeek(currentDate);

    // If same month, show "Jan 1 - 7, 2026"
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${weekStart.toLocaleDateString("en-US", { month: "short" })} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
    }

    // Different months: "Jan 29 - Feb 4, 2026"
    return `${weekStart.toLocaleDateString("en-US", { month: "short" })} ${weekStart.getDate()} - ${weekEnd.toLocaleDateString("en-US", { month: "short" })} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;
  };

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button className="ml-2" size="sm" variant="outline" onClick={onToday}>
          Today
        </Button>
      </div>

      {/* Header text */}
      <h2 className="flex-1 text-center text-lg font-semibold">{getHeaderText()}</h2>

      {/* View toggle */}
      <div className="flex rounded-lg border bg-gray-50 p-1">
        <button
          className={cn(
            "rounded-md px-3 py-1 text-sm font-medium transition-colors",
            view === "week" ? "bg-white shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
          type="button"
          onClick={() => onViewChange("week")}
        >
          Week
        </button>
        <button
          className={cn(
            "rounded-md px-3 py-1 text-sm font-medium transition-colors",
            view === "month" ? "bg-white shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
          type="button"
          onClick={() => onViewChange("month")}
        >
          Month
        </button>
      </div>
    </div>
  );
}
