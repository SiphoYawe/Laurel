/**
 * Notification Types
 * Story 3-7: Habit Reminder Notifications
 */

export type NotificationType = "reminder" | "streak_warning" | "daily_summary" | "custom";

export type NotificationStatus = "pending" | "sent" | "failed" | "cancelled";

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data: {
    type: NotificationType;
    habitId?: string;
    deepLink: string;
    notificationId?: string;
  };
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
}

export interface PushSubscriptionData {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface NotificationPreferences {
  remindersEnabled: boolean;
  streakWarningsEnabled: boolean;
  dailySummaryEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string; // HH:MM format
  streakWarningTime: string; // HH:MM format
  reminderOffsetMinutes: number;
  timezone: string;
}

export interface ScheduledNotification {
  id: string;
  userId: string;
  habitId?: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  scheduledFor: Date;
  sentAt?: Date;
  status: NotificationStatus;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  remindersEnabled: true,
  streakWarningsEnabled: true,
  dailySummaryEnabled: false,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  streakWarningTime: "22:00",
  reminderOffsetMinutes: 0,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
};
