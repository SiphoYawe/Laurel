import { Plus, Users } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pods - Laurel",
  description: "Join accountability pods with friends.",
};

/**
 * Pods Page
 * Accountability pods for group motivation
 * Full implementation in Epic 5
 */
export default function PodsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-laurel-forest/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Users className="text-laurel-forest h-5 w-5" />
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-bold">Accountability Pods</h1>
            <p className="text-muted-foreground text-sm">Stay motivated with friends</p>
          </div>
        </div>

        <button
          disabled
          className="bg-laurel-forest inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white opacity-50"
          type="button"
        >
          <Plus className="h-4 w-4" />
          Create Pod
        </button>
      </div>

      {/* Empty State */}
      <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
        <div className="bg-laurel-sage/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Users className="text-laurel-sage h-8 w-8" />
        </div>
        <h3 className="text-foreground font-semibold">No pods yet</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-center text-sm">
          Create or join an accountability pod to stay motivated with friends and track progress
          together.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            disabled
            className="bg-laurel-forest inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white opacity-50"
            type="button"
          >
            Create a Pod
          </button>
          <button
            disabled
            className="border-laurel-forest text-laurel-forest inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium opacity-50"
            type="button"
          >
            Join with Code
          </button>
        </div>
      </div>

      {/* Placeholder for future pod list */}
      <div className="text-muted-foreground text-center text-sm">
        Accountability pods will be available in Epic 5
      </div>
    </div>
  );
}
