"use client";

import { cn } from "@/lib/utils";

/**
 * Category color mapping based on UX design specification
 */
export const CATEGORY_COLORS = {
  study: "#2D5A3D", // Forest Green
  reading: "#7CB07F", // Sage (mapped to study for reading)
  exercise: "#E8A54B", // Warm Amber
  health: "#5B8DB8", // Soft Blue
  productivity: "#7CB07F", // Sage
  mindfulness: "#8B7355", // Earthy brown
  social: "#D4A574", // Warm tan
  creative: "#B47EB3", // Soft purple
  practice: "#5B8DB8", // Soft Blue
  other: "#6B6B6B", // Gray
} as const;

export type HabitCategory = keyof typeof CATEGORY_COLORS;

interface CategoryIndicatorProps {
  category: HabitCategory;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  xs: { dot: "w-1.5 h-1.5", text: "text-[10px]" },
  sm: { dot: "w-2 h-2", text: "text-xs" },
  md: { dot: "w-3 h-3", text: "text-sm" },
  lg: { dot: "w-4 h-4", text: "text-base" },
};

/**
 * Get display name for category
 */
export function getCategoryDisplayName(category: HabitCategory): string {
  const names: Record<HabitCategory, string> = {
    study: "Study",
    reading: "Reading",
    exercise: "Exercise",
    health: "Health",
    productivity: "Productivity",
    mindfulness: "Mindfulness",
    social: "Social",
    creative: "Creative",
    practice: "Practice",
    other: "Other",
  };
  return names[category] || category;
}

/**
 * CategoryIndicator - Shows a colored dot with optional label for habit category
 */
export function CategoryIndicator({
  category,
  size = "md",
  showLabel = false,
  className,
}: CategoryIndicatorProps) {
  const config = SIZE_CONFIG[size];
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.other;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        aria-hidden="true"
        className={cn("rounded-full", config.dot)}
        style={{ backgroundColor: color }}
      />
      {showLabel && (
        <span className={cn("text-muted-foreground", config.text)}>
          {getCategoryDisplayName(category)}
        </span>
      )}
    </div>
  );
}
