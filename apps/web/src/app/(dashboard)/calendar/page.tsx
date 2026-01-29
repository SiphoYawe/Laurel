"use client";

import { CalendarView } from "@/components/features/calendar";

/**
 * Calendar Page
 * Story 3-6: Calendar View for Habits
 */

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">View and manage your habits schedule</p>
      </div>

      <CalendarView />
    </div>
  );
}
