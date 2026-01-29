"use client";

import { CheckCircle, Home, MessageCircle, User, Users } from "lucide-react";

import { TabBarItem } from "./TabBarItem";

interface TabBadges {
  chat?: boolean;
  habits?: number;
  pods?: boolean;
  profile?: boolean;
}

interface BottomTabBarProps {
  badges?: TabBadges;
}

/**
 * BottomTabBar Component
 * Fixed bottom navigation bar for mobile/tablet (< 1024px)
 * 5 tabs: Home, Chat, Habits, Pods, Profile
 */
export function BottomTabBar({ badges = {} }: BottomTabBarProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Main navigation"
      className="border-border bg-background pb-safe fixed inset-x-0 bottom-0 z-50 border-t lg:hidden"
      role="navigation"
    >
      <div className="flex h-16 items-center justify-around">
        <TabBarItem href="/dashboard" icon={Home} label="Home" onScrollToTop={scrollToTop} />
        <TabBarItem
          badge={badges.chat}
          href="/chat"
          icon={MessageCircle}
          label="Chat"
          onScrollToTop={scrollToTop}
        />
        <TabBarItem
          badge={badges.habits}
          href="/habits"
          icon={CheckCircle}
          label="Habits"
          onScrollToTop={scrollToTop}
        />
        <TabBarItem
          badge={badges.pods}
          href="/pods"
          icon={Users}
          label="Pods"
          onScrollToTop={scrollToTop}
        />
        <TabBarItem
          badge={badges.profile}
          href="/profile"
          icon={User}
          label="Profile"
          onScrollToTop={scrollToTop}
        />
      </div>
    </nav>
  );
}
