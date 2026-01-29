/**
 * Notification Templates
 * Story 3-7: Habit Reminder Notifications
 */

import type { NotificationPayload } from "./types";

/**
 * Create a habit reminder notification
 */
export function createHabitReminderNotification(habit: {
  id: string;
  title: string;
  durationMinutes?: number;
}): NotificationPayload {
  const durationText = habit.durationMinutes ? ` - ${habit.durationMinutes} minutes` : "";

  return {
    title: "Time for your habit!",
    body: `${habit.title}${durationText}`,
    icon: "/icon-192x192.png",
    tag: `habit-reminder-${habit.id}`,
    data: {
      type: "reminder",
      habitId: habit.id,
      deepLink: `/habits/${habit.id}`,
    },
    requireInteraction: false,
  };
}

/**
 * Create a streak warning notification
 */
export function createStreakWarningNotification(habit: {
  id: string;
  title: string;
  currentStreak: number;
}): NotificationPayload {
  const streakText =
    habit.currentStreak > 0
      ? `Your ${habit.currentStreak}-day streak is on the line!`
      : "Don't miss your habit today!";

  return {
    title: "Streak at risk! 🔥",
    body: `You haven't completed ${habit.title} today. ${streakText}`,
    icon: "/icon-192x192.png",
    tag: `streak-warning-${habit.id}`,
    data: {
      type: "streak_warning",
      habitId: habit.id,
      deepLink: `/habits/${habit.id}`,
    },
    actions: [
      {
        action: "complete_now",
        title: "Complete now",
      },
      {
        action: "snooze",
        title: "Snooze 30min",
      },
    ],
    requireInteraction: true,
  };
}

/**
 * Create a daily summary notification
 */
export function createDailySummaryNotification(stats: {
  completedCount: number;
  totalCount: number;
  longestStreak: number;
}): NotificationPayload {
  const allComplete = stats.completedCount === stats.totalCount;
  const title = allComplete ? "Great job today! 🎉" : "Daily summary";
  const body = allComplete
    ? `You completed all ${stats.totalCount} habits! Keep it up!`
    : `You completed ${stats.completedCount}/${stats.totalCount} habits today.`;

  return {
    title,
    body,
    icon: "/icon-192x192.png",
    tag: "daily-summary",
    data: {
      type: "daily_summary",
      deepLink: "/dashboard",
    },
  };
}

/**
 * Create a milestone celebration notification
 */
export function createMilestoneNotification(milestone: {
  habitTitle: string;
  streakDays: number;
  badgeName?: string;
}): NotificationPayload {
  return {
    title: `🏆 ${milestone.streakDays}-Day Streak!`,
    body: `Amazing! You've kept up with "${milestone.habitTitle}" for ${milestone.streakDays} days!`,
    icon: "/icon-192x192.png",
    tag: "milestone",
    data: {
      type: "custom",
      deepLink: "/profile/badges",
    },
  };
}

/**
 * Format notification time for display
 * Uses user's browser locale for localization
 */
export function formatNotificationTime(date: Date, locale?: string): string {
  return date.toLocaleTimeString(locale || undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
