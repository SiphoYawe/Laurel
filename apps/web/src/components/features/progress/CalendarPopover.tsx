"use client";

import * as Popover from "@radix-ui/react-popover";
import { X } from "lucide-react";

import type { CalendarDay } from "@/lib/calendar-utils";

import { formatDateLong, getCountDescription } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

/**
 * CalendarPopover - Day detail popover for the streak calendar
 * Story 3-3: Streak Calendar Visualization
 */

interface CalendarPopoverProps {
  day: CalendarDay | null;
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function CalendarPopover({
  day,
  isOpen,
  onClose,
  anchorRef,
  className,
}: CalendarPopoverProps) {
  if (!day) return null;

  return (
    <Popover.Root open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <Popover.Anchor asChild>
        <span ref={anchorRef as React.RefObject<HTMLSpanElement>} />
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          align="center"
          className={cn(
            "bg-popover animate-in fade-in-0 zoom-in-95 z-50 w-64 rounded-lg border p-3 shadow-md",
            className
          )}
          side="top"
          sideOffset={8}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{formatDateLong(day.date)}</h4>
                <p className="text-muted-foreground text-sm">
                  {getCountDescription(day.completionCount)}
                </p>
              </div>
              <Popover.Close asChild>
                <button
                  aria-label="Close"
                  className="hover:bg-muted rounded-full p-1"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </button>
              </Popover.Close>
            </div>

            {day.completions && day.completions.length > 0 && (
              <div className="border-t pt-2">
                <ul className="space-y-1.5">
                  {day.completions.map((completion, index) => {
                    const time = new Date(completion.completedAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    });
                    return (
                      <li
                        key={`${completion.habitId}-${index}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span className="truncate">{completion.habitTitle}</span>
                        </span>
                        <span className="text-muted-foreground text-xs">{time}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {day.completionCount === 0 && (
              <p className="text-muted-foreground text-sm italic">No habits completed this day</p>
            )}
          </div>
          <Popover.Arrow className="fill-popover" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
