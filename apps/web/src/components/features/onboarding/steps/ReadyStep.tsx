"use client";

import { Check, PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ReadyStepProps {
  onComplete: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

/**
 * ReadyStep Component
 * Final step - Celebration and CTA to create first habit
 */
export function ReadyStep({ onComplete, onBack, isLoading }: ReadyStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Celebration Illustration */}
      <div className="relative mb-8">
        <div className="bg-laurel-amber/20 flex h-32 w-32 items-center justify-center rounded-full">
          <PartyPopper className="text-laurel-amber h-16 w-16" strokeWidth={1.5} />
        </div>
        <div className="bg-laurel-forest absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full text-white">
          <Check className="h-6 w-6" strokeWidth={2.5} />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-foreground mb-3 text-3xl font-bold">You&apos;re All Set!</h2>

      {/* Description */}
      <p className="text-muted-foreground mb-8 max-w-sm">
        Your account is ready. Let&apos;s create your first habit with help from your AI coach.
      </p>

      {/* Summary Card */}
      <div className="border-border bg-card mb-8 w-full max-w-sm rounded-xl border p-4 text-left">
        <h3 className="text-foreground mb-3 font-semibold">What&apos;s Next?</h3>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Check className="text-laurel-forest mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Chat with your AI coach to design your first habit</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="text-laurel-forest mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Use the Two-Minute Rule to start small</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="text-laurel-forest mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Build your streak and earn XP!</span>
          </li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button disabled={isLoading} variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="bg-laurel-forest hover:bg-laurel-forest-light min-w-[200px]"
          disabled={isLoading}
          size="lg"
          onClick={onComplete}
        >
          {isLoading ? "Setting up..." : "Create my first habit"}
        </Button>
      </div>
    </div>
  );
}
