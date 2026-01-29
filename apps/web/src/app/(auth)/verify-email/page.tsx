"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ResendEmailButton } from "@/components/features/auth/ResendEmailButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    // Get email from sessionStorage (set during signup)
    const storedEmail = sessionStorage.getItem("verifyEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5E9]">
          <Mail className="h-8 w-8 text-[#2D5A3D]" />
        </div>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification link to{" "}
          {email ? <span className="font-medium text-gray-700">{email}</span> : "your email"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-700">Next steps:</p>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>Open your email inbox</li>
            <li>Click the verification link in the email</li>
            <li>You&apos;ll be redirected to complete setup</li>
          </ol>
          <p className="mt-3 text-xs text-gray-500">
            Can&apos;t find the email? Check your spam folder.
          </p>
        </div>

        <ResendEmailButton email={email} />

        <div className="text-center">
          <Link href="/signup">
            <Button className="text-sm" variant="ghost">
              Use a different email
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
