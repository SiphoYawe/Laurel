"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export interface NotificationPreferences {
  habitReminders: boolean;
  streakWarnings: boolean;
  podActivity: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

const TIME_OPTIONS = [
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "00:00",
  "01:00",
];

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

interface NotificationStepProps {
  initialPreferences?: NotificationPreferences;
  onNext: (preferences: NotificationPreferences) => void;
  onBack: () => void;
}

/**
 * NotificationStep Component
 * Configure notification preferences and quiet hours
 */
export function NotificationStep({ initialPreferences, onNext, onBack }: NotificationStepProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    initialPreferences || {
      habitReminders: true,
      streakWarnings: true,
      podActivity: true,
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
    }
  );

  const updatePreference = (key: keyof NotificationPreferences, value: boolean | string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    onNext(preferences);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Title */}
      <div className="bg-laurel-sage/20 mb-2 flex h-16 w-16 items-center justify-center rounded-full">
        <Bell className="text-laurel-forest h-8 w-8" strokeWidth={1.5} />
      </div>
      <h2 className="text-foreground mb-2 text-2xl font-bold">Notification Preferences</h2>
      <p className="text-muted-foreground mb-8 text-center">Stay on track with helpful reminders</p>

      {/* Notification Toggles */}
      <div className="mb-6 w-full max-w-sm space-y-4">
        {/* Habit Reminders */}
        <div className="border-border flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label className="text-base font-medium" htmlFor="habit-reminders">
              Habit Reminders
            </Label>
            <p className="text-muted-foreground text-sm">Remind at scheduled habit time</p>
          </div>
          <Switch
            checked={preferences.habitReminders}
            id="habit-reminders"
            onCheckedChange={(checked) => updatePreference("habitReminders", checked)}
          />
        </div>

        {/* Streak Warnings */}
        <div className="border-border flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label className="text-base font-medium" htmlFor="streak-warnings">
              Streak Warnings
            </Label>
            <p className="text-muted-foreground text-sm">Alert when streak is at risk</p>
          </div>
          <Switch
            checked={preferences.streakWarnings}
            id="streak-warnings"
            onCheckedChange={(checked) => updatePreference("streakWarnings", checked)}
          />
        </div>

        {/* Pod Activity */}
        <div className="border-border flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label className="text-base font-medium" htmlFor="pod-activity">
              Pod Activity
            </Label>
            <p className="text-muted-foreground text-sm">Notify when friends complete habits</p>
          </div>
          <Switch
            checked={preferences.podActivity}
            id="pod-activity"
            onCheckedChange={(checked) => updatePreference("podActivity", checked)}
          />
        </div>

        {/* Quiet Hours */}
        <div className="border-border rounded-lg border p-4">
          <Label className="mb-3 block text-base font-medium">Quiet Hours</Label>
          <p className="text-muted-foreground mb-3 text-sm">No notifications during these hours</p>
          <div className="flex items-center gap-3">
            <Select
              value={preferences.quietHoursStart}
              onValueChange={(value) => updatePreference("quietHoursStart", value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((time) => (
                  <SelectItem key={`start-${time}`} value={time}>
                    {formatTime(time)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">to</span>
            <Select
              value={preferences.quietHoursEnd}
              onValueChange={(value) => updatePreference("quietHoursEnd", value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((time) => (
                  <SelectItem key={`end-${time}`} value={time}>
                    {formatTime(time)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="bg-laurel-forest hover:bg-laurel-forest-light min-w-[120px]"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
