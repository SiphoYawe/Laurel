/**
 * Supabase Auth Utilities
 * Helper functions for authentication operations
 */

import type { SupabaseClient, User, Session, AuthChangeEvent } from "@supabase/supabase-js";

/**
 * Basic email format validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(client: SupabaseClient, email: string, password: string) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  client: SupabaseClient,
  email: string,
  password: string,
  metadata?: { fullName?: string; avatarUrl?: string }
) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: metadata?.fullName,
        avatar_url: metadata?.avatarUrl,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Sign out the current user
 */
export async function signOut(client: SupabaseClient) {
  const { error } = await client.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get the current session
 */
export async function getSession(client: SupabaseClient): Promise<Session | null> {
  const { data, error } = await client.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}

/**
 * Get the current user
 */
export async function getCurrentUser(client: SupabaseClient): Promise<User | null> {
  const { data, error } = await client.auth.getUser();

  if (error) {
    // Not authenticated is not an error
    if (error.message === "Auth session missing!") {
      return null;
    }
    throw new Error(error.message);
  }

  return data.user;
}

/**
 * Reset password for email
 */
export async function resetPassword(client: SupabaseClient, email: string) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  const { error } = await client.auth.resetPasswordForEmail(email);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Update user password
 */
export async function updatePassword(client: SupabaseClient, newPassword: string) {
  const { error } = await client.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(
  client: SupabaseClient,
  provider: "google" | "apple" | "github",
  redirectTo?: string
) {
  const { data, error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  client: SupabaseClient,
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const { data } = client.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return data.subscription;
}
