import { Suspense } from "react";

import type { Metadata } from "next";

import { LoginForm } from "@/components/features/auth/LoginForm";
import { OAuthButtons } from "@/components/features/auth/OAuthButtons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Log In - Laurel",
  description: "Log in to your Laurel account and continue your habit journey.",
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Log in to continue your habit journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OAuthButtons />
        <Suspense fallback={<div className="h-40 animate-pulse rounded bg-gray-100" />}>
          <LoginForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
