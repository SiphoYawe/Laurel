"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { newPasswordSchema, type NewPasswordFormData } from "@laurel/shared/validations";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onBlur",
  });

  const password = watch("password", "");

  const onSubmit = async (data: NewPasswordFormData) => {
    try {
      setServerError(null);
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      // Redirect to login with success message
      router.push("/login?reset=success");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("same as")) {
          setServerError("New password must be different from your old password.");
        } else {
          setServerError(error.message);
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
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{serverError}</div>
      )}

      <p className="text-sm text-gray-600">
        Enter your new password below. Make sure it&apos;s at least 8 characters.
      </p>

      {/* New Password */}
      <div className="space-y-2">
        <Label error={!!errors.password} htmlFor="password">
          New Password
        </Label>
        <div className="relative">
          <Input
            aria-describedby={errors.password ? "password-error" : undefined}
            autoComplete="new-password"
            className="pr-10"
            error={!!errors.password}
            id="password"
            placeholder="Enter new password"
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
            placeholder="Confirm new password"
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
        Reset Password
      </Button>
    </form>
  );
}
