"use client";

import { useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import type { NotificationPreferences } from "@/components/features/onboarding/steps/NotificationStep";

import { OnboardingWizard } from "@/components/features/onboarding";
import { useAuth } from "@/lib/supabase/auth-context";
import { createClient } from "@/lib/supabase/client";

interface OnboardingData {
  timezone: string;
  notificationPreferences: NotificationPreferences;
}

function OnboardingContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Check if user has already completed onboarding
  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user) return;

      const supabase = createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (profile?.onboarding_completed) {
        // Already completed, redirect to dashboard
        router.replace("/dashboard");
      } else {
        setIsCheckingStatus(false);
      }
    }

    checkOnboardingStatus();
  }, [user, router]);

  const handleComplete = useCallback(
    async (data: OnboardingData) => {
      if (!user) return;

      const supabase = createClient();

      // Update profile with onboarding data
      const { error } = await supabase
        .from("profiles")
        .update({
          timezone: data.timezone,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.error("Failed to save onboarding data:", error);
        throw error;
      }

      // Save notification preferences to user_preferences table
      const { error: prefsError } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          habit_reminders: data.notificationPreferences.habitReminders,
          streak_warnings: data.notificationPreferences.streakWarnings,
          pod_activity: data.notificationPreferences.podActivity,
          quiet_hours_start: data.notificationPreferences.quietHoursStart,
          quiet_hours_end: data.notificationPreferences.quietHoursEnd,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (prefsError) {
        console.error("Failed to save notification preferences:", prefsError);
        // Non-critical, continue
      }

      // Redirect to chat to create first habit
      router.push("/chat");
    },
    [user, router]
  );

  if (isCheckingStatus) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Get user's name from email (first part before @)
  const userName = user?.email?.split("@")[0];

  return <OnboardingWizard userName={userName} onComplete={handleComplete} />;
}

/**
 * Onboarding Page
 * First-time user onboarding flow
 */
export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
