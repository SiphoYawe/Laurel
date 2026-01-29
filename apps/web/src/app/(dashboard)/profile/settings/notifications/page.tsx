"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { NotificationSettings } from "@/components/features/notifications/NotificationSettings";
import { Button } from "@/components/ui/button";

/**
 * Notification Settings Page
 * Story 3-8: Notification Settings and Quiet Hours
 */
export default function NotificationSettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      {/* Header with back button */}
      <div className="mb-6 flex items-center gap-4">
        <Button asChild size="icon" variant="ghost">
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to profile</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Notification Settings</h1>
      </div>

      {/* Notification settings component */}
      <NotificationSettings />
    </div>
  );
}
