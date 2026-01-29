"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * StackConnection - SVG line connecting stacked habits
 * Story 2-7: Habit Stack Builder with Drag-Drop
 */

interface Position {
  x: number;
  y: number;
}

interface StackConnectionProps {
  fromId: string;
  toId: string;
  isAnimating?: boolean;
  isDashed?: boolean;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function StackConnection({
  fromId,
  toId,
  isAnimating = false,
  isDashed = false,
  containerRef,
}: StackConnectionProps) {
  const [positions, setPositions] = useState<{ from: Position; to: Position } | null>(null);

  useEffect(() => {
    const updatePositions = () => {
      const container = containerRef?.current || document.body;
      const fromElement = container.querySelector(`[data-habit-id="${fromId}"]`);
      const toElement = container.querySelector(`[data-habit-id="${toId}"]`);

      if (!fromElement || !toElement) return;

      const containerRect = container.getBoundingClientRect();
      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();

      // Calculate positions relative to container
      const from = {
        x: fromRect.left - containerRect.left + fromRect.width / 2,
        y: fromRect.bottom - containerRect.top,
      };

      const to = {
        x: toRect.left - containerRect.left + toRect.width / 2,
        y: toRect.top - containerRect.top,
      };

      setPositions({ from, to });
    };

    updatePositions();

    // Update on resize
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, [fromId, toId, containerRef]);

  if (!positions) return null;

  const { from, to } = positions;
  const midY = (from.y + to.y) / 2;

  // Create a bezier curve path
  const pathD = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      <motion.path
        animate={{ pathLength: 1, opacity: 1 }}
        d={pathD}
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        stroke="#2D5A3D"
        strokeDasharray={isDashed ? "5,5" : "0"}
        strokeWidth={2}
        transition={{ duration: isAnimating ? 0.5 : 0.3 }}
      />
      {/* Arrow head at the end */}
      <motion.polygon
        animate={{ opacity: 1 }}
        fill="#2D5A3D"
        initial={{ opacity: 0 }}
        points={`${to.x - 4},${to.y - 8} ${to.x},${to.y} ${to.x + 4},${to.y - 8}`}
        transition={{ delay: 0.2 }}
      />
    </svg>
  );
}

/**
 * StackConnectionLine - Simplified vertical line for inline stacks
 */
interface StackConnectionLineProps {
  height?: number;
  isAnimating?: boolean;
  className?: string;
}

export function StackConnectionLine({
  height = 24,
  isAnimating = false,
  className,
}: StackConnectionLineProps) {
  return (
    <div className={cn("relative flex justify-center", className)} style={{ height }}>
      <motion.div
        animate={{ height }}
        className="bg-forest-green w-0.5"
        initial={{ height: 0 }}
        transition={{ duration: isAnimating ? 0.3 : 0.15 }}
      />
      {/* Arrow */}
      <motion.div
        animate={{ opacity: 1 }}
        className="border-t-forest-green absolute bottom-0 h-0 w-0 border-x-4 border-t-4 border-x-transparent"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.1 }}
      />
    </div>
  );
}
