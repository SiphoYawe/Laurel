"use client";

import { motion } from "framer-motion";
import { Trophy, Filter } from "lucide-react";
import { useState, useMemo } from "react";

import {
  BadgeCard,
  BadgeUnlockCelebration,
  type BadgeRarity,
  type BadgeCategory,
} from "./BadgeCard";

import { cn } from "@/lib/utils";

/**
 * BadgeShowcase - Grid display of all badges
 * Story 4-5: Badge Showcase on Profile
 *
 * Features:
 * - Category tabs
 * - Earned/unearned filters
 * - Progress tracking
 */

interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  requirementType: string;
  requirementValue: number;
  xpReward: number;
  rarity: BadgeRarity;
}

interface BadgeWithStatus extends BadgeDefinition {
  earned: boolean;
  earnedAt?: string;
}

interface BadgeShowcaseProps {
  badgesByCategory: Record<string, BadgeWithStatus[]>;
  isLoading?: boolean;
  className?: string;
}

const categoryLabels: Record<BadgeCategory, { label: string; icon: string }> = {
  milestone: { label: "Milestones", icon: "🎯" },
  streak: { label: "Streaks", icon: "🔥" },
  technique: { label: "Techniques", icon: "🧠" },
  social: { label: "Social", icon: "👥" },
  time: { label: "Time", icon: "⏰" },
  special: { label: "Special", icon: "⭐" },
};

type FilterType = "all" | "earned" | "unearned";

export function BadgeShowcase({
  badgesByCategory,
  isLoading = false,
  className,
}: BadgeShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | "all">("all");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithStatus | null>(null);

  // Get all categories that have badges
  const categories = useMemo(() => {
    return Object.keys(badgesByCategory) as BadgeCategory[];
  }, [badgesByCategory]);

  // Filter badges based on category and filter
  const filteredBadges = useMemo(() => {
    let badges: BadgeWithStatus[] = [];

    if (selectedCategory === "all") {
      badges = Object.values(badgesByCategory).flat();
    } else {
      badges = badgesByCategory[selectedCategory] || [];
    }

    if (filter === "earned") {
      badges = badges.filter((b) => b.earned);
    } else if (filter === "unearned") {
      badges = badges.filter((b) => !b.earned);
    }

    return badges;
  }, [badgesByCategory, selectedCategory, filter]);

  // Calculate stats
  const stats = useMemo(() => {
    const allBadges = Object.values(badgesByCategory).flat();
    const earned = allBadges.filter((b) => b.earned).length;
    return {
      total: allBadges.length,
      earned,
      percentage: allBadges.length > 0 ? Math.round((earned / allBadges.length) * 100) : 0,
    };
  }, [badgesByCategory]);

  if (isLoading) {
    return <BadgeShowcaseSkeleton />;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-amber-500" />
          <div>
            <h2 className="text-xl font-bold">Badge Collection</h2>
            <p className="text-muted-foreground text-sm">
              {stats.earned} of {stats.total} badges earned ({stats.percentage}%)
            </p>
          </div>
        </div>

        {/* Progress circle */}
        <div className="relative h-14 w-14">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <circle className="stroke-muted" cx="18" cy="18" fill="none" r="15" strokeWidth="3" />
            <circle
              className="stroke-amber-500 transition-all duration-500"
              cx="18"
              cy="18"
              fill="none"
              r="15"
              strokeDasharray={`${stats.percentage}, 100`}
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {stats.percentage}%
          </span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            selectedCategory === "all"
              ? "bg-forest-green text-white"
              : "bg-muted hover:bg-muted-foreground/10"
          )}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              selectedCategory === category
                ? "bg-forest-green text-white"
                : "bg-muted hover:bg-muted-foreground/10"
            )}
            onClick={() => setSelectedCategory(category)}
          >
            {categoryLabels[category]?.icon} {categoryLabels[category]?.label || category}
          </button>
        ))}
      </div>

      {/* Filter buttons */}
      <div className="flex items-center gap-2">
        <Filter className="text-muted-foreground h-4 w-4" />
        <div className="bg-muted flex rounded-lg p-1">
          {(["all", "earned", "unearned"] as FilterType[]).map((f) => (
            <button
              key={f}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                filter === f
                  ? "bg-background shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-muted-foreground ml-auto text-sm">
          {filteredBadges.length} badge{filteredBadges.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Badge grid */}
      {filteredBadges.length > 0 ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          initial={{ opacity: 0 }}
        >
          {filteredBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.03 }}
            >
              <BadgeCard
                badge={badge}
                earned={badge.earned}
                earnedAt={badge.earnedAt}
                size="md"
                onClick={() => setSelectedBadge(badge)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-12 text-center">
          <Trophy className="text-muted-foreground/50 mx-auto h-12 w-12" />
          <p className="text-muted-foreground mt-4">
            {filter === "earned"
              ? "No badges earned yet. Keep going!"
              : filter === "unearned"
                ? "You've earned all the badges in this category!"
                : "No badges available."}
          </p>
        </div>
      )}

      {/* Badge detail modal */}
      {selectedBadge && selectedBadge.earned && (
        <BadgeUnlockCelebration
          badge={selectedBadge}
          isVisible={!!selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  );
}

/**
 * BadgeShowcaseSkeleton - Loading placeholder
 */
function BadgeShowcaseSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
        <div className="space-y-2">
          <div className="bg-muted h-5 w-32 animate-pulse rounded" />
          <div className="bg-muted h-4 w-48 animate-pulse rounded" />
        </div>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-muted h-8 w-20 animate-pulse rounded-full" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-muted h-32 animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

/**
 * CompactBadgeRow - Horizontal scrollable badge display
 */
interface CompactBadgeRowProps {
  badges: BadgeWithStatus[];
  maxDisplay?: number;
  onViewAll?: () => void;
  className?: string;
}

export function CompactBadgeRow({
  badges,
  maxDisplay = 5,
  onViewAll,
  className,
}: CompactBadgeRowProps) {
  const earnedBadges = badges.filter((b) => b.earned);
  const displayBadges = earnedBadges.slice(0, maxDisplay);
  const remaining = earnedBadges.length - maxDisplay;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {displayBadges.map((badge) => (
        <div
          key={badge.id}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-xl"
          title={badge.name}
        >
          {badge.icon}
        </div>
      ))}
      {remaining > 0 && (
        <button
          className="bg-muted hover:bg-muted-foreground/10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium"
          onClick={onViewAll}
        >
          +{remaining}
        </button>
      )}
      {earnedBadges.length === 0 && (
        <span className="text-muted-foreground text-sm">No badges yet</span>
      )}
    </div>
  );
}
