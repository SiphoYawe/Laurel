"use client";

import { cn } from "@/lib/utils";

/**
 * FilterChips - Filter buttons for habit list
 */

export type HabitFilter = "all" | "today" | "completed";

interface FilterChipsProps {
  activeFilter: HabitFilter;
  onFilterChange: (filter: HabitFilter) => void;
  className?: string;
}

const FILTERS: { value: HabitFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "completed", label: "Completed" },
];

export function FilterChips({ activeFilter, onFilterChange, className }: FilterChipsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200",
            "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            activeFilter === filter.value
              ? "bg-forest-green text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
          type="button"
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
