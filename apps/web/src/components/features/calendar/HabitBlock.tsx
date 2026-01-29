"use client";

import { Check } from "lucide-react";

import { calculateBlockPosition, formatTime, getCategoryColor } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

/**
 * HabitBlock - Habit display on calendar
 * Story 3-6: Calendar View for Habits
 */

interface HabitBlockProps {
  id: string;
  title: string;
  targetTime: string;
  durationMinutes: number;
  category: string;
  isCompleted: boolean;
  onClick?: () => void;
  className?: string;
}

export function HabitBlock({
  title,
  targetTime,
  durationMinutes,
  category,
  isCompleted,
  onClick,
  className,
}: HabitBlockProps) {
  const { top, height } = calculateBlockPosition(targetTime, durationMinutes);
  const bgColor = getCategoryColor(category);

  return (
    <button
      className={cn(
        "absolute left-0 right-0 mx-1 overflow-hidden rounded px-2 py-1 text-left text-xs transition-opacity",
        "hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-1",
        isCompleted && "opacity-70",
        className
      )}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: bgColor,
        minHeight: "24px",
      }}
      type="button"
      onClick={onClick}
    >
      <div className="flex h-full items-start justify-between gap-1">
        <div className="flex-1 overflow-hidden">
          <p
            className={cn(
              "truncate font-medium text-white",
              height < 40 ? "text-[10px]" : "text-xs"
            )}
          >
            {title}
          </p>
          {height >= 40 && (
            <p className="truncate text-[10px] text-white/80">{formatTime(targetTime)}</p>
          )}
        </div>
        {isCompleted && (
          <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-white/30">
            <Check className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}
