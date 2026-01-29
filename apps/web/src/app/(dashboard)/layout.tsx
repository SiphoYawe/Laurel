import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";

/**
 * Dashboard Layout
 * Wraps all authenticated dashboard pages with AppShell navigation
 * Route protection is handled by middleware.ts
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  // TODO: Fetch actual badge counts from context/API
  // For now, using placeholder values for demo
  const badges = {
    chat: false, // Would be true if unread messages
    habits: 0, // Would be count of incomplete habits
    pods: false, // Would be true if new pod activity
    profile: false, // Would be true if action needed
  };

  return <AppShell badges={badges}>{children}</AppShell>;
}
