/**
 * Notification Scheduler
 * Story 3-7: Habit Reminder Notifications
 *
 * Client-side scheduling utilities for notifications
 */

import type { NotificationPayload } from "./types";

/**
 * Calculate notification time based on habit target time and user preferences
 */
export function calculateNotificationTime(
  targetTime: string, // HH:MM format
  timezone: string,
  offsetMinutes: number = 0
): Date {
  const [hours, minutes] = targetTime.split(":").map(Number);

  // Create date in user's timezone
  const now = new Date();
  const userDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));

  // Set the target time
  userDate.setHours(hours, minutes, 0, 0);

  // Apply offset (negative = before, positive = after)
  userDate.setMinutes(userDate.getMinutes() + offsetMinutes);

  // If time has already passed today, schedule for tomorrow
  if (userDate < now) {
    userDate.setDate(userDate.getDate() + 1);
  }

  return userDate;
}

/**
 * Calculate streak warning time (default 10 PM in user's timezone)
 */
export function calculateStreakWarningTime(
  streakWarningTime: string, // HH:MM format, default "22:00"
  timezone: string
): Date {
  return calculateNotificationTime(streakWarningTime, timezone, 0);
}

/**
 * Check if current time is within quiet hours
 */
export function isWithinQuietHours(
  quietHoursStart: string, // HH:MM
  quietHoursEnd: string, // HH:MM
  timezone: string
): boolean {
  const now = new Date();
  const userNow = new Date(now.toLocaleString("en-US", { timeZone: timezone }));

  const [startHour, startMin] = quietHoursStart.split(":").map(Number);
  const [endHour, endMin] = quietHoursEnd.split(":").map(Number);

  const currentMinutes = userNow.getHours() * 60 + userNow.getMinutes();
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Handle overnight quiet hours (e.g., 22:00 to 07:00)
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

/**
 * Schedule a local browser notification (for testing/fallback)
 * In production, this would be handled by the server
 */
export function scheduleLocalNotification(
  payload: NotificationPayload,
  scheduledTime: Date
): number | null {
  if (typeof window === "undefined") return null;

  const delay = scheduledTime.getTime() - Date.now();

  if (delay <= 0) {
    // Time has passed, show immediately
    showNotification(payload);
    return null;
  }

  // Schedule for later
  const timeoutId = window.setTimeout(() => {
    showNotification(payload);
  }, delay);

  return timeoutId;
}

/**
 * Cancel a scheduled local notification
 */
export function cancelLocalNotification(timeoutId: number): void {
  if (typeof window !== "undefined") {
    window.clearTimeout(timeoutId);
  }
}

/**
 * Show a notification immediately
 */
function showNotification(payload: NotificationPayload): void {
  if (Notification.permission !== "granted") return;

  const notification = new Notification(payload.title, {
    body: payload.body,
    icon: payload.icon || "/icon-192x192.png",
    tag: payload.tag,
    data: payload.data,
    requireInteraction: payload.requireInteraction,
  });

  notification.onclick = () => {
    window.focus();
    if (payload.data?.deepLink) {
      window.location.href = payload.data.deepLink;
    }
    notification.close();
  };
}

/**
 * Get time until next notification for display
 */
export function getTimeUntilNotification(scheduledTime: Date): string {
  const now = Date.now();
  const diff = scheduledTime.getTime() - now;

  if (diff <= 0) return "Now";

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }

  return `${minutes}m`;
}
