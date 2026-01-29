"use client";

import { getColorClassForCount } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

/**
 * CalendarLegend - Color scale legend for the streak calendar
 * Story 3-3: Streak Calendar Visualization
 */

interface CalendarLegendProps {
  className?: string;
}

export function CalendarLegend({ className }: CalendarLegendProps) {
  const levels = [
    { count: 0, label: "0" },
    { count: 1, label: "1" },
    { count: 2, label: "2-3" },
    { count: 4, label: "4+" },
  ];

  return (
    <div className={cn("text-muted-foreground flex items-center gap-1 text-xs", className)}>
      <span>Less</span>
      {levels.map(({ count }) => (
        <div
          key={count}
          className={cn("h-3 w-3 rounded-sm", getColorClassForCount(count))}
          title={`${count === 0 ? "0" : count === 1 ? "1" : count < 4 ? "2-3" : "4+"} completions`}
        />
      ))}
      <span>More</span>
    </div>
  );
}
