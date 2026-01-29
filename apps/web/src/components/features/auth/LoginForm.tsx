"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "@laurel/shared/validations";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
          // Default redirect to dashboard
          router.push("/dashboard");
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
        <div className="bg-laurel-amber/10 border-laurel-amber/20 rounded-xl border p-4 text-center">
          <p className="text-laurel-amber text-sm font-medium">Too many login attempts</p>
          <p className="text-laurel-cream/60 mt-1 text-sm">
            Please try again in {lockoutRemaining} minute{lockoutRemaining !== 1 ? "s" : ""}.
          </p>
        </div>
        <p className="text-laurel-cream/50 text-center text-sm">
          <Link
            className="text-laurel-sage hover:text-laurel-glow transition-colors"
            href="/forgot-password"
          >
            Forgot your password?
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {/* Server Error */}
      {serverError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      {/* Success message from password reset */}
      {searchParams.get("reset") === "success" && (
        <div className="bg-laurel-glow/10 border-laurel-glow/20 text-laurel-glow rounded-xl border p-3 text-sm">
          Password reset successful! Please log in with your new password.
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label
          className={`text-sm font-medium ${errors.email ? "text-red-400" : "text-laurel-cream/70"}`}
          htmlFor="email"
        >
          Email
        </label>
        <input
          aria-describedby={errors.email ? "email-error" : undefined}
          autoComplete="email"
          className={`bg-laurel-cream/5 w-full rounded-xl border px-4 py-3 ${
            errors.email ? "border-red-500/50" : "border-laurel-sage/20"
          } text-laurel-cream placeholder:text-laurel-cream/30 focus:border-laurel-sage/50 focus:ring-laurel-sage/50 transition-all duration-300 focus:outline-none focus:ring-1`}
          id="email"
          placeholder="you@example.com"
          type="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-400" id="email-error">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            className={`text-sm font-medium ${errors.password ? "text-red-400" : "text-laurel-cream/70"}`}
            htmlFor="password"
          >
            Password
          </label>
          <Link
            className="text-laurel-sage hover:text-laurel-glow text-sm transition-colors"
            href="/forgot-password"
            tabIndex={-1}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            aria-describedby={errors.password ? "password-error" : undefined}
            autoComplete="current-password"
            className={`bg-laurel-cream/5 w-full rounded-xl border px-4 py-3 pr-12 ${
              errors.password ? "border-red-500/50" : "border-laurel-sage/20"
            } text-laurel-cream placeholder:text-laurel-cream/30 focus:border-laurel-sage/50 focus:ring-laurel-sage/50 transition-all duration-300 focus:outline-none focus:ring-1`}
            id="password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="text-laurel-cream/40 hover:text-laurel-cream/70 absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-400" id="password-error">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        className="group relative w-full overflow-hidden rounded-full py-3 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting}
        type="submit"
      >
        <div className="from-laurel-glow to-laurel-sage absolute inset-0 bg-gradient-to-r" />
        <div className="from-laurel-sage to-laurel-glow absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="text-laurel-midnight relative flex items-center justify-center gap-2 font-semibold">
          {isSubmitting ? (
            <>
              <div className="border-laurel-midnight/30 border-t-laurel-midnight h-5 w-5 animate-spin rounded-full border-2" />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </span>
      </button>

      {/* Signup Link */}
      <p className="text-laurel-cream/50 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          className="text-laurel-sage hover:text-laurel-glow font-medium transition-colors"
          href="/signup"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
