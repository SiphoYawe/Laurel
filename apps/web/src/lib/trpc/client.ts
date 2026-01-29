"use client";

import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@laurel/api";

/**
 * tRPC React hooks for client components
 */
export const trpc = createTRPCReact<AppRouter>();
