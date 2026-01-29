import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@laurel/api";

/**
 * tRPC React hooks for React Native components
 * Provides typed hooks for all API procedures
 */
export const api = createTRPCReact<AppRouter>();

/**
 * Re-export for backwards compatibility and alternative naming
 */
export const trpc = api;
