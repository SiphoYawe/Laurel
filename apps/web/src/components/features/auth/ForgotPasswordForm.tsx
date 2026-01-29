"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { passwordResetSchema, type PasswordResetFormData } from "@laurel/shared/validations";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendPasswordResetEmail } from "@/lib/supabase/auth";

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: PasswordResetFormData) => {
    try {
      setServerError(null);
      await sendPasswordResetEmail(data.email);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
          <p className="mt-1 text-sm text-gray-500">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium">{submittedEmail}</span>
          </p>
        </div>
        <div className="pt-2">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              className="text-[#2D5A3D] hover:underline"
              type="button"
              onClick={() => setIsSuccess(false)}
            >
              try again
            </button>
          </p>
        </div>
        <div className="pt-4">
          <Link className="text-sm text-[#2D5A3D] hover:underline" href="/login">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Server Error */}
      {serverError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{serverError}</div>
      )}

      <p className="text-sm text-gray-600">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      {/* Email */}
      <div className="space-y-2">
        <Label error={!!errors.email} htmlFor="email">
          Email
        </Label>
        <Input
          aria-describedby={errors.email ? "email-error" : undefined}
          autoComplete="email"
          error={!!errors.email}
          id="email"
          placeholder="you@example.com"
          type="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500" id="email-error">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button className="w-full" isLoading={isSubmitting} type="submit">
        Send Reset Link
      </Button>

      {/* Back to Login */}
      <p className="text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link className="text-[#2D5A3D] hover:underline" href="/login">
          Log in
        </Link>
      </p>
    </form>
  );
}
