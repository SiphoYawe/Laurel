import { Home } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Laurel",
  description: "Your habit tracking dashboard.",
};

/**
 * Dashboard/Home Page
 * Main landing page after login showing habit overview
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-laurel-forest/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <Home className="text-laurel-forest h-5 w-5" />
        </div>
        <div>
          <h1 className="text-foreground text-2xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground text-sm">Here&apos;s your habit overview</p>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border-border bg-card rounded-xl border p-6">
          <h3 className="text-foreground font-semibold">Today&apos;s Habits</h3>
          <p className="text-muted-foreground mt-1 text-sm">Coming in Epic 2</p>
          <div className="text-laurel-forest mt-4 text-3xl font-bold">0/0</div>
        </div>

        <div className="border-border bg-card rounded-xl border p-6">
          <h3 className="text-foreground font-semibold">Current Streak</h3>
          <p className="text-muted-foreground mt-1 text-sm">Coming in Epic 3</p>
          <div className="text-laurel-amber mt-4 text-3xl font-bold">0 days</div>
        </div>

        <div className="border-border bg-card rounded-xl border p-6">
          <h3 className="text-foreground font-semibold">XP Level</h3>
          <p className="text-muted-foreground mt-1 text-sm">Coming in Epic 4</p>
          <div className="text-laurel-sage mt-4 text-3xl font-bold">Level 1</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-border bg-card rounded-xl border p-6">
        <h2 className="text-foreground font-semibold">Quick Actions</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Chat with your AI coach to create your first habit!
        </p>
        <div className="mt-4 flex gap-3">
          <a
            className="bg-laurel-forest hover:bg-laurel-forest-light focus:ring-laurel-forest inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            href="/chat"
          >
            Start Coaching Session
          </a>
        </div>
      </div>
    </div>
  );
}
