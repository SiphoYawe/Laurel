"use client";

import { Leaf, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * EmptyHabitsState - Shown when user has no habits
 */

interface EmptyHabitsStateProps {
  filter?: "all" | "today" | "completed";
}

export function EmptyHabitsState({ filter = "all" }: EmptyHabitsStateProps) {
  // Different messages based on filter
  if (filter === "completed") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted mb-4 rounded-full p-4">
          <Leaf className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-medium">No completed habits today</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Start completing your habits to see them here. Even small progress counts!
        </p>
      </div>
    );
  }

  if (filter === "today") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted mb-4 rounded-full p-4">
          <Leaf className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-medium">No habits scheduled for today</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Check your habit frequency settings or create new daily habits.
        </p>
      </div>
    );
  }

  // Default: No habits at all
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-forest-green/10 mb-4 rounded-full p-4">
        <Leaf className="text-forest-green h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-medium">Create your first habit</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Start building better habits with Laurel. Chat with our AI coach or create a habit directly.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="gap-2">
          <Link href="/chat">
            <MessageCircle className="h-4 w-4" />
            Chat with Coach
          </Link>
        </Button>
        <Button className="gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          Create Habit
        </Button>
      </div>
    </div>
  );
}
