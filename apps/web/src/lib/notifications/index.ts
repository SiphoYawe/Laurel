/**
 * Notifications Module
 * Story 3-7: Habit Reminder Notifications
 */

// Types
export type {
  NotificationType,
  NotificationStatus,
  NotificationPayload,
  PushSubscriptionData,
  NotificationPreferences,
  ScheduledNotification,
} from "./types";

export { DEFAULT_NOTIFICATION_PREFERENCES } from "./types";

// Permission
export type { PermissionState } from "./permission";
export {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  shouldPromptForPermission,
  getNotificationSettingsUrl,
  showLocalNotification,
} from "./permission";

// Push Client
export {
  registerServiceWorker,
  getExistingSubscription,
  subscribeToPush,
  unsubscribeFromPush,
  isPushSupported,
} from "./push-client";

// Templates
export {
  createHabitReminderNotification,
  createStreakWarningNotification,
  createDailySummaryNotification,
  createMilestoneNotification,
  formatNotificationTime,
} from "./templates";

// Scheduler
export {
  calculateNotificationTime,
  calculateStreakWarningTime,
  isWithinQuietHours,
  scheduleLocalNotification,
  cancelLocalNotification,
  getTimeUntilNotification,
} from "./scheduler";
