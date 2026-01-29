"use client";

import { Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  userName?: string;
  onNext: () => void;
}

/**
 * WelcomeStep Component
 * First step of onboarding - Welcome message
 */
export function WelcomeStep({ userName, onNext }: WelcomeStepProps) {
  const displayName = userName || "there";

  return (
    <div className="flex flex-col items-center text-center">
      {/* Illustration */}
      <div className="bg-laurel-sage/20 mb-8 flex h-32 w-32 items-center justify-center rounded-full">
        <Sprout className="text-laurel-forest h-16 w-16" strokeWidth={1.5} />
      </div>

      {/* Welcome Message */}
      <h1 className="text-foreground mb-3 text-3xl font-bold">Welcome to Laurel, {displayName}!</h1>

      {/* Tagline */}
      <p className="text-muted-foreground mb-8 max-w-sm text-lg">
        Build study habits that actually stick
      </p>

      {/* CTA Button */}
      <Button
        className="bg-laurel-forest hover:bg-laurel-forest-light min-w-[200px]"
        size="lg"
        onClick={onNext}
      >
        Let&apos;s get started
      </Button>
    </div>
  );
}
