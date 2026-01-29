import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "@/providers/AuthProvider";

/**
 * Hook to access authentication context.
 * Must be used within an AuthProvider.
 *
 * @returns The auth context value containing session, user, and auth methods.
 * @throws Error if used outside of AuthProvider.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, signIn, signOut } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <LoginScreen onSignIn={signIn} />;
 *   }
 *
 *   return <UserProfile user={user} onSignOut={signOut} />;
 * }
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
