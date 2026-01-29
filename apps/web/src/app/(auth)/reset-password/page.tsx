import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/features/auth/ResetPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reset Password - Laurel",
  description: "Set a new password for your Laurel account.",
};

export default function ResetPasswordPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Set new password</CardTitle>
        <CardDescription>Create a strong password for your account</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
