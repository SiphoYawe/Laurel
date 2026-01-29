import { Inter } from "next/font/google";

import "@/styles/globals.css";

import type { Metadata } from "next";

import { AuthProvider } from "@/lib/supabase/auth-context";
import { TRPCProvider } from "@/lib/trpc/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Laurel - AI-Powered Habit Coaching",
  description:
    "Build better habits with AI coaching using Atomic Habits methodology and evidence-based learning techniques.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCProvider>
          <AuthProvider>{children}</AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
