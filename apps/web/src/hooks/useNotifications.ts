"use client";

import { useState, useEffect, useCallback } from "react";

import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  registerServiceWorker,
  isPushSupported,
  type PermissionState,
  type NotificationPreferences,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from "@/lib/notifications";
import { trpc } from "@/lib/trpc/client";

/**
 * useNotifications - Hook for managing notification state and preferences
 * Story 3-7: Habit Reminder Notifications
 */

export function useNotifications() {
  const [permission, setPermission] = useState<PermissionState>("default");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Fetch preferences
  const {
    data: preferences,
    isLoading: isLoadingPreferences,
    refetch: refetchPreferences,
  } = trpc.notifications.getPreferences.useQuery();

  // Mutations
  const registerToken = trpc.notifications.registerPushToken.useMutation();
  const updatePreferences = trpc.notifications.updatePreferences.useMutation({
    onSuccess: () => {
      refetchPreferences();
    },
  });

  // Check permission on mount
  useEffect(() => {
    if (isNotificationSupported()) {
      setPermission(getNotificationPermission());
    } else {
      setPermission("unsupported");
    }
  }, []);

  // Request permission and register for push
  const enableNotifications = useCallback(async () => {
    if (!isPushSupported()) {
      console.warn("Push notifications not supported");
      return false;
    }

    setIsRegistering(true);

    try {
      // Request permission
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);

      if (newPermission !== "granted") {
        console.warn("Notification permission denied");
        return false;
      }

      // Register service worker
      await registerServiceWorker();

      // Subscribe to push
      const subscription = await subscribeToPush();

      if (!subscription) {
        console.error("Failed to get push subscription");
        return false;
      }

      // Register token with server
      await registerToken.mutateAsync({
        token: subscription.endpoint,
        platform: "web",
        endpoint: subscription.endpoint,
        p256dh: subscription.p256dh,
        auth: subscription.auth,
        deviceInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language,
        },
      });

      setIsRegistered(true);
      return true;
    } catch (error) {
      console.error("Error enabling notifications:", error);
      return false;
    } finally {
      setIsRegistering(false);
    }
  }, [registerToken]);

  // Update a single preference
  const updatePreference = useCallback(
    async <K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) => {
      await updatePreferences.mutateAsync({ [key]: value });
    },
    [updatePreferences]
  );

  // Toggle reminders
  const toggleReminders = useCallback(
    async (enabled: boolean) => {
      await updatePreference("remindersEnabled", enabled);
    },
    [updatePreference]
  );

  // Toggle streak warnings
  const toggleStreakWarnings = useCallback(
    async (enabled: boolean) => {
      await updatePreference("streakWarningsEnabled", enabled);
    },
    [updatePreference]
  );

  return {
    // State
    permission,
    isSupported: isPushSupported(),
    isRegistering,
    isRegistered,
    preferences: preferences || DEFAULT_NOTIFICATION_PREFERENCES,
    isLoadingPreferences,

    // Actions
    enableNotifications,
    updatePreference,
    toggleReminders,
    toggleStreakWarnings,

    // Flags
    canEnableNotifications:
      isPushSupported() && permission !== "denied" && permission !== "unsupported",
    needsPermission: permission === "default",
    isPermissionDenied: permission === "denied",
  };
}
