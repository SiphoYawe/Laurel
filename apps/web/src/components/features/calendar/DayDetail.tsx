"use client";

import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatDateLong, formatTime, getCategoryColor } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

/**
 * DayDetail - Bottom sheet for day details
 * Story 3-6: Calendar View for Habits
 */

interface CalendarHabit {
  id: string;
  title: string;
  targetTime: string;
  category: string;
}

interface DayDetailProps {
  date: Date | null;
  habits: CalendarHabit[];
  completedMap: Record<string, string>;
  isOpen: boolean;
  onClose: () => void;
  onHabitComplete?: (habitId: string) => void;
  onCreateHabit?: () => void;
}

export function DayDetail({
  date,
  habits,
  completedMap,
  isOpen,
  onClose,
  onHabitComplete,
  onCreateHabit,
}: DayDetailProps) {
  if (!date) return null;

  const dateKey = date.toISOString().split("T")[0];

  const isCompleted = (habitId: string): boolean => {
    return !!completedMap[`${habitId}-${dateKey}`];
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md" side="bottom">
        <SheetHeader>
          <SheetTitle>{formatDateLong(date)}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          {habits.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <p>No habits scheduled for this day</p>
            </div>
          ) : (
            habits.map((habit) => {
              const completed = isCompleted(habit.id);

              return (
                <div
                  key={habit.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                    completed && "bg-muted/50"
                  )}
                >
                  <button
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      completed
                        ? "border-forest-green bg-forest-green text-white"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                    type="button"
                    onClick={() => onHabitComplete?.(habit.id)}
                  >
                    {completed && <Check className="h-4 w-4" />}
                  </button>

                  <div className="flex-1">
                    <p className={cn("font-medium", completed && "line-through opacity-70")}>
                      {habit.title}
                    </p>
                    <p className="text-muted-foreground text-sm">{formatTime(habit.targetTime)}</p>
                  </div>

                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(habit.category) }}
                  />
                </div>
              );
            })
          )}

          <Button className="w-full" variant="outline" onClick={onCreateHabit}>
            <Plus className="mr-2 h-4 w-4" />
            Add Habit
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
