"use client";

import { motion } from "framer-motion";
import { Layers, Clock, Flame, Target, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * SrsStats - Display learning statistics
 * Story 6-5: Due Card Notifications
 */

interface DailyStat {
  date: string;
  cardsReviewed: number;
  accuracy: number;
}

interface SrsStatsProps {
  totalDecks: number;
  totalCards: number;
  totalReviews: number;
  dueCards: number;
  currentStreak: number;
  dailyStats: DailyStat[];
  isLoading?: boolean;
  className?: string;
}

export function SrsStats({
  totalCards,
  dueCards,
  currentStreak,
  dailyStats,
  isLoading,
  className,
}: SrsStatsProps) {
  if (isLoading) {
    return <SrsStatsSkeleton />;
  }

  // Calculate overall accuracy from daily stats
  const recentStats = dailyStats.slice(-7);
  const avgAccuracy =
    recentStats.length > 0
      ? Math.round(recentStats.reduce((sum, s) => sum + s.accuracy, 0) / recentStats.length)
      : 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          color="text-blue-500"
          icon={<Layers className="h-5 w-5" />}
          label="Total Cards"
          value={totalCards}
        />
        <StatCard
          color="text-amber-500"
          icon={<Clock className="h-5 w-5" />}
          label="Due Today"
          value={dueCards}
        />
        <StatCard
          color="text-orange-500"
          icon={<Flame className="h-5 w-5" />}
          label="Day Streak"
          value={currentStreak}
        />
        <StatCard
          color="text-green-500"
          icon={<Target className="h-5 w-5" />}
          label="Accuracy"
          suffix="%"
          value={avgAccuracy}
        />
      </div>

      {/* Activity Chart */}
      {dailyStats.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityChart data={dailyStats.slice(-14)} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  color: string;
}

function StatCard({ icon, label, value, suffix, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={cn("bg-muted flex h-10 w-10 items-center justify-center rounded-lg", color)}
        >
          {icon}
        </div>
        <div>
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="text-foreground text-xl font-bold">
            {value}
            {suffix}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityChartProps {
  data: DailyStat[];
}

function ActivityChart({ data }: ActivityChartProps) {
  const maxReviews = Math.max(...data.map((d) => d.cardsReviewed), 1);

  return (
    <div className="flex items-end gap-1">
      {data.map((stat, idx) => {
        const height = (stat.cardsReviewed / maxReviews) * 100;
        const date = new Date(stat.date);
        const dayLabel = date.toLocaleDateString("en", { weekday: "short" });

        return (
          <div key={stat.date} className="flex flex-1 flex-col items-center">
            <div
              className="bg-muted relative h-20 w-full rounded-t"
              title={`${stat.cardsReviewed} cards`}
            >
              <motion.div
                animate={{ height: `${height}%` }}
                className={cn(
                  "absolute bottom-0 left-0 right-0 rounded-t",
                  stat.accuracy >= 80
                    ? "bg-green-500"
                    : stat.accuracy >= 60
                      ? "bg-amber-500"
                      : stat.cardsReviewed > 0
                        ? "bg-red-500"
                        : "bg-muted"
                )}
                initial={{ height: 0 }}
                transition={{ delay: idx * 0.05 }}
              />
            </div>
            <p className="text-muted-foreground mt-1 text-[10px]">{dayLabel}</p>
          </div>
        );
      })}
    </div>
  );
}

function SrsStatsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="bg-muted h-10 w-10 animate-pulse rounded-lg" />
              <div className="space-y-1">
                <div className="bg-muted h-3 w-16 animate-pulse rounded" />
                <div className="bg-muted h-6 w-12 animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="bg-muted h-24 animate-pulse rounded" />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * CompactSrsStats - Smaller stats display
 */
interface CompactSrsStatsProps {
  dueCount: number;
  streak: number;
  className?: string;
}

export function CompactSrsStats({ dueCount, streak, className }: CompactSrsStatsProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {dueCount > 0 && (
        <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm dark:bg-amber-900/30">
          <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="font-medium text-amber-700 dark:text-amber-400">{dueCount} due</span>
        </div>
      )}
      {streak > 0 && (
        <div className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm dark:bg-orange-900/30">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="font-medium text-orange-600 dark:text-orange-400">
            {streak} day streak
          </span>
        </div>
      )}
    </div>
  );
}
