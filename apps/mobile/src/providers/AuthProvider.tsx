import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import type { Session, User, AuthError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

/**
 * Authentication result type for sign in/up operations.
 */
interface AuthResult {
  success: boolean;
  error?: AuthError | null;
  needsEmailVerification?: boolean;
}

/**
 * Auth context value interface.
 */
export interface AuthContextValue {
  /** Current user session */
  session: Session | null;
  /** Current authenticated user */
  user: User | null;
  /** Loading state during initial session fetch */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<AuthResult>;
  /** Sign up with email and password */
  signUp: (email: string, password: string) => Promise<AuthResult>;
  /** Sign out the current user */
  signOut: () => Promise<{ success: boolean; error?: AuthError | null }>;
}

/**
 * Auth context with undefined default to enforce provider usage.
 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Props for AuthProvider component.
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication provider that manages session state and provides auth methods.
 * Handles session persistence, auto-refresh, and auth state changes.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize session on mount and subscribe to auth state changes.
   */
  useEffect(() => {
    // Get initial session
    const initializeSession = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error("Error fetching initial session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign in with email and password.
   */
  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        success: false,
        error: error as AuthError,
      };
    }
  }, []);

  /**
   * Sign up with email and password.
   * Returns whether email verification is needed.
   */
  const signUp = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const {
        data: { session: newSession },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error };
      }

      // If no session is returned, email verification is required
      const needsEmailVerification = !newSession;

      return {
        success: true,
        needsEmailVerification,
      };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        error: error as AuthError,
      };
    }
  }, []);

  /**
   * Sign out the current user.
   */
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      return {
        success: false,
        error: error as AuthError,
      };
    }
  }, []);

  /**
   * Memoized context value to prevent unnecessary re-renders.
   */
  const contextValue = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      isLoading,
      isAuthenticated: !!session && !!user,
      signIn,
      signUp,
      signOut,
    }),
    [session, user, isLoading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
