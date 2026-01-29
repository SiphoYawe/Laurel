import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo";

/**
 * Auth Layout
 * Centered layout for authentication pages (signup, login, verify-email)
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#F5F9F6] to-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <Logo showText size="md" />
        </div>

        {children}
      </div>
    </div>
  );
}
