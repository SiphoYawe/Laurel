"use client";

import { Brain, Sprout, Users } from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="border-border bg-card flex flex-col items-center rounded-xl border p-6 text-center">
      <div className="bg-laurel-sage/20 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
        <Icon className="text-laurel-forest h-7 w-7" strokeWidth={1.5} />
      </div>
      <h3 className="text-foreground mb-2 font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

interface HowItWorksStepProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * HowItWorksStep Component
 * Explains the 3 key concepts of Laurel
 */
export function HowItWorksStep({ onNext, onBack }: HowItWorksStepProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Title */}
      <h2 className="text-foreground mb-2 text-2xl font-bold">How Laurel Works</h2>
      <p className="text-muted-foreground mb-8">Three pillars for building lasting habits</p>

      {/* Feature Cards */}
      <div className="mb-8 grid w-full max-w-lg gap-4">
        <FeatureCard
          description="Small daily habits compound into big results"
          icon={Sprout}
          title="Atomic Habits"
        />
        <FeatureCard
          description="Personalized guidance adapted to your goals"
          icon={Brain}
          title="AI Coach"
        />
        <FeatureCard
          description="Study with friends and stay motivated together"
          icon={Users}
          title="Accountability"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="bg-laurel-forest hover:bg-laurel-forest-light min-w-[120px]"
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
