"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "@laurel/shared/validations";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail } from "@/lib/supabase/auth";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in ms
const ATTEMPTS_KEY = "login_attempts";
const LOCKOUT_KEY = "login_lockout";

interface LoginAttempts {
  count: number;
  timestamp: number;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  // Pre-fill email if provided in URL (from signup redirect)
  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      setValue("email", email);
    }
  }, [searchParams, setValue]);

  // Check for existing lockout
  const checkLockout = useCallback(() => {
    const lockoutEnd = localStorage.getItem(LOCKOUT_KEY);
    if (lockoutEnd) {
      const remaining = parseInt(lockoutEnd, 10) - Date.now();
      if (remaining > 0) {
        setIsRateLimited(true);
        setLockoutRemaining(Math.ceil(remaining / 1000 / 60)); // minutes
        return true;
      } else {
        // Lockout expired, clear it
        localStorage.removeItem(LOCKOUT_KEY);
        localStorage.removeItem(ATTEMPTS_KEY);
        setIsRateLimited(false);
      }
    }
    return false;
  }, []);

  useEffect(() => {
    checkLockout();
    const interval = setInterval(checkLockout, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [checkLockout]);

  const trackFailedAttempt = () => {
    const stored = localStorage.getItem(ATTEMPTS_KEY);
    let attempts: LoginAttempts = stored ? JSON.parse(stored) : { count: 0, timestamp: Date.now() };

    // Reset if attempts are old
    if (Date.now() - attempts.timestamp > LOCKOUT_DURATION) {
      attempts = { count: 0, timestamp: Date.now() };
    }

    attempts.count++;
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));

    if (attempts.count >= MAX_ATTEMPTS) {
      const lockoutEnd = Date.now() + LOCKOUT_DURATION;
      localStorage.setItem(LOCKOUT_KEY, lockoutEnd.toString());
      setIsRateLimited(true);
      setLockoutRemaining(15);
    }
  };

  const clearAttempts = () => {
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_KEY);
    setIsRateLimited(false);
  };

  const onSubmit = async (data: SignInFormData) => {
    if (checkLockout()) {
      return;
    }

    try {
      setServerError(null);
      const result = await signInWithEmail(data.email, data.password);

      // Clear attempts on success
      clearAttempts();

      if (result.user) {
        // Check for intended destination from protected route redirect
        const next = searchParams.get("next");
        if (next && next.startsWith("/")) {
          router.push(next);
        } else {
          // Default redirect - onboarding check will be implemented when profile is available
          router.push("/onboarding");
        }
      }
    } catch (error) {
      trackFailedAttempt();
      if (error instanceof Error) {
        if (isRateLimited) {
          setServerError("Too many attempts. Please try again later.");
        } else {
          setServerError(error.message);
        }
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (isRateLimited) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-amber-50 p-4 text-center">
          <p className="text-sm font-medium text-amber-800">Too many login attempts</p>
          <p className="mt-1 text-sm text-amber-600">
            Please try again in {lockoutRemaining} minute{lockoutRemaining !== 1 ? "s" : ""}.
          </p>
        </div>
        <p className="text-center text-sm text-gray-600">
          <Link className="text-[#2D5A3D] hover:underline" href="/forgot-password">
            Forgot your password?
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Server Error */}
      {serverError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{serverError}</div>
      )}

      {/* Success message from password reset */}
      {searchParams.get("reset") === "success" && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
          Password reset successful! Please log in with your new password.
        </div>
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
        <div className="flex items-center justify-between">
          <Label error={!!errors.password} htmlFor="password">
            Password
          </Label>
          <Link
            className="text-sm text-[#2D5A3D] hover:underline"
            href="/forgot-password"
            tabIndex={-1}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            aria-describedby={errors.password ? "password-error" : undefined}
            autoComplete="current-password"
            className="pr-10"
            error={!!errors.password}
            id="password"
            placeholder="Enter your password"
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
      </div>

      {/* Submit */}
      <Button className="w-full" isLoading={isSubmitting} type="submit">
        Log In
      </Button>

      {/* Signup Link */}
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link className="text-[#2D5A3D] hover:underline" href="/signup">
          Sign up
        </Link>
      </p>
    </form>
  );
}
