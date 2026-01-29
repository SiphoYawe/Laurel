import { Suspense } from "react";

import type { Metadata } from "next";

import { LoginForm } from "@/components/features/auth/LoginForm";
import { OAuthButtons } from "@/components/features/auth/OAuthButtons";

export const metadata: Metadata = {
  title: "Log In - Laurel",
  description: "Log in to your Laurel account and continue your habit journey.",
};

export default function LoginPage() {
  return (
    <div className="relative">
      {/* Glow effect behind card */}
      <div className="from-laurel-glow/20 to-laurel-sage/20 absolute -inset-1 rounded-3xl bg-gradient-to-r opacity-50 blur-xl" />

      {/* Card */}
      <div className="bg-laurel-moss/40 border-laurel-sage/20 relative rounded-2xl border p-8 backdrop-blur-sm">
        <div className="mb-6 space-y-1">
          <h1 className="font-display text-laurel-cream text-2xl">Welcome back</h1>
          <p className="text-laurel-cream/50 text-sm">Log in to continue your habit journey</p>
        </div>

        <div className="space-y-6">
          <OAuthButtons />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="border-laurel-sage/20 w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-laurel-moss/40 text-laurel-cream/40 px-3">
                or continue with email
              </span>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="space-y-4">
                <div className="bg-laurel-sage/10 h-12 animate-pulse rounded-lg" />
                <div className="bg-laurel-sage/10 h-12 animate-pulse rounded-lg" />
                <div className="bg-laurel-glow/20 h-12 animate-pulse rounded-full" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
