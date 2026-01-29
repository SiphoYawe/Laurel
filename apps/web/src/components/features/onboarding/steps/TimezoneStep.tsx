"use client";

import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Common timezones grouped by region
const TIMEZONE_GROUPS = {
  Americas: [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Toronto",
    "America/Vancouver",
    "America/Sao_Paulo",
    "America/Mexico_City",
  ],
  Europe: [
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Madrid",
    "Europe/Rome",
    "Europe/Amsterdam",
    "Europe/Stockholm",
    "Europe/Moscow",
  ],
  "Asia/Pacific": [
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Hong_Kong",
    "Asia/Singapore",
    "Asia/Seoul",
    "Asia/Kolkata",
    "Asia/Dubai",
    "Australia/Sydney",
    "Pacific/Auckland",
  ],
  Africa: ["Africa/Johannesburg", "Africa/Cairo", "Africa/Lagos", "Africa/Nairobi"],
};

function formatTimezone(tz: string): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const time = formatter.format(now);
  const cityName = tz.split("/").pop()?.replace(/_/g, " ") || tz;
  return `${cityName} (${time})`;
}

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York"; // Fallback
  }
}

interface TimezoneStepProps {
  initialTimezone?: string;
  onNext: (timezone: string) => void;
  onBack: () => void;
}

/**
 * TimezoneStep Component
 * Auto-detects and allows selection of timezone
 */
export function TimezoneStep({ initialTimezone, onNext, onBack }: TimezoneStepProps) {
  const detectedTz = initialTimezone || detectTimezone();
  const [timezone, setTimezone] = useState(detectedTz);
  const [autoDetected, setAutoDetected] = useState(!initialTimezone);

  // Initialize time on client only to prevent hydration mismatch
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  // Update current time display (client-side only)
  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setCurrentTime(formatter.format(new Date()));
      } catch {
        setCurrentTime("--:--:-- --");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  // Detect if initial timezone was auto-detected vs fallback
  useEffect(() => {
    if (!initialTimezone) {
      const detected = detectTimezone();
      setAutoDetected(detected !== "America/New_York");
    }
  }, [initialTimezone]);

  const handleNext = () => {
    onNext(timezone);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Title */}
      <div className="bg-laurel-sage/20 mb-2 flex h-16 w-16 items-center justify-center rounded-full">
        <Globe className="text-laurel-forest h-8 w-8" strokeWidth={1.5} />
      </div>
      <h2 className="text-foreground mb-2 text-2xl font-bold">Set Your Timezone</h2>
      <p className="text-muted-foreground mb-8 text-center">
        We&apos;ll use this for habit reminders and streak calculations
      </p>

      {/* Timezone Selector */}
      <div className="mb-6 w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="timezone" id="timezone-label">
            Your Timezone
          </Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger
              aria-describedby="timezone-description"
              aria-labelledby="timezone-label"
              id="timezone"
            >
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TIMEZONE_GROUPS).map(([region, zones]) => (
                <div key={region}>
                  <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
                    {region}
                  </div>
                  {zones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {formatTimezone(tz)}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Time Display */}
        <div className="border-border bg-muted/50 rounded-lg border p-4 text-center">
          <p className="text-muted-foreground text-sm">
            Current time in your timezone
            {!autoDetected && (
              <span className="ml-1 text-xs text-amber-600">(auto-detect unavailable)</span>
            )}
          </p>
          <p className="text-foreground mt-1 text-2xl font-semibold">
            {currentTime ?? "Loading..."}
          </p>
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
          Confirm
        </Button>
      </div>
    </div>
  );
}
