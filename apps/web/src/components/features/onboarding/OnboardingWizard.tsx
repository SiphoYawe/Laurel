"use client";

import { AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { OnboardingStep } from "./OnboardingStep";
import { ProgressDots } from "./ProgressDots";
import { HowItWorksStep } from "./steps/HowItWorksStep";
import { NotificationStep, type NotificationPreferences } from "./steps/NotificationStep";
import { ReadyStep } from "./steps/ReadyStep";
import { TimezoneStep } from "./steps/TimezoneStep";
import { WelcomeStep } from "./steps/WelcomeStep";

const TOTAL_STEPS = 5;

interface OnboardingData {
  timezone: string;
  notificationPreferences: NotificationPreferences;
}

interface OnboardingWizardProps {
  userName?: string;
  onComplete: (data: OnboardingData) => Promise<void>;
}

/**
 * OnboardingWizard Component
 * Multi-step onboarding flow with URL state persistence
 */
export function OnboardingWizard({ userName, onComplete }: OnboardingWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial step from URL or default to 1
  const initialStep = parseInt(searchParams.get("step") || "1", 10);
  const [currentStep, setCurrentStep] = useState(Math.min(Math.max(initialStep, 1), TOTAL_STEPS));
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isCompleting, setIsCompleting] = useState(false);

  // Store data across steps
  const [timezone, setTimezone] = useState<string>("");
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    habitReminders: true,
    streakWarnings: true,
    podActivity: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  });

  const updateStep = useCallback(
    (step: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", step.toString());
      router.push(`/onboarding?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const goNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setDirection("forward");
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateStep(nextStep);
    }
  }, [currentStep, updateStep]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setDirection("backward");
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      updateStep(prevStep);
    }
  }, [currentStep, updateStep]);

  const handleTimezoneNext = useCallback(
    (tz: string) => {
      setTimezone(tz);
      goNext();
    },
    [goNext]
  );

  const handleNotificationNext = useCallback(
    (prefs: NotificationPreferences) => {
      setNotificationPrefs(prefs);
      goNext();
    },
    [goNext]
  );

  const handleComplete = useCallback(async () => {
    setIsCompleting(true);
    try {
      await onComplete({
        timezone,
        notificationPreferences: notificationPrefs,
      });
      // Redirect happens in the onComplete callback
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setIsCompleting(false);
    }
  }, [onComplete, timezone, notificationPrefs]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep userName={userName} onNext={goNext} />;
      case 2:
        return <HowItWorksStep onBack={goBack} onNext={goNext} />;
      case 3:
        return (
          <TimezoneStep initialTimezone={timezone} onBack={goBack} onNext={handleTimezoneNext} />
        );
      case 4:
        return (
          <NotificationStep
            initialPreferences={notificationPrefs}
            onBack={goBack}
            onNext={handleNotificationNext}
          />
        );
      case 5:
        return <ReadyStep isLoading={isCompleting} onBack={goBack} onComplete={handleComplete} />;
      default:
        return <WelcomeStep userName={userName} onNext={goNext} />;
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      {/* Progress Indicator */}
      <div className="mb-8">
        <ProgressDots currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Step Content */}
      <div className="w-full max-w-lg">
        <AnimatePresence initial={false} mode="wait">
          <OnboardingStep key={currentStep} direction={direction}>
            {renderStep()}
          </OnboardingStep>
        </AnimatePresence>
      </div>
    </div>
  );
}
