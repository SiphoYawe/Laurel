import { CheckCircle, Plus } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Habits - Laurel",
  description: "Track and manage your habits.",
};

/**
 * Habits Page
 * Habit tracking and management interface
 * Full implementation in Epic 2 & 3
 */
export default function HabitsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-laurel-forest/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <CheckCircle className="text-laurel-forest h-5 w-5" />
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-bold">My Habits</h1>
            <p className="text-muted-foreground text-sm">Track your daily habits</p>
          </div>
        </div>

        <button
          disabled
          className="bg-laurel-forest inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white opacity-50"
          type="button"
        >
          <Plus className="h-4 w-4" />
          Add Habit
        </button>
      </div>

      {/* Empty State */}
      <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
        <div className="bg-laurel-sage/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle className="text-laurel-sage h-8 w-8" />
        </div>
        <h3 className="text-foreground font-semibold">No habits yet</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-center text-sm">
          Start a coaching session to create your first habit using the Atomic Habits methodology.
        </p>
        <a
          className="bg-laurel-forest hover:bg-laurel-forest-light focus:ring-laurel-forest mt-4 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
          href="/chat"
        >
          Create Your First Habit
        </a>
      </div>

      {/* Placeholder for future habit list */}
      <div className="text-muted-foreground text-center text-sm">
        Habit cards and tracking will be available in Epic 2 & 3
      </div>
    </div>
  );
}
