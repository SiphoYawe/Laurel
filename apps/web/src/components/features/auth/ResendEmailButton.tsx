"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { resendVerificationEmail } from "@/lib/supabase/auth";

interface ResendEmailButtonProps {
  email: string;
}

const COOLDOWN_SECONDS = 60;

export function ResendEmailButton({ email }: ResendEmailButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || cooldown > 0) return;

    try {
      setIsLoading(true);
      setMessage(null);
      await resendVerificationEmail(email);
      setMessage({ type: "success", text: "Verification email sent!" });
      setCooldown(COOLDOWN_SECONDS);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to resend email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        disabled={isLoading || cooldown > 0 || !email}
        isLoading={isLoading}
        type="button"
        variant="outline"
        onClick={handleResend}
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
      </Button>
      {message && (
        <p
          className={`text-center text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
