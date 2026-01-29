import { DM_Sans, Playfair_Display } from "next/font/google";

import "@/styles/globals.css";

import type { Metadata } from "next";

import { AuthProvider } from "@/lib/supabase/auth-context";
import { TRPCProvider } from "@/lib/trpc/provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laurel - AI-Powered Habit Coaching",
  description:
    "Build better habits with AI coaching using Atomic Habits methodology and evidence-based learning techniques.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${dmSans.variable} ${playfair.variable}`} lang="en">
      <body className="font-sans antialiased">
        <TRPCProvider>
          <AuthProvider>{children}</AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
