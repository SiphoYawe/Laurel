"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";

import { CategoryIndicator } from "./CategoryIndicator";

import type { HabitCategory } from "./CategoryIndicator";

import { cn } from "@/lib/utils";

/**
 * DraggableHabitCard - Draggable version of HabitCard for stack builder
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

interface DraggableHabitCardProps {
  habit: HabitData;
  isDragging?: boolean;
  isOverlay?: boolean;
  isInStack?: boolean;
  stackPosition?: number;
  onRemoveFromStack?: () => void;
}

export function DraggableHabitCard({
  habit,
  isDragging = false,
  isOverlay = false,
  isInStack = false,
  stackPosition,
}: DraggableHabitCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: habit.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      className={cn(
        "relative flex items-center gap-3 rounded-lg border bg-white p-3",
        "transition-shadow duration-200",
        isDragging && "opacity-50",
        isOverlay && "rotate-2 scale-105 shadow-xl",
        isInStack && "border-l-forest-green ml-4 border-l-2"
      )}
      layout={!isDragging}
      layoutId={isOverlay ? undefined : habit.id}
      style={style}
    >
      {/* Drag Handle */}
      <button
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md",
          "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
          "cursor-grab active:cursor-grabbing",
          "focus:ring-forest-green focus:outline-none focus:ring-2 focus:ring-offset-2"
        )}
        {...attributes}
        {...listeners}
        aria-label={`Drag ${habit.title}`}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Stack Position Indicator */}
      {isInStack && stackPosition !== undefined && (
        <div className="bg-forest-green absolute -left-6 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-medium text-white">
          {stackPosition + 1}
        </div>
      )}

      {/* Category Indicator */}
      <CategoryIndicator category={habit.category} size="sm" />

      {/* Habit Info */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate font-medium text-gray-900">{habit.title}</h4>
        {habit.cue_trigger && (
          <p className="truncate text-xs text-gray-500">After: {habit.cue_trigger}</p>
        )}
      </div>

      {/* Duration Badge */}
      {habit.duration_minutes && (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {habit.duration_minutes}m
        </span>
      )}
    </motion.div>
  );
}

/**
 * DragOverlay version - shown when dragging
 */
export function DraggableHabitCardOverlay({ habit }: { habit: HabitData }) {
  return <DraggableHabitCard isOverlay habit={habit} isDragging={false} />;
}
