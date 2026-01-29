"use client";

import { cn } from "@/lib/utils";

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

/**
 * ProgressDots Component
 * Visual step indicator for multi-step wizard
 */
export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  return (
    <div
      aria-label={`Step ${currentStep} of ${totalSteps}`}
      aria-valuemax={totalSteps}
      aria-valuemin={1}
      aria-valuenow={currentStep}
      className="flex items-center justify-center gap-2"
      role="progressbar"
    >
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div
            key={stepNumber}
            aria-hidden="true"
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-all duration-300",
              isCompleted && "bg-laurel-forest",
              isCurrent && "bg-laurel-forest w-6",
              !isCompleted && !isCurrent && "bg-laurel-forest/20"
            )}
          />
        );
      })}
    </div>
  );
}
