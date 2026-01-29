"use client";

/**
 * Notification Permission Handling
 * Story 3-7: Habit Reminder Notifications
 */

export type PermissionState = "granted" | "denied" | "default" | "unsupported";

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "Notification" in window && "serviceWorker" in navigator;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): PermissionState {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<PermissionState> {
  if (!isNotificationSupported()) {
    console.warn("Notifications not supported in this browser");
    return "unsupported";
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return "denied";
  }
}

/**
 * Check if we should prompt for permission
 * Only prompt if permission hasn't been asked yet
 */
export function shouldPromptForPermission(): boolean {
  if (!isNotificationSupported()) return false;
  return Notification.permission === "default";
}

/**
 * Generate deep link to open OS notification settings
 * This is platform-specific and may not work on all browsers
 */
export function getNotificationSettingsUrl(): string | null {
  // Chrome on Android
  if (/Android/i.test(navigator.userAgent)) {
    return "intent://settings#Intent;scheme=android-app;end";
  }

  // For desktop, we can only suggest opening browser settings
  // No reliable way to deep link to OS settings from web
  return null;
}

/**
 * Show a local notification (for testing)
 */
export function showLocalNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (getNotificationPermission() !== "granted") {
    console.warn("Notification permission not granted");
    return null;
  }

  return new Notification(title, {
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    ...options,
  });
}
