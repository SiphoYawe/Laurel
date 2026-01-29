import type { Metadata } from "next";

import { LogoutButton } from "@/components/features/auth/LogoutButton";

export const metadata: Metadata = {
  title: "Dashboard - Laurel",
  description: "Your habit tracking dashboard.",
};

/**
 * Dashboard Page (Placeholder)
 * This will be expanded in later stories (Epic 1.5+)
 */
export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-[#2D5A3D]">Welcome to Laurel</h1>
        <p className="mt-4 text-gray-600">
          Your dashboard is coming soon! This is where you&apos;ll track your habits and see your
          progress.
        </p>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
