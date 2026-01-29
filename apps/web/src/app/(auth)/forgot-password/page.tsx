import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/features/auth/ForgotPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Forgot Password - Laurel",
  description: "Reset your Laurel account password.",
};

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>No worries, we&apos;ll help you reset it</CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
