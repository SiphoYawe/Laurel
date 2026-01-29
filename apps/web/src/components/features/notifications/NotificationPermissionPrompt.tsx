"use client";

import { Bell, BellOff, Settings } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNotifications } from "@/hooks/useNotifications";
import { getNotificationSettingsUrl } from "@/lib/notifications";
import { cn } from "@/lib/utils";

/**
 * NotificationPermissionPrompt - Prompt user to enable notifications
 * Story 3-7: Habit Reminder Notifications
 */

interface NotificationPermissionPromptProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function NotificationPermissionPrompt({
  isOpen,
  onClose,
  className,
}: NotificationPermissionPromptProps) {
  const { permission, isSupported, isRegistering, enableNotifications, isPermissionDenied } =
    useNotifications();
  const [error, setError] = useState<string | null>(null);

  const handleEnable = async () => {
    setError(null);
    const success = await enableNotifications();

    if (success) {
      onClose();
    } else if (permission === "denied") {
      setError("Notifications were blocked. Please enable them in your browser settings.");
    } else {
      setError("Failed to enable notifications. Please try again.");
    }
  };

  const settingsUrl = getNotificationSettingsUrl();

  if (!isSupported) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className={cn("sm:max-w-md", className)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BellOff className="text-muted-foreground h-5 w-5" />
              Notifications Not Supported
            </DialogTitle>
            <DialogDescription>
              Your browser doesn&apos;t support push notifications. Try using a modern browser like
              Chrome, Firefox, or Safari.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isPermissionDenied) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className={cn("sm:max-w-md", className)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BellOff className="text-muted-foreground h-5 w-5" />
              Notifications Blocked
            </DialogTitle>
            <DialogDescription>
              You&apos;ve previously blocked notifications. To enable them, you&apos;ll need to
              update your browser settings.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="mb-2 text-sm font-medium">How to enable:</h4>
            <ol className="text-muted-foreground space-y-1 text-sm">
              <li>1. Click the lock/info icon in your browser&apos;s address bar</li>
              <li>2. Find &quot;Notifications&quot; or &quot;Site settings&quot;</li>
              <li>3. Change the setting to &quot;Allow&quot;</li>
              <li>4. Refresh this page</li>
            </ol>
          </div>

          <div className="flex justify-end gap-2">
            {settingsUrl && (
              <Button asChild variant="outline">
                <a href={settingsUrl} rel="noopener noreferrer" target="_blank">
                  <Settings className="mr-2 h-4 w-4" />
                  Open Settings
                </a>
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="text-warm-amber h-5 w-5" />
            Enable Notifications
          </DialogTitle>
          <DialogDescription>
            Get reminders to never miss your habits and stay on track with your goals.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-sage/10 mt-0.5 rounded-full p-2">
                <Bell className="text-sage h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Timely Reminders</h4>
                <p className="text-muted-foreground text-sm">
                  Get notified when it&apos;s time for your habits
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-warm-amber/10 mt-0.5 rounded-full p-2">
                <span className="text-warm-amber text-sm">🔥</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Streak Protection</h4>
                <p className="text-muted-foreground text-sm">
                  Warnings before your streaks are at risk
                </p>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Not now
          </Button>
          <Button disabled={isRegistering} onClick={handleEnable}>
            {isRegistering ? "Enabling..." : "Enable Notifications"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
