"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { HabitList } from "@/components/features/habits";
import { Button } from "@/components/ui/button";

/**
 * Habits Page
 * Displays user's habits with filtering and completion functionality
 * Implements Story 2-6: Visual Habit Card Component
 */
export default function HabitsPage() {
  const router = useRouter();

  const handleHabitPress = (habitId: string) => {
    // Navigate to habit detail page (to be implemented)
    router.push(`/habits/${habitId}`);
  };

  return (
    <div className="container max-w-2xl py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Habits</h1>
          <p className="text-muted-foreground">Build better habits, one day at a time</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/chat">
            <Plus className="h-4 w-4" />
            New Habit
          </Link>
        </Button>
      </div>

      {/* Habit List */}
      <HabitList onHabitPress={handleHabitPress} />
    </div>
  );
}
