"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JAMES_CLEAR_QUOTE, LEARNING_EXAMPLES } from "@/lib/growth-calculations";
import { cn } from "@/lib/utils";

/**
 * GrowthExplanation - Modal explaining the plateau of latent potential
 * Story 3-4: Plateau of Latent Potential Visualization
 */

interface GrowthExplanationProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function GrowthExplanation({ isOpen, onClose, className }: GrowthExplanationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className={cn("max-h-[85vh] overflow-y-auto sm:max-w-lg", className)}>
        <DialogHeader>
          <DialogTitle>Understanding the Valley of Disappointment</DialogTitle>
          <DialogDescription>
            Why your results lag behind your effort - and why that&apos;s perfectly normal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* James Clear Quote */}
          <blockquote className="border-forest-green border-l-4 bg-green-50 p-4 italic">
            <p className="text-green-800">&quot;{JAMES_CLEAR_QUOTE.text}&quot;</p>
            <footer className="mt-2 text-sm text-green-700">
              — {JAMES_CLEAR_QUOTE.author}, <cite>{JAMES_CLEAR_QUOTE.source}</cite>
            </footer>
          </blockquote>

          {/* Explanation */}
          <div className="space-y-3">
            <h4 className="font-semibold">The Power of Compound Growth</h4>
            <p className="text-muted-foreground text-sm">
              When you start a new habit, progress feels painfully slow. You expect linear
              improvement - put in the work, see the results. But that&apos;s not how habits work.
            </p>
            <p className="text-muted-foreground text-sm">
              In reality, your efforts are compounding invisibly. Like an ice cube slowly warming
              from 25°F to 32°F, nothing seems to change - until suddenly, it melts. This is the{" "}
              <strong>plateau of latent potential</strong>.
            </p>
            <p className="text-muted-foreground text-sm">
              Most people quit during the valley because they can&apos;t see the progress. But if
              you keep showing up, the breakthrough will come. Your job is to trust the process.
            </p>
          </div>

          {/* Learning Examples */}
          <div className="space-y-3">
            <h4 className="font-semibold">Examples in Learning</h4>
            <div className="grid gap-3">
              {LEARNING_EXAMPLES.map((example) => (
                <div key={example.title} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">{example.title}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{example.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Takeaway */}
          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">Key Takeaway</p>
            <p className="mt-1 text-sm text-amber-700">
              The work is never wasted. Every day you show up, you&apos;re adding to your potential
              energy. The breakthrough is coming - just keep going.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Got it!</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
