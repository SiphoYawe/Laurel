/**
 * Habit Types
 * Type definitions for habits and habit tracking
 */

/**
 * Habit category options
 */
export type HabitCategory =
  | "study"
  | "exercise"
  | "health"
  | "productivity"
  | "mindfulness"
  | "social"
  | "creative"
  | "other";

/**
 * Habit frequency options
 */
export type HabitFrequency = "daily" | "weekdays" | "weekends" | "weekly" | "custom";

/**
 * Base habit interface
 */
export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  cueTrigger: string | null;
  routine: string;
  reward: string | null;
  twoMinuteVersion: string | null;
  category: HabitCategory;
  frequency: HabitFrequency;
  frequencyDays: number[] | null;
  durationMinutes: number | null;
  targetTime: string | null;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

/**
 * Habit creation input
 */
export interface CreateHabitInput {
  title: string;
  routine: string;
  category: HabitCategory;
  description?: string;
  cueTrigger?: string;
  reward?: string;
  twoMinuteVersion?: string;
  frequency?: HabitFrequency;
  frequencyDays?: number[];
  durationMinutes?: number;
  targetTime?: string;
}

/**
 * Habit update input
 */
export interface UpdateHabitInput {
  title?: string;
  description?: string;
  cueTrigger?: string;
  routine?: string;
  reward?: string;
  twoMinuteVersion?: string;
  category?: HabitCategory;
  frequency?: HabitFrequency;
  frequencyDays?: number[];
  durationMinutes?: number;
  targetTime?: string;
  isActive?: boolean;
}

/**
 * Habit completion record
 */
export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: Date | null;
  durationMinutes: number | null;
  notes: string | null;
  qualityRating: number | null;
  createdAt: Date | null;
}

/**
 * Habit completion input
 */
export interface CreateHabitCompletionInput {
  habitId: string;
  durationMinutes?: number;
  notes?: string;
  qualityRating?: number;
}

/**
 * Habit streak tracking
 */
export interface HabitStreak {
  habitId: string;
  currentStreak: number | null;
  longestStreak: number | null;
  lastCompletedDate: string | null;
  updatedAt: Date | null;
}

/**
 * Habit with streak and today's status
 */
export interface HabitWithStatus extends Habit {
  streak: HabitStreak | null;
  completedToday: boolean;
  todayCompletion: HabitCompletion | null;
}

/**
 * Category display configuration
 */
export const HABIT_CATEGORY_CONFIG: Record<
  HabitCategory,
  {
    label: string;
    color: string;
    icon: string;
  }
> = {
  study: { label: "Study", color: "blue", icon: "BookOpen" },
  exercise: { label: "Exercise", color: "orange", icon: "Dumbbell" },
  health: { label: "Health", color: "green", icon: "Heart" },
  productivity: { label: "Productivity", color: "purple", icon: "Target" },
  mindfulness: { label: "Mindfulness", color: "teal", icon: "Leaf" },
  social: { label: "Social", color: "pink", icon: "Users" },
  creative: { label: "Creative", color: "amber", icon: "Palette" },
  other: { label: "Other", color: "gray", icon: "Circle" },
};

/**
 * Frequency display configuration
 */
export const HABIT_FREQUENCY_CONFIG: Record<
  HabitFrequency,
  {
    label: string;
    description: string;
  }
> = {
  daily: { label: "Daily", description: "Every day" },
  weekdays: { label: "Weekdays", description: "Monday to Friday" },
  weekends: { label: "Weekends", description: "Saturday and Sunday" },
  weekly: { label: "Weekly", description: "Once a week" },
  custom: { label: "Custom", description: "Select specific days" },
};
