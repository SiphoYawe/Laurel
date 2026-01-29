"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, X, Save, Trash2 } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import { DraggableHabitCard, DraggableHabitCardOverlay } from "./DraggableHabitCard";
import { StackConnectionLine } from "./StackConnection";
import { StackPreview } from "./StackPreview";

import type { HabitCategory } from "./CategoryIndicator";
import type { DragEndEvent, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";

import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

/**
 * HabitStackBuilder - Drag-and-drop habit stacking interface
 * Story 2-7: Habit Stack Builder with Drag-Drop
 */

interface HabitData {
  id: string;
  title: string;
  cue_trigger?: string | null;
  category: HabitCategory;
  duration_minutes?: number | null;
  two_minute_version?: string | null;
}

interface HabitStackBuilderProps {
  habits: HabitData[];
  onSave?: (stackedIds: string[], standaloneIds: string[]) => void;
  onClose?: () => void;
  className?: string;
}

export function HabitStackBuilder({ habits, onSave, onClose, className }: HabitStackBuilderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Separate habits into stacked and standalone
  const [stackedIds, setStackedIds] = useState<string[]>(() => {
    // Initialize with habits that have habit: cue triggers
    const stacked: string[] = [];
    const idSet = new Set(habits.map((h) => h.id));

    habits.forEach((habit) => {
      if (habit.cue_trigger?.startsWith("habit:")) {
        const parentId = habit.cue_trigger.replace("habit:", "");
        if (idSet.has(parentId) && !stacked.includes(parentId)) {
          stacked.push(parentId);
        }
        if (!stacked.includes(habit.id)) {
          stacked.push(habit.id);
        }
      }
    });

    return stacked;
  });

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Computed habit lists
  const stackedHabits = useMemo(() => {
    return stackedIds
      .map((id) => habits.find((h) => h.id === id))
      .filter((h): h is HabitData => h !== undefined);
  }, [stackedIds, habits]);

  const standaloneHabits = useMemo(() => {
    return habits.filter((h) => !stackedIds.includes(h.id));
  }, [habits, stackedIds]);

  // Find active habit for overlay
  const activeHabit = useMemo(() => {
    if (!activeId) return null;
    return habits.find((h) => h.id === activeId) || null;
  }, [activeId, habits]);

  // Drag handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const activeIdStr = active.id as string;
      const overIdStr = over.id as string;

      // Check if dropping on stack zone
      if (overIdStr === "stack-zone") {
        if (!stackedIds.includes(activeIdStr)) {
          setStackedIds((prev) => [...prev, activeIdStr]);
          setIsDirty(true);
        }
        return;
      }

      // Check if dropping on standalone zone
      if (overIdStr === "standalone-zone") {
        if (stackedIds.includes(activeIdStr)) {
          setStackedIds((prev) => prev.filter((id) => id !== activeIdStr));
          setIsDirty(true);
        }
        return;
      }

      // Reordering within stack
      if (stackedIds.includes(activeIdStr) && stackedIds.includes(overIdStr)) {
        const oldIndex = stackedIds.indexOf(activeIdStr);
        const newIndex = stackedIds.indexOf(overIdStr);

        if (oldIndex !== newIndex) {
          setStackedIds((prev) => arrayMove(prev, oldIndex, newIndex));
          setIsDirty(true);
        }
        return;
      }

      // Moving from standalone to stack (drop on a stacked item)
      if (!stackedIds.includes(activeIdStr) && stackedIds.includes(overIdStr)) {
        const insertIndex = stackedIds.indexOf(overIdStr);
        setStackedIds((prev) => {
          const newIds = [...prev];
          newIds.splice(insertIndex, 0, activeIdStr);
          return newIds;
        });
        setIsDirty(true);
      }
    },
    [stackedIds]
  );

  // Save stack
  const handleSave = useCallback(() => {
    const standaloneIdsList = habits.filter((h) => !stackedIds.includes(h.id)).map((h) => h.id);
    onSave?.(stackedIds, standaloneIdsList);
  }, [stackedIds, habits, onSave]);

  // Clear stack
  const handleClearStack = useCallback(() => {
    setStackedIds([]);
    setIsDirty(true);
  }, []);

  // Screen reader announcements
  const announcements = {
    onDragStart: ({ active }: DragStartEvent) => {
      const habit = habits.find((h) => h.id === active.id);
      return `Picked up ${habit?.title || "habit"}`;
    },
    onDragOver: ({ over }: { over: { id: UniqueIdentifier } | null }) => {
      if (!over) return "";
      if (over.id === "stack-zone") return "Over stack zone";
      if (over.id === "standalone-zone") return "Over standalone zone";
      const habit = habits.find((h) => h.id === over.id);
      return `Over ${habit?.title || "habit"}`;
    },
    onDragEnd: ({ active, over }: DragEndEvent) => {
      const activeHabitData = habits.find((h) => h.id === active.id);
      if (!over) return `Dropped ${activeHabitData?.title || "habit"}`;
      if (over.id === "stack-zone") {
        return `Added ${activeHabitData?.title || "habit"} to stack`;
      }
      if (over.id === "standalone-zone") {
        return `Removed ${activeHabitData?.title || "habit"} from stack`;
      }
      const overHabit = habits.find((h) => h.id === over.id);
      return `Dropped ${activeHabitData?.title || "habit"} ${overHabit ? `after ${overHabit.title}` : ""}`;
    },
    onDragCancel: ({ active }: { active: { id: UniqueIdentifier } }) => {
      const habit = habits.find((h) => h.id === active.id);
      return `Cancelled dragging ${habit?.title || "habit"}`;
    },
  };

  return (
    <div ref={containerRef} className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="text-forest-green h-5 w-5" />
          <h2 className="text-lg font-semibold">Build Your Habit Stack</h2>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <Button className="gap-1" size="sm" onClick={handleSave}>
              <Save className="h-3.5 w-3.5" />
              Save Stack
            </Button>
          )}
          {onClose && (
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600">
        Drag habits to create a chain. When you complete one, you&apos;ll be prompted to do the
        next!
      </p>

      <DndContext
        accessibility={{ announcements }}
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Stack Zone */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Habit Stack</h3>
              {stackedIds.length > 0 && (
                <Button
                  className="h-7 gap-1 text-xs text-red-600 hover:bg-red-50"
                  size="sm"
                  variant="ghost"
                  onClick={handleClearStack}
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>

            <div
              className={cn(
                "min-h-[200px] rounded-lg border-2 border-dashed p-4",
                "transition-colors duration-200",
                stackedIds.length > 0
                  ? "border-forest-green bg-forest-green/5"
                  : "border-gray-200 bg-gray-50"
              )}
              data-droppable-id="stack-zone"
              id="stack-zone"
            >
              {stackedIds.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-sm text-gray-400">
                  Drag habits here to create a stack
                </div>
              ) : (
                <SortableContext items={stackedIds} strategy={verticalListSortingStrategy}>
                  <AnimatePresence mode="popLayout">
                    {stackedHabits.map((habit, index) => (
                      <div key={habit.id} data-habit-id={habit.id}>
                        <DraggableHabitCard
                          isInStack
                          habit={habit}
                          isDragging={activeId === habit.id}
                          stackPosition={index}
                        />
                        {index < stackedHabits.length - 1 && <StackConnectionLine height={20} />}
                      </div>
                    ))}
                  </AnimatePresence>
                </SortableContext>
              )}
            </div>
          </div>

          {/* Standalone Zone */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Standalone Habits ({standaloneHabits.length})
            </h3>

            <div
              className={cn(
                "min-h-[200px] rounded-lg border-2 border-dashed p-4",
                "border-gray-200 bg-gray-50"
              )}
              data-droppable-id="standalone-zone"
              id="standalone-zone"
            >
              {standaloneHabits.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-sm text-gray-400">
                  All habits are in the stack!
                </div>
              ) : (
                <SortableContext
                  items={standaloneHabits.map((h) => h.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {standaloneHabits.map((habit) => (
                        <div key={habit.id} data-habit-id={habit.id}>
                          <DraggableHabitCard habit={habit} isDragging={activeId === habit.id} />
                        </div>
                      ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>
              )}
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeHabit && <DraggableHabitCardOverlay habit={activeHabit} />}
        </DragOverlay>
      </DndContext>

      {/* Stack Preview */}
      {stackedHabits.length > 1 && (
        <motion.div animate={{ opacity: 1, y: 0 }} className="mt-6" initial={{ opacity: 0, y: 20 }}>
          <StackPreview habits={stackedHabits} />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Hook for managing habit stacks with tRPC
 */
export function useHabitStack() {
  const utils = trpc.useUtils();

  const stackMutation = trpc.habits.update.useMutation({
    onSuccess: () => {
      utils.habits.list.invalidate();
    },
  });

  const saveStack = useCallback(
    async (stackedIds: string[], _standaloneIds: string[]) => {
      // Update each habit's cue_trigger to point to the previous habit in stack
      for (let i = 0; i < stackedIds.length; i++) {
        const habitId = stackedIds[i];
        const previousId = i > 0 ? stackedIds[i - 1] : null;

        await stackMutation.mutateAsync({
          id: habitId,
          cueTrigger: previousId ? `habit:${previousId}` : undefined,
        });
      }
    },
    [stackMutation]
  );

  return {
    saveStack,
    isLoading: stackMutation.isPending,
  };
}
