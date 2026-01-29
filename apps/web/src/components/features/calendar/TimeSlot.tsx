"use client";

import { cn } from "@/lib/utils";

/**
 * TimeSlot - Empty time slot on calendar
 * Story 3-6: Calendar View for Habits
 */

interface TimeSlotProps {
  hour: number;
  minute: number;
  label: string;
  isCurrentHour?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TimeSlot({ label, isCurrentHour, onClick, className }: TimeSlotProps) {
  return (
    <div
      className={cn(
        "relative h-[30px] border-b border-gray-100 transition-colors",
        "cursor-pointer hover:bg-gray-50",
        isCurrentHour && "bg-amber-50/50",
        className
      )}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      {label && (
        <span className="text-muted-foreground absolute -top-2 left-0 z-10 bg-white pr-2 text-xs">
          {label}
        </span>
      )}
    </div>
  );
}
