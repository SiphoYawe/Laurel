import { createClient } from "./client";

import type { Provider } from "@supabase/supabase-js";

/**
 * Get the site URL for auth redirects
 * Uses NEXT_PUBLIC_SITE_URL env var, falling back to window.location.origin
 */
function getSiteUrl(): string {
  // Use environment variable if set (for production)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Fallback to window.location.origin for local development
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Default fallback
  return "http://localhost:3000";
}

/**
 * Auth error message mapping
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  user_already_registered: "An account with this email already exists",
  "User already registered": "An account with this email already exists",
  invalid_email: "Please enter a valid email address",
  weak_password: "Password must be at least 8 characters",
  email_not_confirmed: "Please verify your email to continue",
  invalid_credentials: "Invalid email or password",
  "Invalid login credentials": "Invalid email or password",
};

/**
 * Maps Supabase error to user-friendly message
 */
export function getAuthErrorMessage(error: Error | string): string {
  const message = typeof error === "string" ? error : error.message;

  // Check for exact matches first
  if (AUTH_ERROR_MESSAGES[message]) {
    return AUTH_ERROR_MESSAGES[message];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(AUTH_ERROR_MESSAGES)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Default error message
  return "An error occurred. Please try again.";
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }

  return data;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }

  return data;
}

/**
 * Sign in with OAuth provider (Google, etc.)
 */
export async function signInWithOAuth(provider: Provider) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(
      provider === "google"
        ? "Unable to sign in with Google. Please try again."
        : getAuthErrorMessage(error)
    );
  }

  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?type=recovery`,
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Get current session
 */
export async function getSession() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Get current user
 */
export async function getUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
