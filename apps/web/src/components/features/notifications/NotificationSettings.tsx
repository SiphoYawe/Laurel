"use client";

import { Bell, Clock, Moon } from "lucide-react";
import { useState } from "react";

import { NotificationPermissionPrompt } from "./NotificationPermissionPrompt";

import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

/**
 * NotificationSettings - Notification preferences UI
 * Story 3-7: Habit Reminder Notifications
 */

interface NotificationSettingsProps {
  className?: string;
}

export function NotificationSettings({ className }: NotificationSettingsProps) {
  const {
    isSupported,
    preferences,
    isLoadingPreferences,
    toggleReminders,
    toggleStreakWarnings,
    updatePreference,
    needsPermission,
    isPermissionDenied,
  } = useNotifications();

  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  const handleToggleReminders = async (enabled: boolean) => {
    if (enabled && needsPermission) {
      setShowPermissionPrompt(true);
      return;
    }
    await toggleReminders(enabled);
  };

  const handleToggleStreakWarnings = async (enabled: boolean) => {
    if (enabled && needsPermission) {
      setShowPermissionPrompt(true);
      return;
    }
    await toggleStreakWarnings(enabled);
  };

  if (!isSupported) {
    return (
      <div className={cn("rounded-lg border p-4", className)}>
        <p className="text-muted-foreground text-sm">
          Push notifications are not supported in your browser.
        </p>
      </div>
    );
  }

  if (isLoadingPreferences) {
    return (
      <div className={cn("animate-pulse space-y-4 rounded-lg border p-4", className)}>
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="h-12 rounded bg-gray-200" />
        <div className="h-12 rounded bg-gray-200" />
      </div>
    );
  }

  return (
    <>
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {isPermissionDenied && (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-600">Blocked</span>
          )}
        </div>

        {/* Permission warning */}
        {isPermissionDenied && (
          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Notifications are blocked. Click the lock icon in your browser&apos;s address bar to
            enable them.
          </div>
        )}

        {/* Settings list */}
        <div className="divide-y rounded-lg border">
          {/* Habit reminders */}
          <SettingRow
            description="Get notified at your habit's scheduled time"
            enabled={preferences.remindersEnabled}
            icon={<Bell className="h-5 w-5" />}
            title="Habit Reminders"
            onToggle={handleToggleReminders}
          />

          {/* Streak warnings */}
          <SettingRow
            description="Get warned before your streak is at risk"
            enabled={preferences.streakWarningsEnabled}
            icon={<span className="text-lg">🔥</span>}
            title="Streak Warnings"
            onToggle={handleToggleStreakWarnings}
          />

          {/* Quiet hours */}
          <SettingRow
            description={`No notifications from ${preferences.quietHoursStart} to ${preferences.quietHoursEnd}`}
            enabled={preferences.quietHoursEnabled}
            icon={<Moon className="h-5 w-5" />}
            title="Quiet Hours"
            onToggle={(enabled) => updatePreference("quietHoursEnabled", enabled)}
          />
        </div>

        {/* Advanced settings */}
        {preferences.streakWarningsEnabled && (
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <label className="text-sm font-medium" htmlFor="streak-warning-time">
                Streak warning time
              </label>
            </div>
            <select
              className="border-input bg-background mt-2 w-full rounded-md border px-3 py-2 text-sm"
              id="streak-warning-time"
              value={preferences.streakWarningTime}
              onChange={(e) => updatePreference("streakWarningTime", e.target.value)}
            >
              <option value="20:00">8:00 PM</option>
              <option value="21:00">9:00 PM</option>
              <option value="22:00">10:00 PM</option>
              <option value="23:00">11:00 PM</option>
            </select>
          </div>
        )}
      </div>

      <NotificationPermissionPrompt
        isOpen={showPermissionPrompt}
        onClose={() => setShowPermissionPrompt(false)}
      />
    </>
  );
}

/**
 * Individual setting row
 */
function SettingRow({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-start gap-3">
        <div className="text-muted-foreground mt-0.5">{icon}</div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
      <button
        aria-checked={enabled}
        aria-label={`Toggle ${title}`}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          enabled ? "bg-forest-green" : "bg-gray-200"
        )}
        role="switch"
        type="button"
        onClick={() => onToggle(!enabled)}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
