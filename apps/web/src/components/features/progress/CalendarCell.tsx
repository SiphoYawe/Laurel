"use client";

import { motion } from "framer-motion";

import type { CalendarDay } from "@/lib/calendar-utils";

import {
  getColorClassForCount,
  getCountDescription,
  isToday,
  isFuture,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

/**
 * CalendarCell - Individual day cell in the streak calendar
 * Story 3-3: Streak Calendar Visualization
 */

interface CalendarCellProps {
  day: CalendarDay;
  size?: "sm" | "md";
  onClick?: (day: CalendarDay) => void;
  className?: string;
}

export function CalendarCell({ day, size = "md", onClick, className }: CalendarCellProps) {
  const isTodayDate = isToday(day.date);
  const isFutureDate = isFuture(day.date);

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
  };

  const handleClick = () => {
    if (onClick && !isFutureDate) {
      onClick(day);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && onClick && !isFutureDate) {
      e.preventDefault();
      onClick(day);
    }
  };

  return (
    <motion.button
      aria-label={`${day.date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}: ${getCountDescription(day.completionCount)}`}
      className={cn(
        "focus:ring-forest-green rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1",
        sizeClasses[size],
        isFutureDate
          ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
          : getColorClassForCount(day.completionCount),
        isTodayDate && "ring-forest-green ring-2 ring-offset-1",
        !isFutureDate && "cursor-pointer hover:opacity-80",
        className
      )}
      disabled={isFutureDate}
      tabIndex={isFutureDate ? -1 : 0}
      title={`${day.date.toLocaleDateString()}: ${getCountDescription(day.completionCount)}`}
      whileHover={isFutureDate ? {} : { scale: 1.2 }}
      whileTap={isFutureDate ? {} : { scale: 0.9 }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    />
  );
}
