/**
 * Shared Constants
 * Application-wide constant values
 */

// Habit categories with associated colors
export const HABIT_CATEGORIES = {
  HEALTH: { name: "Health", color: "#22c55e" },
  PRODUCTIVITY: { name: "Productivity", color: "#3b82f6" },
  LEARNING: { name: "Learning", color: "#8b5cf6" },
  FITNESS: { name: "Fitness", color: "#f97316" },
  MINDFULNESS: { name: "Mindfulness", color: "#06b6d4" },
  SOCIAL: { name: "Social", color: "#ec4899" },
  FINANCE: { name: "Finance", color: "#eab308" },
  CREATIVITY: { name: "Creativity", color: "#ef4444" },
} as const;

// Gamification levels
export const LEVELS = [
  { level: 1, name: "Seedling", xpRequired: 0 },
  { level: 2, name: "Sprout", xpRequired: 100 },
  { level: 3, name: "Sapling", xpRequired: 300 },
  { level: 4, name: "Young Tree", xpRequired: 600 },
  { level: 5, name: "Growing Tree", xpRequired: 1000 },
  { level: 6, name: "Mighty Oak", xpRequired: 1500 },
  { level: 7, name: "Forest Guardian", xpRequired: 2100 },
  { level: 8, name: "Laurel Champion", xpRequired: 2800 },
] as const;

// XP rewards
export const XP_REWARDS = {
  HABIT_COMPLETION: 10,
  STREAK_BONUS_MULTIPLIER: 0.1, // 10% per streak day
  BADGE_EARNED: 50,
  LEVEL_UP_BONUS: 100,
} as const;

// Spaced repetition constants (SM-2 algorithm)
export const SM2_CONSTANTS = {
  INITIAL_EASINESS: 2.5,
  MIN_EASINESS: 1.3,
  INITIAL_INTERVAL: 1,
  SECOND_INTERVAL: 6,
} as const;
