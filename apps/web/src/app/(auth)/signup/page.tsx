import type { Metadata } from "next";

import { OAuthButtons } from "@/components/features/auth/OAuthButtons";
import { SignUpForm } from "@/components/features/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up - Laurel",
  description: "Create your Laurel account and start building better habits.",
};

export default function SignUpPage() {
  return (
    <div className="relative">
      {/* Glow effect behind card */}
      <div className="from-laurel-glow/20 to-laurel-sage/20 absolute -inset-1 rounded-3xl bg-gradient-to-r opacity-50 blur-xl" />

      {/* Card */}
      <div className="bg-laurel-moss/40 border-laurel-sage/20 relative rounded-2xl border p-8 backdrop-blur-sm">
        <div className="mb-6 space-y-1">
          <h1 className="font-display text-laurel-cream text-2xl">Create an account</h1>
          <p className="text-laurel-cream/50 text-sm">Start your journey to better habits</p>
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

          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
