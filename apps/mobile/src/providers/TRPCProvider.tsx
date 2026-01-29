import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { useState, type ReactNode } from "react";
import { Platform } from "react-native";
import superjson from "superjson";

import { api } from "../lib/trpc";

/**
 * Storage key for auth token in SecureStore
 */
const AUTH_TOKEN_KEY = "laurel_auth_token";

/**
 * Check if running in development mode
 */
const isDev = process.env.NODE_ENV === "development" || __DEV__;

/**
 * API base URL configuration
 * In development, uses localhost with configurable port
 * In production, should be set via environment variables
 */
function getApiUrl(): string {
  // Production API URL - check environment first
  const productionUrl = process.env.EXPO_PUBLIC_API_URL;
  if (productionUrl) {
    return `${productionUrl}/api/trpc`;
  }

  // Development mode configuration
  if (isDev) {
    // Get the debug host from Expo for physical device debugging
    const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];

    // For Android emulator: use 10.0.2.2 instead of localhost
    // For iOS simulator: localhost works
    // For physical devices: use the debug host IP
    if (Platform.OS === "android") {
      return "http://10.0.2.2:3000/api/trpc";
    }

    if (debuggerHost) {
      return `http://${debuggerHost}:3000/api/trpc`;
    }

    return "http://localhost:3000/api/trpc";
  }

  // Fallback for production (should be replaced with actual production URL)
  return "https://api.laurel.app/api/trpc";
}

/**
 * Get authentication token from secure storage
 */
async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.warn("Failed to get auth token:", error);
    return null;
  }
}

/**
 * Save authentication token to secure storage
 */
export async function setAuthToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error("Failed to save auth token:", error);
    throw error;
  }
}

/**
 * Remove authentication token from secure storage
 */
export async function removeAuthToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to remove auth token:", error);
    throw error;
  }
}

interface TRPCProviderProps {
  children: ReactNode;
}

/**
 * tRPC Provider with React Query integration for React Native
 * Provides the tRPC client context to the application
 *
 * Features:
 * - Automatic auth token injection via headers
 * - Secure token storage using expo-secure-store
 * - SuperJSON transformer for Date and other type serialization
 * - Optimized caching defaults for mobile
 */
export function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5 minutes stale time for mobile to reduce network requests
            staleTime: 1000 * 60 * 5,
            // Cache for 30 minutes
            gcTime: 1000 * 60 * 30,
            // Don't refetch on window focus (not applicable to mobile, but good default)
            refetchOnWindowFocus: false,
            // Retry failed requests up to 3 times
            retry: 3,
            // Exponential backoff for retries
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Retry mutations once on failure
            retry: 1,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: getApiUrl(),
          transformer: superjson,
          /**
           * Inject authorization header with stored token
           */
          async headers() {
            const token = await getAuthToken();
            return {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };
          },
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
