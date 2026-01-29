"use client";

import { ChevronLeft, Trophy } from "lucide-react";
import Link from "next/link";

import { BadgeShowcase } from "@/components/features/gamification";
import { useGamification } from "@/hooks/useGamification";

/**
 * Badges Page
 * Full badge showcase with filters
 * Story 4-5: Badge Showcase on Profile
 */
export default function BadgesPage() {
  const { getBadgesByCategory, isLoadingBadges } = useGamification();
  const badgesByCategory = getBadgesByCategory();

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          className="bg-muted hover:bg-muted/80 flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
          href="/profile"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Trophy className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-bold">Badges</h1>
            <p className="text-muted-foreground text-sm">Your achievement collection</p>
          </div>
        </div>
      </div>

      {/* Badge Showcase */}
      <BadgeShowcase badgesByCategory={badgesByCategory} isLoading={isLoadingBadges} />
    </div>
  );
}
