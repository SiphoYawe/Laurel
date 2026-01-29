"use client";

import { Bell, ChevronRight, LogOut, Settings, User, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { XpDisplay, CompactBadgeRow, LevelProgress } from "@/components/features/gamification";
import { useGamification } from "@/hooks/useGamification";
import { signOut } from "@/lib/supabase/auth";
import { useAuth } from "@/lib/supabase/auth-context";
import { trpc } from "@/lib/trpc/client";

/**
 * Profile Page
 * User profile with gamification stats
 * Stories 4-2 through 4-6: Gamification System
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Gamification data
  const { stats, isLoadingStats, getBadgesByCategory, levelProgression, userBadges } =
    useGamification();

  // Get habit stats
  const { data: habitStats } = trpc.habits.getStats.useQuery();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      setIsLoggingOut(false);
    }
  };

  const badgesByCategory = getBadgesByCategory();
  const allBadges = Object.values(badgesByCategory).flat();

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-laurel-forest/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <User className="text-laurel-forest h-5 w-5" />
        </div>
        <div>
          <h1 className="text-foreground text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground text-sm">Your journey at a glance</p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="border-border bg-card rounded-xl border p-6">
        <div className="flex items-center gap-4">
          <div className="bg-laurel-sage/20 flex h-16 w-16 items-center justify-center rounded-full">
            <User className="text-laurel-sage h-8 w-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-foreground font-semibold">{user?.email || "User"}</h2>
            <p className="text-muted-foreground text-sm">
              Joined{" "}
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "recently"}
            </p>
          </div>
        </div>
      </div>

      {/* XP and Level Display */}
      {!isLoadingStats && (
        <XpDisplay
          showDetails
          className="shadow-sm"
          currentLevel={stats.currentLevel}
          levelTitle={stats.levelTitle}
          nextLevelXp={stats.nextLevelXp}
          progress={stats.progress}
          size="lg"
          totalXp={stats.totalXp}
        />
      )}

      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border-border bg-card rounded-xl border p-4 text-center">
          <div className="text-laurel-forest text-2xl font-bold">
            {habitStats?.totalHabits ?? 0}
          </div>
          <p className="text-muted-foreground text-sm">Total Habits</p>
        </div>
        <div className="border-border bg-card rounded-xl border p-4 text-center">
          <div className="text-laurel-amber text-2xl font-bold">
            {habitStats?.longestStreak ?? 0}
          </div>
          <p className="text-muted-foreground text-sm">Longest Streak</p>
        </div>
        <div className="border-border bg-card rounded-xl border p-4 text-center">
          <div className="text-laurel-sage text-2xl font-bold">
            {userBadges.filter((b) => b?.badge).length}
          </div>
          <p className="text-muted-foreground text-sm">Badges Earned</p>
        </div>
      </div>

      {/* Badges Preview */}
      <div className="border-border bg-card rounded-xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold">Badges</h3>
          </div>
          <Link
            className="text-forest-green flex items-center text-sm font-medium hover:underline"
            href="/profile/badges"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <CompactBadgeRow
          badges={allBadges}
          maxDisplay={6}
          onViewAll={() => router.push("/profile/badges")}
        />
      </div>

      {/* Level Journey (Collapsed) */}
      <details className="border-border bg-card rounded-xl border">
        <summary className="cursor-pointer p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Level Journey</h3>
            <span className="text-muted-foreground text-sm">
              Level {stats.currentLevel} - {stats.levelTitle}
            </span>
          </div>
        </summary>
        <div className="border-border border-t p-4">
          <LevelProgress
            currentLevel={stats.currentLevel}
            levelProgression={levelProgression}
            totalXp={stats.totalXp}
          />
        </div>
      </details>

      {/* Settings Section */}
      <div className="border-border bg-card rounded-xl border">
        <div className="border-border border-b p-4">
          <h3 className="text-foreground font-semibold">Settings</h3>
        </div>
        <div className="divide-border divide-y">
          <Link
            className="text-foreground hover:bg-muted/50 flex w-full items-center gap-3 p-4 text-left text-sm transition-colors"
            href="/profile/settings/notifications"
          >
            <Bell className="text-muted-foreground h-5 w-5" />
            <span className="flex-1">Notifications</span>
            <ChevronRight className="text-muted-foreground h-4 w-4" />
          </Link>
          <button
            disabled
            className="text-foreground flex w-full items-center gap-3 p-4 text-left text-sm opacity-50"
            type="button"
          >
            <Settings className="text-muted-foreground h-5 w-5" />
            <span>Preferences (Coming Soon)</span>
          </button>
          <button
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-3 p-4 text-left text-sm transition-colors"
            disabled={isLoggingOut}
            type="button"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
