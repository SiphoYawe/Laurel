import type { Metadata } from "next";

import { OAuthButtons } from "@/components/features/auth/OAuthButtons";
import { SignUpForm } from "@/components/features/auth/SignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign Up - Laurel",
  description: "Create your Laurel account and start building better habits.",
};

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your email to create your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OAuthButtons />
        <SignUpForm />
      </CardContent>
    </Card>
  );
}
