import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding - Laurel",
  description: "Set up your Laurel account.",
};

/**
 * Onboarding Page (Placeholder)
 * This will be expanded in Story 1.6
 */
export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-[#2D5A3D]">Let&apos;s Get Started</h1>
        <p className="mt-4 text-gray-600">
          Welcome to Laurel! We&apos;ll help you set up your account and start building better
          habits.
        </p>
        <p className="mt-4 text-sm text-gray-500">(Full onboarding flow coming in Story 1.6)</p>
        <div className="mt-8">
          <Link
            className="inline-flex items-center justify-center rounded-md bg-[#2D5A3D] px-4 py-2 text-sm font-medium text-white hover:bg-[#234830] focus:outline-none focus:ring-2 focus:ring-[#2D5A3D] focus:ring-offset-2"
            href="/dashboard"
          >
            Skip to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
