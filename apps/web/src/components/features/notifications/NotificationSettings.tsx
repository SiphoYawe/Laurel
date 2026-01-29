"use client";

import { AlertTriangle, Bell, Clock, Mail, Moon, Users, Sparkles } from "lucide-react";
import { useState } from "react";

import { NotificationPermissionPrompt } from "./NotificationPermissionPrompt";

import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

/**
 * NotificationSettings - Notification preferences UI
 * Story 3-7 & 3-8: Habit Reminder Notifications & Quiet Hours
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

  // Check if all notifications are disabled
  const allNotificationsDisabled =
    !preferences.remindersEnabled && !preferences.streakWarningsEnabled;

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

        {/* All notifications disabled warning */}
        {allNotificationsDisabled && !isPermissionDenied && (
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">Notifications are off</p>
              <p className="text-sm text-amber-700">
                You might miss habit reminders and streak warnings.
              </p>
              <Button
                className="mt-2"
                size="sm"
                variant="outline"
                onClick={() => {
                  toggleReminders(true);
                  toggleStreakWarnings(true);
                }}
              >
                Turn on notifications
              </Button>
            </div>
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
            description={`No notifications from ${formatTime(preferences.quietHoursStart)} to ${formatTime(preferences.quietHoursEnd)}`}
            enabled={preferences.quietHoursEnabled}
            icon={<Moon className="h-5 w-5" />}
            title="Quiet Hours"
            onToggle={(enabled) => updatePreference("quietHoursEnabled", enabled)}
          />

          {/* Daily summary (optional) */}
          <SettingRow
            description="Get a daily summary of your progress"
            enabled={preferences.dailySummaryEnabled}
            icon={<Mail className="h-5 w-5" />}
            title="Daily Summary"
            onToggle={(enabled) => updatePreference("dailySummaryEnabled", enabled)}
          />
        </div>

        {/* Quiet hours time configuration */}
        {preferences.quietHoursEnabled && (
          <div className="rounded-lg border p-4">
            <div className="mb-4 flex items-center gap-2">
              <Moon className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">Quiet Hours Schedule</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground mb-1 block text-xs" htmlFor="quiet-start">
                  Start time
                </label>
                <select
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                  id="quiet-start"
                  value={preferences.quietHoursStart}
                  onChange={(e) => updatePreference("quietHoursStart", e.target.value)}
                >
                  {generateTimeOptions().map((time) => (
                    <option key={`start-${time.value}`} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-xs" htmlFor="quiet-end">
                  End time
                </label>
                <select
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                  id="quiet-end"
                  value={preferences.quietHoursEnd}
                  onChange={(e) => updatePreference("quietHoursEnd", e.target.value)}
                >
                  {generateTimeOptions().map((time) => (
                    <option key={`end-${time.value}`} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visual timeline */}
            <QuietHoursPreview
              end={preferences.quietHoursEnd}
              start={preferences.quietHoursStart}
            />
          </div>
        )}

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

/**
 * Visual preview of quiet hours
 */
function QuietHoursPreview({ start, end }: { start: string; end: string }) {
  const startHour = parseInt(start.split(":")[0], 10);
  const endHour = parseInt(end.split(":")[0], 10);

  // Calculate percentage positions (24-hour scale)
  const startPercent = (startHour / 24) * 100;
  const endPercent = (endHour / 24) * 100;

  // Handle overnight spans
  const isOvernight = startHour > endHour;

  return (
    <div className="mt-4">
      <div className="text-muted-foreground mb-2 text-xs">Quiet period</div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-100">
        {isOvernight ? (
          <>
            {/* Start to midnight */}
            <div
              className="absolute left-0 h-full bg-indigo-200"
              style={{ left: `${startPercent}%`, width: `${100 - startPercent}%` }}
            />
            {/* Midnight to end */}
            <div
              className="absolute left-0 h-full bg-indigo-200"
              style={{ width: `${endPercent}%` }}
            />
          </>
        ) : (
          <div
            className="absolute h-full bg-indigo-200"
            style={{ left: `${startPercent}%`, width: `${endPercent - startPercent}%` }}
          />
        )}
      </div>
      <div className="text-muted-foreground mt-1 flex justify-between text-xs">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>12 AM</span>
      </div>
    </div>
  );
}

/**
 * Generate time options for dropdown (30-minute intervals)
 */
function generateTimeOptions(): Array<{ value: string; label: string }> {
  const options: Array<{ value: string; label: string }> = [];

  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const value = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const displayHour = hour % 12 || 12;
      const ampm = hour < 12 ? "AM" : "PM";
      const label = `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
      options.push({ value, label });
    }
  }

  return options;
}

/**
 * Format time string to 12-hour format
 */
function formatTime(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const displayHour = hour % 12 || 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}
