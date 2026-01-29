/**
 * Streak Calculation Service
 * Story 3-2: Streak Tracking and Display
 *
 * Handles all streak-related calculations with timezone awareness
 */

// Milestone thresholds for celebrations and badges
export const STREAK_MILESTONES = [7, 14, 30, 66, 100, 180, 365] as const;
export type StreakMilestone = (typeof STREAK_MILESTONES)[number];

// Milestone metadata
export const MILESTONE_INFO: Record<
  StreakMilestone,
  { name: string; emoji: string; badge: string }
> = {
  7: { name: "Week Warrior", emoji: "🥉", badge: "week-warrior" },
  14: { name: "Fortnight Fighter", emoji: "🥈", badge: "fortnight-fighter" },
  30: { name: "Monthly Master", emoji: "🥇", badge: "monthly-master" },
  66: { name: "Habit Hero", emoji: "👑", badge: "habit-hero" },
  100: { name: "Century Champion", emoji: "💎", badge: "century-champion" },
  180: { name: "Half-Year Hero", emoji: "🏆", badge: "half-year-hero" },
  365: { name: "Annual Champion", emoji: "🌟", badge: "annual-champion" },
};

// Encouraging messages for streak resets
export const RESET_MESSAGES = [
  "Starting fresh! Every expert was once a beginner.",
  "Today is a new day. Let's build momentum together!",
  "Fresh start! The best time to begin is now.",
  "New beginning! Your consistency journey starts today.",
  "Clean slate! Every streak starts with day one.",
];

export interface StreakUpdate {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
  wasReset: boolean;
  isMilestone: boolean;
  milestoneReached?: StreakMilestone;
  resetMessage?: string;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  isAtRisk: boolean;
  nextMilestone: number;
  daysToMilestone: number;
  progress: number;
}

/**
 * Check if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if date1 is the day before date2
 */
function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date1, yesterday);
}

/**
 * Get a random encouraging message for streak reset
 */
export function getResetMessage(): string {
  return RESET_MESSAGES[Math.floor(Math.random() * RESET_MESSAGES.length)];
}

/**
 * Get the next milestone for a given streak
 */
export function getNextMilestone(currentStreak: number): number {
  for (const milestone of STREAK_MILESTONES) {
    if (currentStreak < milestone) {
      return milestone;
    }
  }
  // After 365, add 365-day milestones
  return Math.ceil((currentStreak + 1) / 365) * 365;
}

/**
 * Get the previous milestone for a given streak
 */
export function getPreviousMilestone(currentStreak: number): number {
  let prev = 0;
  for (const milestone of STREAK_MILESTONES) {
    if (currentStreak < milestone) {
      return prev;
    }
    prev = milestone;
  }
  return prev;
}

/**
 * Calculate progress toward the next milestone (0-1)
 */
export function calculateMilestoneProgress(currentStreak: number): number {
  const prev = getPreviousMilestone(currentStreak);
  const next = getNextMilestone(currentStreak);
  const range = next - prev;

  if (range <= 0) return 1;
  return (currentStreak - prev) / range;
}

/**
 * Check if a streak count is a milestone
 */
export function isMilestone(streak: number): streak is StreakMilestone {
  return STREAK_MILESTONES.includes(streak as StreakMilestone);
}

/**
 * Get milestone info if the streak is a milestone
 */
export function getMilestoneInfo(
  streak: number
): { name: string; emoji: string; badge: string } | null {
  if (isMilestone(streak)) {
    return MILESTONE_INFO[streak];
  }
  return null;
}

/**
 * Calculate streak info including at-risk status
 */
export function calculateStreakInfo(
  currentStreak: number,
  longestStreak: number,
  lastCompletedDate: string | null,
  completedToday: boolean
): StreakInfo {
  const today = new Date();
  const nextMilestone = getNextMilestone(currentStreak);
  const daysToMilestone = nextMilestone - currentStreak;
  const progress = calculateMilestoneProgress(currentStreak);

  // Determine if streak is at risk
  // At risk if: has a streak > 0, not completed today
  let isAtRisk = false;
  if (currentStreak > 0 && !completedToday && lastCompletedDate) {
    const lastDate = new Date(lastCompletedDate);
    // At risk if last completion was yesterday (streak would break tomorrow)
    isAtRisk = isYesterday(lastDate, today);
  }

  return {
    currentStreak,
    longestStreak,
    lastCompletedDate,
    isAtRisk,
    nextMilestone,
    daysToMilestone,
    progress,
  };
}

/**
 * Calculate the new streak values after a completion
 */
export function calculateStreakUpdate(
  currentStreak: number,
  longestStreak: number,
  lastCompletedDate: string | null,
  completionDate: Date = new Date()
): StreakUpdate {
  const completionDateStr = completionDate.toISOString().split("T")[0];

  // If no previous completion, this is day 1
  if (!lastCompletedDate) {
    const newStreak = 1;
    const milestone = isMilestone(newStreak);

    return {
      currentStreak: newStreak,
      longestStreak: Math.max(longestStreak, newStreak),
      lastCompletedDate: completionDateStr,
      wasReset: false,
      isMilestone: milestone,
      milestoneReached: milestone ? (newStreak as StreakMilestone) : undefined,
    };
  }

  const lastDate = new Date(lastCompletedDate);

  // Already completed today - no change
  if (isSameDay(lastDate, completionDate)) {
    return {
      currentStreak,
      longestStreak,
      lastCompletedDate,
      wasReset: false,
      isMilestone: false,
    };
  }

  // Completed yesterday - continue streak
  if (isYesterday(lastDate, completionDate)) {
    const newStreak = currentStreak + 1;
    const milestone = isMilestone(newStreak);

    return {
      currentStreak: newStreak,
      longestStreak: Math.max(longestStreak, newStreak),
      lastCompletedDate: completionDateStr,
      wasReset: false,
      isMilestone: milestone,
      milestoneReached: milestone ? (newStreak as StreakMilestone) : undefined,
    };
  }

  // Streak broken - reset to 1
  return {
    currentStreak: 1,
    longestStreak,
    lastCompletedDate: completionDateStr,
    wasReset: true,
    isMilestone: false,
    resetMessage: getResetMessage(),
  };
}

/**
 * Get a user-friendly description of the streak status
 */
export function getStreakStatusMessage(info: StreakInfo): string {
  if (info.currentStreak === 0) {
    return "Start your streak today!";
  }

  if (info.isAtRisk) {
    return `${info.currentStreak} day streak at risk! Complete a habit to keep it going.`;
  }

  const milestone = getMilestoneInfo(info.currentStreak);
  if (milestone) {
    return `${milestone.emoji} ${milestone.name}! ${info.currentStreak} day streak!`;
  }

  if (info.daysToMilestone <= 3) {
    return `${info.currentStreak} day streak! Only ${info.daysToMilestone} day${info.daysToMilestone === 1 ? "" : "s"} to ${info.nextMilestone}!`;
  }

  return `${info.currentStreak} day streak! Keep going!`;
}
