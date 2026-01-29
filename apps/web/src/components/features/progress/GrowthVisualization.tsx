"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Info } from "lucide-react";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { GrowthExplanation } from "./GrowthExplanation";
import { GrowthLegend } from "./GrowthLegend";
import { GrowthMessage } from "./GrowthMessage";

import { Button } from "@/components/ui/button";
import {
  calculateExpectationY,
  calculateRealityY,
  generateExpectationData,
  generateRealityData,
  getStageMessage,
} from "@/lib/growth-calculations";
import { cn } from "@/lib/utils";

/**
 * GrowthVisualization - Plateau of Latent Potential Chart
 * Story 3-4: Visualizes the "valley of disappointment" from Atomic Habits
 */

interface GrowthVisualizationProps {
  currentDayCount: number;
  maxDays?: number;
  showLegend?: boolean;
  showMessage?: boolean;
  className?: string;
}

export function GrowthVisualization({
  currentDayCount,
  maxDays = 90,
  showLegend = true,
  showMessage = true,
  className,
}: GrowthVisualizationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Generate chart data
  const chartData = useMemo(() => {
    const expectationData = generateExpectationData(maxDays, 2);
    const realityData = generateRealityData(maxDays, 2);

    // Combine data for the chart
    return expectationData.map((point, index) => ({
      day: point.day,
      expectation: point.value,
      reality: realityData[index]?.value ?? 0,
    }));
  }, [maxDays]);

  // Calculate marker position
  const markerY = useMemo(() => {
    return calculateRealityY(Math.min(currentDayCount, maxDays));
  }, [currentDayCount, maxDays]);

  // Get stage message
  const stageMessage = useMemo(() => {
    return getStageMessage(currentDayCount);
  }, [currentDayCount]);

  // Calculate valley area data (where expectation > reality)
  const valleyData = useMemo(() => {
    return chartData.filter((point) => point.expectation > point.reality);
  }, [chartData]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Chart header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Your Growth Journey</h3>
        <Button size="sm" variant="ghost" onClick={() => setIsModalOpen(true)}>
          <Info className="mr-1 h-4 w-4" />
          Learn more
        </Button>
      </div>

      {/* Chart */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid stroke="#E5E5E5" strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={{ stroke: "#E5E5E5" }}
              dataKey="day"
              domain={[0, maxDays]}
              label={{
                value: "Days of Effort",
                position: "bottom",
                offset: 0,
                style: { fill: "#6B6B6B", fontSize: 12 },
              }}
              stroke="#6B6B6B"
              tick={{ fill: "#6B6B6B", fontSize: 11 }}
              tickLine={false}
              ticks={[0, 30, 60, 90]}
            />
            <YAxis
              axisLine={{ stroke: "#E5E5E5" }}
              domain={[0, 100]}
              label={{
                value: "Results",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fill: "#6B6B6B", fontSize: 12 },
              }}
              stroke="#6B6B6B"
              tick={{ fill: "#6B6B6B", fontSize: 11 }}
              tickLine={false}
              ticks={[0, 50, 100]}
            />

            {/* Valley of Disappointment shaded area */}
            <Area
              data={valleyData}
              dataKey="expectation"
              fill="#E8A54B"
              fillOpacity={0.15}
              stroke="none"
              type="monotone"
            />

            {/* Expectation line (dashed, gray) */}
            <Line
              dataKey="expectation"
              dot={false}
              name="What you expect"
              stroke="#6B6B6B"
              strokeDasharray="5 5"
              strokeWidth={2}
              type="linear"
            />

            {/* Reality line (solid, green) */}
            <Line
              dataKey="reality"
              dot={false}
              name="What actually happens"
              stroke="#2D5A3D"
              strokeWidth={3}
              type="monotone"
            />

            {/* Vertical reference line at current day */}
            {currentDayCount <= maxDays && (
              <ReferenceLine
                stroke="#E8A54B"
                strokeDasharray="3 3"
                strokeWidth={1}
                x={currentDayCount}
              />
            )}

            {/* "You are here" marker */}
            {currentDayCount <= maxDays && (
              <ReferenceDot
                fill="#E8A54B"
                r={8}
                stroke="#fff"
                strokeWidth={2}
                x={currentDayCount}
                y={markerY}
              />
            )}

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#ccc", strokeDasharray: "3 3" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Valley label */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
      >
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
          Day {currentDayCount} - {stageMessage.title}
        </span>
      </motion.div>

      {/* Legend */}
      {showLegend && <GrowthLegend />}

      {/* Stage message */}
      {showMessage && <GrowthMessage message={stageMessage.message} stage={stageMessage.title} />}

      {/* Learn more modal */}
      <GrowthExplanation isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

/**
 * Custom tooltip for the chart
 */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: number;
}) {
  if (!active || !payload) return null;

  return (
    <div className="bg-popover rounded-lg border p-3 shadow-md">
      <p className="mb-2 text-sm font-medium">Day {label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{Math.round(entry.value)}%</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loading state
 */
export function GrowthVisualizationSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="bg-muted h-5 w-40 rounded" />
        <div className="bg-muted h-8 w-24 rounded" />
      </div>
      <div className="bg-muted h-[220px] w-full rounded-lg" />
      <div className="flex justify-center">
        <div className="bg-muted h-6 w-32 rounded-full" />
      </div>
    </div>
  );
}
