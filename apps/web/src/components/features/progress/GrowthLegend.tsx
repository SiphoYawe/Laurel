"use client";

import { cn } from "@/lib/utils";

/**
 * GrowthLegend - Legend for the growth visualization chart
 * Story 3-4: Plateau of Latent Potential Visualization
 */

interface GrowthLegendProps {
  className?: string;
}

const LEGEND_ITEMS = [
  {
    label: "What you expect",
    color: "#6B6B6B",
    style: "dashed",
  },
  {
    label: "What actually happens",
    color: "#2D5A3D",
    style: "solid",
  },
  {
    label: "Valley of Disappointment",
    color: "#E8A54B",
    style: "fill",
  },
];

export function GrowthLegend({ className }: GrowthLegendProps) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-4 text-xs", className)}>
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          {item.style === "fill" ? (
            <div
              className="h-3 w-6 rounded-sm"
              style={{ backgroundColor: item.color, opacity: 0.3 }}
            />
          ) : (
            <div
              className="h-0.5 w-6"
              style={{
                backgroundColor: item.color,
                borderStyle: item.style === "dashed" ? "dashed" : "solid",
                borderWidth: item.style === "dashed" ? "2px" : 0,
                borderColor: item.color,
                height: item.style === "dashed" ? 0 : 3,
              }}
            />
          )}
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
