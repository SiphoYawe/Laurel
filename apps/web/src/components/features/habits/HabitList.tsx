"use client";

import { useCallback, useMemo, useState } from "react";

import { EmptyHabitsState } from "./EmptyHabitsState";
import { FilterChips, type HabitFilter } from "./FilterChips";
import { HabitCard } from "./HabitCard";

import type { HabitCategory } from "./CategoryIndicator";

import { trpc } from "@/lib/trpc/client";

/**
 * HabitList - Container component for displaying and filtering habits
 */

interface HabitListProps {
  onHabitPress?: (habitId: string) => void;
}

export function HabitList({ onHabitPress }: HabitListProps) {
  const [filter, setFilter] = useState<HabitFilter>("all");

  // Fetch habits
  const {
    data: habits,
    isLoading,
    error,
    refetch,
  } = trpc.habits.list.useQuery({
    filter: "active",
  });

  // Complete habit mutation
  const completeMutation = trpc.habits.complete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Uncomplete habit mutation
  const uncompleteMutation = trpc.habits.uncomplete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Handle habit completion
  const handleComplete = useCallback(
    (habitId: string, isCompleted: boolean) => {
      if (isCompleted) {
        uncompleteMutation.mutate({ habitId });
      } else {
        completeMutation.mutate({ habitId });
      }
    },
    [completeMutation, uncompleteMutation]
  );

  // Handle habit press (navigate to detail)
  const handleHabitPress = useCallback(
    (habitId: string) => {
      onHabitPress?.(habitId);
    },
    [onHabitPress]
  );

  // Filter habits based on selected filter
  const filteredHabits = useMemo(() => {
    if (!habits) return [];

    switch (filter) {
      case "today":
        // For now, show all active habits as "today"
        // In a real app, this would check frequency settings
        return habits.filter((h) => !h.isCompletedToday);
      case "completed":
        return habits.filter((h) => h.isCompletedToday);
      default:
        return habits;
    }
  }, [habits, filter]);

  // Sort habits: incomplete first, then by creation date
  const sortedHabits = useMemo(() => {
    return [...filteredHabits].sort((a, b) => {
      // Incomplete habits first
      if (a.isCompletedToday !== b.isCompletedToday) {
        return a.isCompletedToday ? 1 : -1;
      }
      // Then by streak (higher streak first)
      return (b.streak?.current_streak || 0) - (a.streak?.current_streak || 0);
    });
  }, [filteredHabits]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <FilterChips activeFilter={filter} onFilterChange={setFilter} />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted h-24 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">Failed to load habits</p>
        <button
          className="text-muted-foreground mt-2 text-sm hover:underline"
          onClick={() => refetch()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FilterChips activeFilter={filter} onFilterChange={setFilter} />

      {sortedHabits.length === 0 ? (
        <EmptyHabitsState filter={filter} />
      ) : (
        <div className="space-y-3">
          {sortedHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={{
                id: habit.id,
                title: habit.title,
                cue_trigger: habit.cue_trigger,
                duration_minutes: habit.duration_minutes,
                category: habit.category as HabitCategory,
                is_active: habit.is_active,
              }}
              isCompletedToday={habit.isCompletedToday}
              isLoading={
                (completeMutation.isPending && completeMutation.variables?.habitId === habit.id) ||
                (uncompleteMutation.isPending && uncompleteMutation.variables?.habitId === habit.id)
              }
              streak={{
                current_streak: habit.streak?.current_streak || 0,
                longest_streak: habit.streak?.longest_streak || 0,
              }}
              onComplete={() => handleComplete(habit.id, habit.isCompletedToday)}
              onPress={() => handleHabitPress(habit.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
