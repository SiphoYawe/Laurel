"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@laurel/shared/validations";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithEmail } from "@/lib/supabase/auth";

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const password = watch("password", "");

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setServerError(null);
      await signUpWithEmail(data.email, data.password);
      // Store email for verify-email page
      sessionStorage.setItem("verifyEmail", data.email);
      router.push("/verify-email");
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
        // If account already exists, show login link
        if (error.message.includes("already exists")) {
          setServerError(
            `${error.message}. Would you like to <a href="/login?email=${encodeURIComponent(data.email)}" class="text-[#2D5A3D] underline">log in instead</a>?`
          );
        }
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Server Error */}
      {serverError && (
        <div
          dangerouslySetInnerHTML={{ __html: serverError }}
          className="rounded-md bg-red-50 p-3 text-sm text-red-600"
        />
      )}

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

      {/* Password */}
      <div className="space-y-2">
        <Label error={!!errors.password} htmlFor="password">
          Password
        </Label>
        <div className="relative">
          <Input
            aria-describedby={errors.password ? "password-error" : undefined}
            autoComplete="new-password"
            className="pr-10"
            error={!!errors.password}
            id="password"
            placeholder="Create a password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500" id="password-error">
            {errors.password.message}
          </p>
        )}
        <PasswordStrengthIndicator password={password} />
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label error={!!errors.confirmPassword} htmlFor="confirmPassword">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            autoComplete="new-password"
            className="pr-10"
            error={!!errors.confirmPassword}
            id="confirmPassword"
            placeholder="Confirm your password"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
          />
          <button
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500" id="confirmPassword-error">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button className="w-full" isLoading={isSubmitting} type="submit">
        Create Account
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link className="text-[#2D5A3D] hover:underline" href="/login">
          Log in
        </Link>
      </p>
    </form>
  );
}
