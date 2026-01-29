import type { ReactNode } from "react";

/**
 * Protected Layout
 * Layout for authenticated routes (dashboard, onboarding, etc.)
 * Route protection is handled by middleware.ts
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gradient-to-b from-[#F5F9F6] to-white">{children}</div>;
}
