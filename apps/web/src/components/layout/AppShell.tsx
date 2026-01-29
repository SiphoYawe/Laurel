"use client";

import { BottomTabBar } from "./BottomTabBar";
import { Sidebar } from "./Sidebar";

import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  badges?: {
    chat?: boolean;
    habits?: number;
    pods?: boolean;
    profile?: boolean;
  };
}

/**
 * AppShell Component
 * Main layout wrapper providing responsive navigation
 * - Mobile/Tablet (< 1024px): Bottom tab bar
 * - Desktop (>= 1024px): Left sidebar
 */
export function AppShell({ children, badges }: AppShellProps) {
  return (
    <div className="bg-background min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar badges={badges} />

      {/* Main Content Area */}
      <main className="min-h-screen pb-20 lg:pb-0 lg:pl-64">
        <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>

      {/* Mobile/Tablet Bottom Tab Bar */}
      <BottomTabBar badges={badges} />
    </div>
  );
}
